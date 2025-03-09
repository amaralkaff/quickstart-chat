import React, { useState, useEffect } from 'react';
import './App.css';
import { DbConnection, EventContext, User, Chat, ErrorContext } from './module_bindings';
import { Identity } from '@clockworklabs/spacetimedb-sdk';

export type PrettyMessage = {
  senderName: string;
  text: string;
  timestamp: bigint;
};

function useUsers(conn: DbConnection | null): User[] {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!conn) return;
    const onInsert = (_ctx: EventContext, user: User) => {
      setUsers(prev => [...prev, user]);
    };
    conn.db.user.onInsert(onInsert);

    const onDelete = (_ctx: EventContext, user: User) => {
      setUsers(prev =>
        prev.filter(p => p.id !== user.id)
      );
    };
    conn.db.user.onDelete(onDelete);

    return () => {
      conn.db.user.removeOnInsert(onInsert);
      conn.db.user.removeOnDelete(onDelete);
    };
  }, [conn]);

  return users;
}

function useChats(conn: DbConnection | null): Chat[] {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!conn) return;
    const onInsert = (_ctx: EventContext, chat: Chat) => {
      setChats(prev => [...prev, chat]);
    };
    conn.db.chat.onInsert(onInsert);

    return () => {
      conn.db.chat.removeOnInsert(onInsert);
    };
  }, [conn]);

  return chats;
}

