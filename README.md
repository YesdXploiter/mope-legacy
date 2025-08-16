# Mope Legacy

Mope Legacy is an open-source reimplementation of the 2018 server for the browser game [mope.io](https://mope.io). The project ships with a standalone server and a minimal client so the community can continue to enjoy this classic version of the game.

## Features
- Fast and lightweight.
- Under active development.
- Easy to set up.
- Fully open source.

## Requirements
- Java 17+ (JDK)
- Maven 3+

## Getting a Release
Pre-built server packages are available on the [releases page](https://github.com/YesdXploiter/mope-legacy/releases).

## Building from Source
1. Clone this repository.
2. From `server/mope`, run `mvn clean package`.
3. The resulting `mopelegacyserver.jar` will be placed in `server/mope/target`.

## Running
To start the server from the command line:

```
java -jar mopelegacyserver.jar <options>
```

## Contributing
Pull requests are welcome! If you plan to make large changes, please open an issue first to discuss what you would like to change.

### Contributors
- [YesdXploiter](https://github.com/YesdXploiter)
- [RussianMopeRU](https://github.com/RussianMopeRU)
- [ProXYGamer1](https://github.com/ProXYGamer1)

### Special Thanks
- [PashaGames](https://github.com/pashagamesold) – created much of the server foundation.

## License
This project is licensed under the [GPL-3.0 License](LICENSE).

