import {Log4TSProvider} from "typescript-logging-log4ts-style";
import {LogLevel} from "typescript-logging";

export const teamAiLogProvider = Log4TSProvider.createProvider("TeamAiLogProvider",
    {
        level: LogLevel.Debug,
        groups: [{
            expression: new RegExp("teamAi.*")
        }]
    })

export const wrapperLogProvider = Log4TSProvider.createProvider("wrapperLogProvider",
    {
        level: LogLevel.Debug,
        groups: [{
            expression: new RegExp("wrapper.*")
        }]
    })