function App() {
  const [newName, setNewName] = useState('');
  const [settingName, setSettingName] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState<boolean>(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [conn, setConn] = useState<DbConnection | null>(null);
  const users = useUsers(conn);
  const chats = useChats(conn);
  const messageListRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [chats]);

  useEffect(() => {
    // Clear local storage to ensure we're using fresh authentication
    localStorage.removeItem('auth_token');
    
    const subscribeToQueries = (conn: DbConnection, queries: string[]) => {
      let count = 0;
      for (const query of queries) {
        conn
          ?.subscriptionBuilder()
          .onApplied(() => {
            count++;
            if (count === queries.length) {
              console.log('SDK client cache initialized.');
            }
          })
          .subscribe(query);
      }
    };

    const onConnect = (
      conn: DbConnection,
      identity: Identity,
      token: string
    ) => {
      setIdentity(identity);
      setConnected(true);
      localStorage.setItem('auth_token', token);
      console.log(
        'Connected to SpacetimeDB with identity:',
        identity.toHexString()
      );
      conn.reducers.onSayHello(() => {
        console.log('Hello sent.');
      });

      subscribeToQueries(conn, ['SELECT * FROM user', 'SELECT * FROM chat']);
    };

    const onDisconnect = () => {
      console.log('Disconnected from SpacetimeDB');
      setConnected(false);
    };

    const onConnectError = (_ctx: ErrorContext, err: Error) => {
      console.log('Error connecting to SpacetimeDB:', err);
      setSystemMessage(prev => prev + `\nConnection error: ${err}`);
    };

    setConn(
      DbConnection.builder()
        .withUri('ws://localhost:3000')
        .withModuleName('quickstart-chat')
        .withToken(localStorage.getItem('auth_token') || '')
        .onConnect(onConnect)
        .onDisconnect(onDisconnect)
        .onConnectError(onConnectError)
        .build()
    );
  }, []);

  const onSubmitNewName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!conn || !identity) return;
    conn.reducers.addUser(identity.toHexString(), newName);
    setSettingName(false);
  };

  const onMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!conn || !identity) {
      setSystemMessage('Not connected to SpacetimeDB');
      return;
    }

    if (!currentUser?.name) {
      alert('Please set your name before sending messages!');
      setSettingName(true);
      return;
    }
    
    if (!newMessage.trim()) {
      return; // Don't send empty messages
    }

    const userId = identity.toHexString();
    try {
      conn.reducers.sendMessage(userId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      setSystemMessage(prev => prev + `\nFailed to send message: ${error}`);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleTimeString();
  };

  const currentUser = identity ? users.find(u => u.id === identity.toHexString()) : null;
  const name = currentUser?.name || '';

  if (!conn || !connected) {
    return (
      <div className="App">
        <h1>Connecting to SpacetimeDB...</h1>
        <p>{systemMessage}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="profile">
        <h1>Profile</h1>
        {!settingName ? (
          <>
            <p>{name}</p>
            <button
              onClick={() => {
                setSettingName(true);
                setNewName(name);
              }}
            >
              Edit Name
            </button>
          </>
        ) : (
          <form onSubmit={onSubmitNewName}>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
      <div className="content-wrapper">
        <div className="message">
          <h1>Chat</h1>
          <div className="message-list" ref={messageListRef}>
            {chats.length < 1 && <p>No messages yet</p>}
            {chats
              .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
              .map((chat, key) => {
                const sender = users.find(u => u.id === chat.userId)?.name || chat.userId;
                const isCurrentUser = chat.userId === identity?.toHexString();
                
                return (
                  <div 
                    key={key} 
                    className={`message-item ${isCurrentUser ? 'message-mine' : 'message-other'}`}
                  >
                    <p className="message-sender">{sender}</p>
                    <p className="message-text">{chat.text}</p>
                    <p className="message-timestamp">{formatTimestamp(chat.timestamp)}</p>
                  </div>
                );
              })
            }
          </div>
          <form onSubmit={onMessageSubmit} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder={currentUser?.name ? "Type your message..." : "Please set your name first..."}
              className="message-input"
              disabled={!currentUser?.name}
            />
            <button 
              type="submit" 
              className="send-button" 
              disabled={!newMessage.trim() || !currentUser?.name}
            >
              {currentUser?.name ? "Send" : "Set Name First"}
            </button>
          </form>
        </div>
        <pre className="spacetime-logo">
{`
                                                                            ⣠⡞⠁                        
                                              ⣀⣀⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣀⣀⣀⣀⣀⣀⣀⣤⣤⡴⠒    ⢀⣠⡾⠋                       
                                         ⢀⣤⣶⣾88888888888888888888⠿⠋    ⢀⣴8⡟⠁                           
                                      ⢀⣤⣾88888⡿⠿⠛⠛⠛⠛⠛⠛⠛⠛⠻⠿88888⠟⠁    ⣠⣾88⡟                           
                                    ⢀⣴88888⠟⠋⠁ ⣀⣤⠤⠶⠶⠶⠶⠶⠤⣤⣀ ⠉⠉⠉    ⢀⣴⣾888⡟                            
                                   ⣠88888⠋  ⣠⠶⠋⠉         ⠉⠙⠶⣄   ⢀⣴888888⠃                              
                                  ⣰8888⡟⠁ ⣰⠟⠁               ⠈⠻⣆ ⠈⢿888888                               
                                 ⢠8888⡟  ⡼⠁                   ⠈⢧ ⠈⢿8888⡿                               
                                 ⣼8888⠁ ⢸⠇                     ⠸⡇ ⠘8888⣷                               
                                 88888  8                       8  88888                               
                                 ⢿8888⡄ ⢸⡆                     ⢰⡇ ⢀8888⡟                               
                                 ⣾8888⣷⡀ ⢳⡀                   ⢀⡞  ⣼8888⠃                               
                                 888888⣷⡀ ⠹⣦⡀               ⢀⣴⠏ ⢀⣼8888⠏                                
                                ⢠888888⠟⠁   ⠙⠶⣄⣀         ⣀⣠⠶⠋  ⣠88888⠋                                 
                                ⣼888⡿⠟⠁    ⣀⣀⣀ ⠉⠛⠒⠶⠶⠶⠶⠶⠒⠛⠉ ⢀⣠⣴88888⠟⠁                                  
                               ⣼88⡿⠋    ⢀⣴88888⣶⣦⣤⣤⣤⣤⣤⣤⣤⣤⣶⣾88888⡿⠛⠁                                    
                             ⢀⣼8⠟⠁    ⣠⣶88888888888888888888⡿⠿⠛⠁                                       
                            ⣠⡾⠋⠁    ⠤⠞⠛⠛⠉⠉⠉⠉⠉⠉⠉⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠉⠉                                            
                          ⢀⡼⠋                                                                          
                        ⢀⠔⠁                                                                            
                                                                                                       
                      "AmangLy, i just follow quickstart and actually it's working"`}
        </pre>
      </div>
    </div>
  );
}

export default App;