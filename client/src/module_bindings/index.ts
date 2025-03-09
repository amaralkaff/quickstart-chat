// THIS FILE IS AUTOMATICALLY GENERATED BY SPACETIMEDB. EDITS TO THIS FILE
// WILL NOT BE SAVED. MODIFY TABLES IN YOUR MODULE SOURCE CODE INSTEAD.

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import {
  AlgebraicType,
  AlgebraicValue,
  BinaryReader,
  BinaryWriter,
  CallReducerFlags,
  ConnectionId,
  DbConnectionBuilder,
  DbConnectionImpl,
  DbContext,
  ErrorContextInterface,
  Event,
  EventContextInterface,
  Identity,
  ProductType,
  ProductTypeElement,
  ReducerEventContextInterface,
  SubscriptionBuilderImpl,
  SubscriptionEventContextInterface,
  SumType,
  SumTypeVariant,
  TableCache,
  TimeDuration,
  Timestamp,
  deepEqual,
} from "@clockworklabs/spacetimedb-sdk";

// Import and reexport all reducer arg types
import { AddUser } from "./add_user_reducer.ts";
export { AddUser };
import { IdentityConnected } from "./identity_connected_reducer.ts";
export { IdentityConnected };
import { IdentityDisconnected } from "./identity_disconnected_reducer.ts";
export { IdentityDisconnected };
import { SayHello } from "./say_hello_reducer.ts";
export { SayHello };
import { SendMessage } from "./send_message_reducer.ts";
export { SendMessage };

// Import and reexport all table handle types
import { ChatTableHandle } from "./chat_table.ts";
export { ChatTableHandle };
import { UserTableHandle } from "./user_table.ts";
export { UserTableHandle };

// Import and reexport all types
import { Chat } from "./chat_type.ts";
export { Chat };
import { User } from "./user_type.ts";
export { User };

const REMOTE_MODULE = {
  tables: {
    chat: {
      tableName: "chat",
      rowType: Chat.getTypeScriptAlgebraicType(),
    },
    user: {
      tableName: "user",
      rowType: User.getTypeScriptAlgebraicType(),
    },
  },
  reducers: {
    add_user: {
      reducerName: "add_user",
      argsType: AddUser.getTypeScriptAlgebraicType(),
    },
    identity_connected: {
      reducerName: "identity_connected",
      argsType: IdentityConnected.getTypeScriptAlgebraicType(),
    },
    identity_disconnected: {
      reducerName: "identity_disconnected",
      argsType: IdentityDisconnected.getTypeScriptAlgebraicType(),
    },
    say_hello: {
      reducerName: "say_hello",
      argsType: SayHello.getTypeScriptAlgebraicType(),
    },
    send_message: {
      reducerName: "send_message",
      argsType: SendMessage.getTypeScriptAlgebraicType(),
    },
  },
  // Constructors which are used by the DbConnectionImpl to
  // extract type information from the generated RemoteModule.
  //
  // NOTE: This is not strictly necessary for `eventContextConstructor` because
  // all we do is build a TypeScript object which we could have done inside the
  // SDK, but if in the future we wanted to create a class this would be
  // necessary because classes have methods, so we'll keep it.
  eventContextConstructor: (imp: DbConnectionImpl, event: Event<Reducer>) => {
    return {
      ...(imp as DbConnection),
      event
    }
  },
  dbViewConstructor: (imp: DbConnectionImpl) => {
    return new RemoteTables(imp);
  },
  reducersConstructor: (imp: DbConnectionImpl, setReducerFlags: SetReducerFlags) => {
    return new RemoteReducers(imp, setReducerFlags);
  },
  setReducerFlagsConstructor: () => {
    return new SetReducerFlags();
  }
}

// A type representing all the possible variants of a reducer.
export type Reducer = never
| { name: "AddUser", args: AddUser }
| { name: "IdentityConnected", args: IdentityConnected }
| { name: "IdentityDisconnected", args: IdentityDisconnected }
| { name: "SayHello", args: SayHello }
| { name: "SendMessage", args: SendMessage }
;

export class RemoteReducers {
  constructor(private connection: DbConnectionImpl, private setCallReducerFlags: SetReducerFlags) {}

