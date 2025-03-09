use spacetimedb::{ReducerContext, Table};
// We'll use a static counter for timestamps
use std::sync::atomic::{AtomicU64, Ordering};

// Static counter for timestamps
static COUNTER: AtomicU64 = AtomicU64::new(1);

#[spacetimedb::table(name = user, public)]
pub struct User {
    pub id: String,
    pub name: String,
}

#[spacetimedb::table(name = chat, public)]
pub struct Chat {
    pub id: u64,
    pub user_id: String,
    pub text: String,
    pub timestamp: u64,
}

#[spacetimedb::reducer(init)]
pub fn init(ctx: &ReducerContext) {
    // Add a system user and welcome message
    let system_id = "system".to_string();
    ctx.db.user().insert(User { 
        id: system_id.clone(),
        name: "System".to_string(),
    });
    
    let msg_id = COUNTER.fetch_add(1, Ordering::SeqCst);
    ctx.db.chat().insert(Chat { 
        id: msg_id,
        user_id: system_id,
        text: "Welcome to the chat!".to_string(),
        timestamp: msg_id,
    });
    
    log::info!("Database initialized with system user and welcome message");
}

#[spacetimedb::reducer(client_connected)]
pub fn identity_connected(_ctx: &ReducerContext) {
    // Called everytime a new client connects
}

#[spacetimedb::reducer(client_disconnected)]
pub fn identity_disconnected(_ctx: &ReducerContext) {
    // Called everytime a client disconnects
}

#[spacetimedb::reducer]
pub fn add_user(ctx: &ReducerContext, id: String, name: String) {
    ctx.db.user().insert(User { id, name });
}

#[spacetimedb::reducer]
pub fn send_message(ctx: &ReducerContext, user_id: String, text: String) {
    let msg_id = COUNTER.fetch_add(1, Ordering::SeqCst);
    
    ctx.db.chat().insert(Chat { 
        id: msg_id,
        user_id,
        text,
        timestamp: msg_id,
    });
}

#[spacetimedb::reducer]
pub fn say_hello(ctx: &ReducerContext) {
    for person in ctx.db.user().iter() {
        log::info!("Hello, {}!", person.name);
    }
    log::info!("Hello, World!");
}
