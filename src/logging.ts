import {Log4TSProvider} from "typescript-logging-log4ts-style";
import {config} from "./config_provider";

export const loggerProvider = Log4TSProvider.createProvider("TeamAiLogProvider",
    {
        groups: [{
            expression: new RegExp("team_ai.*"),
            // @ts-ignore
            level: config.teamAiLogLevel
        }, {
            expression: new RegExp("wrapper.*"),
            // @ts-ignore
            level: config.wrapperLogLevel
        }]
    })