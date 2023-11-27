"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapperLogProvider = exports.teamAiLogProvider = void 0;
const typescript_logging_log4ts_style_1 = require("typescript-logging-log4ts-style");
const typescript_logging_1 = require("typescript-logging");
exports.teamAiLogProvider = typescript_logging_log4ts_style_1.Log4TSProvider.createProvider("TeamAiLogProvider", {
    level: typescript_logging_1.LogLevel.Debug,
    groups: [{
            expression: new RegExp("teamAi.*")
        }]
});
exports.wrapperLogProvider = typescript_logging_log4ts_style_1.Log4TSProvider.createProvider("wrapperLogProvider", {
    level: typescript_logging_1.LogLevel.Debug,
    groups: [{
            expression: new RegExp("wrapper.*")
        }]
});
