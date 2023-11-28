# KoodaustaJaKisailua2023FallClientTs
Client helper/wrapper in typescript for the koodausta ja kisailua 2023 fall event.

## Setup

### Configs

Configs can be edited in `config.json` in the repository root. The configs here can
also be supplied as environment variables, if you for example want to create
multiple run configurations in PyCharm.

The client has the following configuration values:

 - `websocket_url`: the url of the game server websocket. Already configured
in the repository.
 - `token`: the unique token identifying your team. Already configured in the 
repository.
 - `bot_name`: the name of this bot. Is used to differentiate different bots from
the same team.
 - `wrapper_log_level`: the minimum level of log entries to write from wrapper
logging. From least critical to most critical level, the options are 'DEBUG',
'INFO', 'WARNING', 'ERROR' and 'CRITICAL'. Default 'INFO'. If you want more
verbose feedback about the wrapper during runtime it's recommended to set this to
'DEBUG' and change the `wrapper_log_stream` config to 'stdout' or 'stderr'.
 - `team_ai_log_level`: the minimum level of log entries to write from wrapper
logging. From least critical to most critical level, the options are 'DEBUG',
'INFO', 'WARNING', 'ERROR' and 'CRITICAL'. Default 'DEBUG'.

## Running

To run the client websocket wrapper, compile the typescript project and run the
file `index.js` in the `src` folder.

## Editing the AI function

The AI function can be found in `src/team_ai`. It gets two parameters `context`
and `gameState` from the wrapper. It returns a `Command` object, or `null`. If
`null` is returned, it will be treated as a "move 0" command.

`gameState` is the present state of the game as seen by the ship.

`context` is a persistent object you can use to store data in. Context is wiped
at the start of a match, but preserved during the match. This means you are free
to add data to it to keep the data available through the match. If you want to use
type checking with context you can edit the `ClientContext` class in
`src/apiwrapper/models.ts`. By default `ClientContext` has two members.
`tickLengthMs` holds the value for max tick length. If you function takes longer
than max length - 50 milliseconds, the wrapper will return move 0 steps automatically.
`turnRate` hold the maximum turn rate of the ship. The rate is given in 1/8ths of a
circle, so each value represents being able to turn one compass direction.

`Command` object should contain the type of the command (`Move`, `Turn` or `Shoot`)
and the command data.

If you want to log the behaviour inside the function you can use the `_aiLogger`
object. Use methods `_aiLogger.debug("message")`, `_aiLogger.info("message")`,
`_aiLogger.warning("message")`, `_aiLogger.error("message")` and
`_aiLogger.critical("message")` for the different levels of urgency in the log
messages.

Please note that there is a timeout of (tick_time - 50) milliseconds for the
function. This ensures the wrapper can send a command every tick.

# Models

Model data can be found in [MODELS.md](MODELS.md)

# Game loop

Game loop is described in [GAME_REFERENCE.md](GAME_REFERENCE.md)


