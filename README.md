# Mope Legacy

Mope Legacy is an open-source recreation of the 2018 [mope.io](https://mope.io) server.
The repository contains a cross-platform Java server (`server/`) and a minimal browser client (`client/`) so the community can keep playing this classic version of the game.

## Features
- Faithful reproduction of mope.io 2018 mechanics and content.
- Java server capable of handling hundreds of players.
- Multiple game modes and configurable starting tiers.
- Simple static HTML/JS client with built-in "LOCAL" server entry.
- Easy to build and run on any platform with Java 17+.
- Fully open source and actively developed.

## Prerequisites
- Java Runtime **and** JDK 17 or newer.
- [Apache Maven](https://maven.apache.org/) 3+.

## Getting a Release
Pre-built server jars are published on the [releases page](https://github.com/YesdXploiter/mope-legacy/releases).

## Build from Source
1. Clone the repository.
2. Build the server module:
   ```bash
   cd server/mope
   mvn clean package
   ```
3. The compiled `mopelegacyserver.jar` will be in `server/mope/target/`.

## Configuration
Server options are stored in `server/config.txt`:
- `startTier` – starting animal tier for new players (default `1`).
- `max_players` – maximum number of concurrent players.
- `serverPort` – port the server listens on (default `2255`).
- `gameMode` – numeric identifier for the game mode.

Adjust the file before running the server.

## Running the Server
Run the packaged jar from the directory containing `config.txt`:
```bash
java -jar mopelegacyserver.jar
```

## Client
The `client/` directory contains the web client.
- Open `client/index.html` directly in a browser or host the folder on any static web server.
- A default `LOCAL` server entry pointing to `localhost:2255` is included.  
  To use a different host or port, edit the `addServerDef` call in `client/client.js`.

## Contributing
Pull requests are welcome! For major changes, please open an issue to discuss your ideas and ensure tests pass before submitting.

### Contributors
- [YesdXploiter](https://github.com/YesdXploiter)
- [RussianMopeRU](https://github.com/RussianMopeRU)
- [ProXYGamer1](https://github.com/ProXYGamer1)

### Special Thanks
- [PashaGames](https://github.com/pashagamesold) – created much of the server foundation.

## License
This project is licensed under the [GPL-3.0 License](LICENSE).
