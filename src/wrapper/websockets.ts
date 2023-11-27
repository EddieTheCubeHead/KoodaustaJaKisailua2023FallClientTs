import WebSocket from 'ws';
import {
    ActionType,
    BotAction,
    Client,
    ClientContext,
    ClientState,
    EventType,
    GameTickData,
    StartGameData,
    WsEvent
} from "./models";
import {loggerProvider} from "../logging";
import {deserializeWebhookEvent} from "./serialization";
import {handleTick} from "../team_ai";

const _logger = loggerProvider.getLogger("wrapper.websockets")
const _team_ai_logger = loggerProvider.getLogger("team_ai.timer")
const _client: Client = {state: ClientState.unconnected, context: null};

const sendWebSocketMessage = (websocket: WebSocket, event: WsEvent) => {
    const eventString = JSON.stringify(event)
    _logger.debug(`Sent: ${eventString}`)
    websocket.send(eventString)
}

const authOnConnect = (websocket: WebSocket, token: string, botName: string) => {
    _logger.info(`Authorizing with token ${token} and name ${botName}`)
    _client.state = ClientState.unauthorized
    sendWebSocketMessage(websocket, {eventType: EventType.auth, data: {token, botName}})
}

const handleAuthAck = (websocket: WebSocket) => {
    if (_client.state === ClientState.unauthorized) {
        _client.state = ClientState.idle
        _logger.info("Authorization successful")
    }
}

const handleStartGame = (websocket: WebSocket, event: StartGameData) => {
    if (_client.state !== ClientState.idle) {
        _logger.warn(`Game can only be started in idle state! State right now is: ${_client.state}`)
        return;
    }
    _client.context = {tickLengthMs: event.tickLength, turnRate: event.turnRate}
    _client.state = ClientState.inGame
    sendWebSocketMessage(websocket, {eventType: EventType.startAck, data: {}})
}

const tickProcessingWrapper = async (context: ClientContext | null, event: GameTickData) => {
    if (context === null) {
        _logger.error("Got null client context in tick processing")
        return null
    }

    let result: BotAction | null
    try {
        const start = Date.now()
        result = await handleTick(context, event)
        _team_ai_logger.debug(`tick processed in ${Date.now() - start} milliseconds`)
    }
    catch (e) {
        _logger.error(`Exception raised in team ai tick processing code: ${e}`)
        result = null
    }
    return result
}

const handleTickProcessingTimeout = async (event: GameTickData): Promise<BotAction | null> => {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Team ai function timed out after ${_client.context?.tickLengthMs} milliseconds.`))
        }, _client.context?.tickLengthMs);
    })

    try {
        let result = await Promise.race([tickProcessingWrapper(_client.context, event), timeoutPromise]);
        return result as BotAction | null
    } catch (exception) {
        _logger.error(`${exception}`)
        return null
    }
}

const handleGameTick = async (websocket: WebSocket, event: GameTickData) => {
    if (_client.state !== ClientState.inGame) {
        _logger.warn(`Game ticks can only be handled while in in-game state! State right now is: ${_client.state}`)
        return;
    }
    const action: BotAction = await handleTickProcessingTimeout(event) ?? {action: ActionType.move, payload: {distance: 0}}
    sendWebSocketMessage(websocket, {eventType: EventType.gameAction, data: action})
}

const handleEndGame = (websocket: WebSocket) => {
    if (_client.state !== ClientState.inGame) {
        _logger.warn(`Game can only be ended in in game state! State right now is: ${_client.state}`)
        return;
    }
    _client.context = null
    _client.state = ClientState.idle
    sendWebSocketMessage(websocket, {eventType: EventType.endAck, data: {}})
}

const handleEvent = async (websocket: WebSocket, message: string) => {
    _logger.debug(`Received: ${message}`);
    const event = deserializeWebhookEvent(message)
    switch (event?.eventType) {
        case EventType.authAck:
            handleAuthAck(websocket)
            break;
        case EventType.startGame:
            handleStartGame(websocket, event.data)
            break;
        case EventType.gameTick:
            await handleGameTick(websocket, event.data)
            break;
        case EventType.endGame:
            handleEndGame(websocket)
            break;
        default:
            _logger.warn(`Received an unrecognized event: ${event}`)
            break;
    }
};

export const runWebsocket = (address: string, token: string, name: string) => {
    const ws = new WebSocket(address);

    ws.on('open', () => {
        authOnConnect(ws, token, name)
    })

    ws.on('message', (message: string) => {
        handleEvent(ws, message).then();
    })
}
