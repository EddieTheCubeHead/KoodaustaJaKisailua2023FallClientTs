import {loggerProvider} from "./logging";
import {Command, ClientContext, GameTickData} from "./wrapper/models";

/**
 * You can use this logger to track the behaviour of your bot.
 *
 * This is preferred to calling print("msg") as it offers
 * better configuration (see README.md in root)
 *
 * @example
 *  ```ts
 *  _aiLogger.debug("A message that is not important but helps with understanding the code during problem solving.")
 *  _aiLogger.info("A message that you want to see to know the state of the bot during normal operation.")
 *  _aiLogger.warning("A message that demands attention, but is not yet causing problems.")
 *  _aiLogger.error("A message about the bot reaching an erroneous state")
 *  _aiLogger.exception("A message that is same as error, but can be only called in Except blocks. " +
 *                      "Includes exception info in the log")
 *  _aiLogger.critical("A message about a critical exception, usually causing a premature shutdown")
 *  ```
 */
const _aiLogger = loggerProvider.getLogger("team_ai")

/**
 * Main function defining the behaviour of the AI of the team
 *
 * @param context - persistent context that can store data and state between ticks. Wiped on game creation
 * @param gameState - the current state of the game
 *
 * @returns Command instance containing the type and data of the command to be executed on the tick. Returning None
 * tells server to move 0 steps forward.
 *
 * @remarks You can get tick time in milliseconds from `context.tick_length_ms` and ship turn rate in 1/8th circles from
 * `context.turnRate`.
 *
 *  If your function takes longer than the max tick length the function is cancelled and None is returned.
 */
export const handleTick = async (context: ClientContext, gameState: GameTickData): Promise<Command | null> => {
    _aiLogger.info("Processing tick")

    // Insert your code here
    return null
}