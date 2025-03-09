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
                                                                                                   
                  "AmangLy, i just follow quickstart and actually it's working"

A simple real-time chat application built with SpacetimeDB, featuring a React frontend and Rust backend. This project follows the official quickstart and I just learn something new and 15x faster than postgres :D
- Frontend: https://spacetimedb.com/docs/sdks/typescript/quickstart 
- Backend: https://spacetimedb.com/docs/modules/rust/quickstart

## Quick Setup

### Prerequisites
- Node.js
- pnpm
- Rust
- SpacetimeDB CLI (`spacetime`)

### Start Server
```bash
cd server
cargo build --release
spacetime project new quickstart-chat
spacetime publish
```

### Start Client
```bash
cd client
pnpm install
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Links
- [SpacetimeDB Docs](https://docs.spacetimedb.com)
- [SpacetimeDB GitHub](https://github.com/clockworklabs/SpacetimeDB)