  addUser(id: string, name: string) {
    const __args = { id, name };
    let __writer = new BinaryWriter(1024);
    AddUser.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("add_user", __argsBuffer, this.setCallReducerFlags.addUserFlags);
  }

  onAddUser(callback: (ctx: ReducerEventContext, id: string, name: string) => void) {
    this.connection.onReducer("add_user", callback);
  }

  removeOnAddUser(callback: (ctx: ReducerEventContext, id: string, name: string) => void) {
    this.connection.offReducer("add_user", callback);
  }

  onIdentityConnected(callback: (ctx: ReducerEventContext) => void) {
    this.connection.onReducer("identity_connected", callback);
  }

  removeOnIdentityConnected(callback: (ctx: ReducerEventContext) => void) {
    this.connection.offReducer("identity_connected", callback);
  }

  onIdentityDisconnected(callback: (ctx: ReducerEventContext) => void) {
    this.connection.onReducer("identity_disconnected", callback);
  }

  removeOnIdentityDisconnected(callback: (ctx: ReducerEventContext) => void) {
    this.connection.offReducer("identity_disconnected", callback);
  }

  sayHello() {
    this.connection.callReducer("say_hello", new Uint8Array(0), this.setCallReducerFlags.sayHelloFlags);
  }

  onSayHello(callback: (ctx: ReducerEventContext) => void) {
    this.connection.onReducer("say_hello", callback);
  }

  removeOnSayHello(callback: (ctx: ReducerEventContext) => void) {
    this.connection.offReducer("say_hello", callback);
  }

  sendMessage(userId: string, text: string) {
    const __args = { userId, text };
    let __writer = new BinaryWriter(1024);
    SendMessage.getTypeScriptAlgebraicType().serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("send_message", __argsBuffer, this.setCallReducerFlags.sendMessageFlags);
  }

  onSendMessage(callback: (ctx: ReducerEventContext, userId: string, text: string) => void) {
    this.connection.onReducer("send_message", callback);
  }

  removeOnSendMessage(callback: (ctx: ReducerEventContext, userId: string, text: string) => void) {
    this.connection.offReducer("send_message", callback);
  }

}

export class SetReducerFlags {
  addUserFlags: CallReducerFlags = 'FullUpdate';
  addUser(flags: CallReducerFlags) {
    this.addUserFlags = flags;
  }

  sayHelloFlags: CallReducerFlags = 'FullUpdate';
  sayHello(flags: CallReducerFlags) {
    this.sayHelloFlags = flags;
  }

  sendMessageFlags: CallReducerFlags = 'FullUpdate';
  sendMessage(flags: CallReducerFlags) {
    this.sendMessageFlags = flags;
  }

}

export class RemoteTables {
  constructor(private connection: DbConnectionImpl) {}

  get chat(): ChatTableHandle {
    return new ChatTableHandle(this.connection.clientCache.getOrCreateTable<Chat>(REMOTE_MODULE.tables.chat));
  }

  get user(): UserTableHandle {
    return new UserTableHandle(this.connection.clientCache.getOrCreateTable<User>(REMOTE_MODULE.tables.user));
  }
}

export class SubscriptionBuilder extends SubscriptionBuilderImpl<RemoteTables, RemoteReducers, SetReducerFlags> { }

export class DbConnection extends DbConnectionImpl<RemoteTables, RemoteReducers, SetReducerFlags> {
  static builder = (): DbConnectionBuilder<DbConnection, ErrorContext, SubscriptionEventContext> => {
    return new DbConnectionBuilder<DbConnection, ErrorContext, SubscriptionEventContext>(REMOTE_MODULE, (imp: DbConnectionImpl) => imp as DbConnection);
  }
  subscriptionBuilder = (): SubscriptionBuilder => {
    return new SubscriptionBuilder(this);
  }
}

export type EventContext = EventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags, Reducer>;
export type ReducerEventContext = ReducerEventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags, Reducer>;
export type SubscriptionEventContext = SubscriptionEventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags>;
export type ErrorContext = ErrorContextInterface<RemoteTables, RemoteReducers, SetReducerFlags>;
