import {teamAiLogProvider} from "./logging";
import {BotAction, ClientContext, GameTickData} from "./wrapper/models";

const _logger = teamAiLogProvider.getLogger("team_ai")

export const handleTick = async (context: ClientContext, gameState: GameTickData): Promise<BotAction | null> => {
    _logger.info("Processing tick")

    // Insert your code here
    return null
}