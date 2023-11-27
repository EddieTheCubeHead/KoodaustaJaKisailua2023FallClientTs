"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTick = void 0;
const logging_1 = require("./logging");
const _logger = logging_1.teamAiLogProvider.getLogger("team_ai");
const sleep = (milliseconds) => {
    return new Promise(resolve => { setTimeout(resolve, milliseconds); });
};
const handleTick = (context, gameState) => __awaiter(void 0, void 0, void 0, function* () {
    _logger.info("Processing tick");
    // Insert your code here
    return null;
});
exports.handleTick = handleTick;
