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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWebsocket = void 0;
const ws_1 = __importDefault(require("ws"));
const models_1 = require("./models");
const logging_1 = require("../logging");
const serialization_1 = require("./serialization");
const team_ai_1 = require("../team_ai");
const _logger = logging_1.wrapperLogProvider.getLogger("wrapper.websockets");
const _team_ai_logger = logging_1.teamAiLogProvider.getLogger("team_ai.timer");
const _client = { state: models_1.ClientState.unconnected, context: null };
const sendWebSocketMessage = (websocket, event) => {
    const eventString = JSON.stringify(event);
    _logger.debug(`Sent: ${eventString}`);
    websocket.send(eventString);
};
const authOnConnect = (websocket) => {
    const token = "myToken";
    const botName = "myName";
    _logger.info(`Authorizing with token ${token} and name ${botName}`);
    _client.state = models_1.ClientState.unauthorized;
    sendWebSocketMessage(websocket, { eventType: models_1.EventType.auth, data: { token, botName } });
};
const handleAuthAck = (websocket) => {
    if (_client.state === models_1.ClientState.unauthorized) {
        _client.state = models_1.ClientState.idle;
        _logger.info("Authorization successful");
    }
};
const handleStartGame = (websocket, event) => {
    if (_client.state !== models_1.ClientState.idle) {
        _logger.warn(`Game can only be started in idle state! State right now is: ${_client.state}`);
        return;
    }
    _client.context = { tickLengthMs: event.tickLength, turnRate: event.turnRate };
    _client.state = models_1.ClientState.inGame;
    sendWebSocketMessage(websocket, { eventType: models_1.EventType.startAck, data: {} });
};
const tickProcessingWrapper = (context, event) => __awaiter(void 0, void 0, void 0, function* () {
    if (context === null) {
        _logger.error("Got null client context in tick processing");
        return null;
    }
    let result;
    try {
        const start = Date.now();
        result = yield (0, team_ai_1.handleTick)(context, event);
        _team_ai_logger.debug(`tick processed in ${Date.now() - start} milliseconds`);
    }
    catch (e) {
        _logger.error(`Exception raised in team ai tick processing code: ${e}`);
        result = null;
    }
    return result;
});
const handleTickProcessingTimeout = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const timeoutPromise = new Promise((_, reject) => {
        var _a;
        setTimeout(() => {
            var _a;
            reject(new Error(`Team ai function timed out after ${(_a = _client.context) === null || _a === void 0 ? void 0 : _a.tickLengthMs} milliseconds.`));
        }, (_a = _client.context) === null || _a === void 0 ? void 0 : _a.tickLengthMs);
    });
    try {
        let result = yield Promise.race([tickProcessingWrapper(_client.context, event), timeoutPromise]);
        return result;
    }
    catch (exception) {
        _logger.error(`${exception}`);
        return null;
    }
});
const handleGameTick = (websocket, event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (_client.state !== models_1.ClientState.inGame) {
        _logger.warn(`Game ticks can only be handled while in in-game state! State right now is: ${_client.state}`);
        return;
    }
    const action = (_a = yield handleTickProcessingTimeout(event)) !== null && _a !== void 0 ? _a : { action: models_1.ActionType.move, payload: { distance: 0 } };
    sendWebSocketMessage(websocket, { eventType: models_1.EventType.gameAction, data: action });
});
const handleEndGame = (websocket) => {
    if (_client.state !== models_1.ClientState.inGame) {
        _logger.warn(`Game can only be ended in in game state! State right now is: ${_client.state}`);
        return;
    }
    _client.context = null;
    _client.state = models_1.ClientState.idle;
    sendWebSocketMessage(websocket, { eventType: models_1.EventType.endAck, data: {} });
};
const handleEvent = (websocket, message) => __awaiter(void 0, void 0, void 0, function* () {
    _logger.debug(`Received: ${message}`);
    const event = (0, serialization_1.deserializeWebhookEvent)(message);
    switch (event === null || event === void 0 ? void 0 : event.eventType) {
        case models_1.EventType.authAck:
            handleAuthAck(websocket);
            break;
        case models_1.EventType.startGame:
            handleStartGame(websocket, event.data);
            break;
        case models_1.EventType.gameTick:
            yield handleGameTick(websocket, event.data);
            break;
        case models_1.EventType.endGame:
            handleEndGame(websocket);
            break;
        default:
            _logger.warn(`Received an unrecognized event: ${event}`);
            break;
    }
});
const runWebsocket = (token, name) => {
    const ws = new ws_1.default("ws://localhost:8765");
    ws.on('open', () => {
        authOnConnect(ws);
    });
    ws.on('message', (message) => {
        handleEvent(ws, message).then();
    });
};
exports.runWebsocket = runWebsocket;
