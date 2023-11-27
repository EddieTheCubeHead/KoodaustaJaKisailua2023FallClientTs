import nconf from "nconf";
import {LogLevel} from "typescript-logging";

nconf.argv().env().file("./config.json")

export const config = {
    websocketUrl: nconf.get("websocketUrl") as string,
    token: nconf.get("token") as string,
    botName: nconf.get("botName") as string,
    teamAiLogLevel: LogLevel[nconf.get("teamAiLogLevel")],
    wrapperLogLevel: LogLevel[nconf.get("wrapperLogLevel")]
}