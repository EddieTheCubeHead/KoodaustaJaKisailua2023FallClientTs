"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsEventSchema = exports.EndGameEventSchema = exports.GameTickEventSchema = exports.GameTickDataSchema = exports.StartGameEventSchema = exports.StartGameDataSchema = exports.AuthAckEventSchema = exports.EndAckEventSchema = exports.GameActionEventSchema = exports.StartAckEventSchema = exports.AuthEventSchema = exports.LobbyParamsSchema = exports.BotParamsSchema = exports.AuthDataSchema = exports.BotActionSchema = exports.ShootActionSchema = exports.GameMapSchema = exports.GameMapCellSchema = exports.ProjectileCellSchema = exports.ProjectileCellDataSchema = exports.ShipCellSchema = exports.ShipCellDataSchema = exports.GridPositionSchema = exports.HitBoxCellSchema = exports.HitBoxCellDataSchema = exports.AudioSignatureCellSchema = exports.EmptyCellSchema = exports.OutOfVisionCellSchema = exports.CellTypeSchema = exports.CellType = exports.ActionTypeSchema = exports.ActionType = exports.EventTypeSchema = exports.EventType = exports.DirectionSchema = exports.CompassDirection = exports.ClientState = void 0;
const zod_1 = require("zod");
var ClientState;
(function (ClientState) {
    ClientState[ClientState["unconnected"] = 0] = "unconnected";
    ClientState[ClientState["unauthorized"] = 1] = "unauthorized";
    ClientState[ClientState["idle"] = 2] = "idle";
    ClientState[ClientState["inGame"] = 3] = "inGame";
})(ClientState || (exports.ClientState = ClientState = {}));
var CompassDirection;
(function (CompassDirection) {
    CompassDirection["north"] = "n";
    CompassDirection["northEast"] = "ne";
    CompassDirection["east"] = "e";
    CompassDirection["southEast"] = "se";
    CompassDirection["south"] = "s";
    CompassDirection["southWest"] = "sw";
    CompassDirection["west"] = "w";
    CompassDirection["northWest"] = "nw";
})(CompassDirection || (exports.CompassDirection = CompassDirection = {}));
exports.DirectionSchema = zod_1.z.nativeEnum(CompassDirection);
var EventType;
(function (EventType) {
    EventType["authAck"] = "authAck";
    EventType["startGame"] = "startGame";
    EventType["gameTick"] = "gameTick";
    EventType["endGame"] = "endGame";
    EventType["auth"] = "auth";
    EventType["startAck"] = "startAck";
    EventType["gameAction"] = "gameAction";
    EventType["endAck"] = "endAck";
})(EventType || (exports.EventType = EventType = {}));
exports.EventTypeSchema = zod_1.z.nativeEnum(EventType);
var ActionType;
(function (ActionType) {
    ActionType["move"] = "move";
    ActionType["shoot"] = "shoot";
    ActionType["turn"] = "turn";
})(ActionType || (exports.ActionType = ActionType = {}));
exports.ActionTypeSchema = zod_1.z.nativeEnum(ActionType);
var CellType;
(function (CellType) {
    CellType["empty"] = "empty";
    CellType["outOfVision"] = "outOfVision";
    CellType["audioSignature"] = "audioSignature";
    CellType["hitBox"] = "hitBox";
    CellType["ship"] = "ship";
    CellType["projectile"] = "projectile";
})(CellType || (exports.CellType = CellType = {}));
exports.CellTypeSchema = zod_1.z.nativeEnum(CellType);
exports.OutOfVisionCellSchema = zod_1.z.object({
    type: zod_1.z.literal(CellType.outOfVision),
    data: zod_1.z.object({}),
});
exports.EmptyCellSchema = zod_1.z.object({
    type: zod_1.z.literal(CellType.empty),
    data: zod_1.z.object({}),
});
exports.AudioSignatureCellSchema = zod_1.z.object({
    type: zod_1.z.literal(CellType.audioSignature),
    data: zod_1.z.object({}),
});
exports.HitBoxCellDataSchema = zod_1.z.object({
    entityId: zod_1.z.string()
});
exports.HitBoxCellSchema = zod_1.z.object({
    type: zod_1.z.literal(CellType.hitBox),
    data: exports.HitBoxCellDataSchema
});
exports.GridPositionSchema = zod_1.z.object({
    x: zod_1.z.number(),
    y: zod_1.z.number(),
    rotation: zod_1.z.number()
});
exports.ShipCellDataSchema = zod_1.z.object({
    id: zod_1.z.string(),
    position: exports.GridPositionSchema,
    health: zod_1.z.number(),
    heat: zod_1.z.number(),
    direction: exports.DirectionSchema,
});
exports.ShipCellSchema = zod_1.z.object({
    type: zod_1.z.literal(CellType.ship),
    data: exports.ShipCellDataSchema,
});
exports.ProjectileCellDataSchema = zod_1.z.object({
    id: zod_1.z.string(),
    position: exports.GridPositionSchema,
    direction: exports.DirectionSchema,
    velocity: zod_1.z.number(),
    mass: zod_1.z.number(),
});
exports.ProjectileCellSchema = zod_1.z.object({
    type: zod_1.z.literal(CellType.projectile),
    data: exports.ProjectileCellDataSchema,
});
exports.GameMapCellSchema = zod_1.z.union([
    exports.OutOfVisionCellSchema,
    exports.EmptyCellSchema,
    exports.AudioSignatureCellSchema,
    exports.HitBoxCellSchema,
    exports.ShipCellSchema,
    exports.ProjectileCellSchema,
]);
exports.GameMapSchema = zod_1.z.array(zod_1.z.array(exports.GameMapCellSchema));
const MoveActionPayloadSchema = zod_1.z.object({
    distance: zod_1.z.number(),
});
const MoveActionSchema = zod_1.z.object({
    action: zod_1.z.literal(ActionType.move),
    payload: MoveActionPayloadSchema,
});
const TurnActionPayloadSchema = zod_1.z.object({
    direction: exports.DirectionSchema,
});
const TurnActionSchema = zod_1.z.object({
    action: zod_1.z.literal(ActionType.turn),
    payload: TurnActionPayloadSchema,
});
const ShootActionPayloadSchema = zod_1.z.object({
    mass: zod_1.z.number(),
    speed: zod_1.z.number(),
});
exports.ShootActionSchema = zod_1.z.object({
    action: zod_1.z.literal(ActionType.shoot),
    payload: ShootActionPayloadSchema,
});
exports.BotActionSchema = zod_1.z.union([
    MoveActionSchema,
    TurnActionSchema,
    exports.ShootActionSchema,
]);
exports.AuthDataSchema = zod_1.z.object({
    token: zod_1.z.string(),
    botName: zod_1.z.string(),
});
exports.BotParamsSchema = zod_1.z.object({
    token: zod_1.z.string(),
    botName: zod_1.z.string(),
});
exports.LobbyParamsSchema = zod_1.z.object({
    lobbyId: zod_1.z.string(),
});
// CLIENT EVENTS
exports.AuthEventSchema = zod_1.z.object({
    eventType: zod_1.z.literal(EventType.auth),
    data: exports.AuthDataSchema,
});
exports.StartAckEventSchema = zod_1.z.object({
    eventType: zod_1.z.literal(EventType.startAck),
    data: zod_1.z.object({}),
});
exports.GameActionEventSchema = zod_1.z.object({
    eventType: zod_1.z.literal(EventType.gameAction),
    data: exports.BotActionSchema,
});
exports.EndAckEventSchema = zod_1.z.object({
    eventType: zod_1.z.literal(EventType.endAck),
    data: zod_1.z.object({}),
});
// SERVER EVENTS
exports.AuthAckEventSchema = zod_1.z.object({
    eventType: zod_1.z.literal(EventType.authAck),
    data: zod_1.z.object({}),
});
exports.StartGameDataSchema = zod_1.z.object({
    tickLength: zod_1.z.number(),
    turnRate: zod_1.z.number()
});
exports.StartGameEventSchema = zod_1.z.object({
    eventType: zod_1.z.literal(EventType.startGame),
    data: exports.StartGameDataSchema
});
exports.GameTickDataSchema = zod_1.z.object({
    turnNumber: zod_1.z.number(),
    gameMap: exports.GameMapSchema,
});
exports.GameTickEventSchema = zod_1.z.object({
    eventType: zod_1.z.literal(EventType.gameTick),
    data: exports.GameTickDataSchema,
});
exports.EndGameEventSchema = zod_1.z.object({
    eventType: zod_1.z.literal(EventType.endGame),
    data: zod_1.z.object({}),
});
exports.WsEventSchema = zod_1.z.union([
    exports.AuthEventSchema,
    exports.StartAckEventSchema,
    exports.GameActionEventSchema,
    exports.EndAckEventSchema,
    exports.AuthAckEventSchema,
    exports.StartGameEventSchema,
    exports.GameTickEventSchema,
    exports.EndGameEventSchema,
]);
