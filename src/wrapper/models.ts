import {z} from "zod";


export enum ClientState {
    unconnected,
    unauthorized,
    idle,
    inGame
}

export interface ClientContext {
    tickLengthMs: number,
    turnRate: number
}

export interface Client {
    context: ClientContext | null,
    state: ClientState
}

export enum CompassDirection {
    north = "n",
    northEast = "ne",
    east = "e",
    southEast = "se",
    south = "s",
    southWest = "sw",
    west = "w",
    northWest = "nw"
}
export const DirectionSchema = z.nativeEnum(CompassDirection);

export enum EventType {
    authAck = "authAck",
    startGame = "startGame",
    gameTick = "gameTick",
    endGame = "endGame",
    auth = "auth",
    startAck = "startAck",
    gameAction = "gameAction",
    endAck = "endAck"
}
export const EventTypeSchema = z.nativeEnum(EventType);

export enum ActionType {
    move = "move",
    shoot = "shoot",
    turn = "turn"
}
export const ActionTypeSchema = z.nativeEnum(ActionType);

export enum CellType {
    empty = "empty",
    outOfVision = "outOfVision",
    audioSignature = "audioSignature",
    hitBox = "hitBox",
    ship = "ship",
    projectile = "projectile"
}
export const CellTypeSchema = z.nativeEnum(CellType)

export const OutOfVisionCellSchema = z.object({
    type: z.literal(CellType.outOfVision),
    data: z.object({}),
});

export const EmptyCellSchema = z.object({
    type: z.literal(CellType.empty),
    data: z.object({}),
});

export const AudioSignatureCellSchema = z.object({
    type: z.literal(CellType.audioSignature),
    data: z.object({}),
});

export const HitBoxCellDataSchema = z.object({
    entityId: z.string()
})

export const HitBoxCellSchema = z.object({
    type: z.literal(CellType.hitBox),
    data: HitBoxCellDataSchema
})

export const GridPositionSchema = z.object({
    x: z.number(),
    y: z.number()
});

export const ShipCellDataSchema = z.object({
    id: z.string(),
    position: GridPositionSchema,
    health: z.number(),
    heat: z.number(),
    direction: DirectionSchema,
});

export const ShipCellSchema = z.object({
    type: z.literal(CellType.ship),
    data: ShipCellDataSchema,
});

export const ProjectileCellDataSchema = z.object({
    id: z.string(),
    position: GridPositionSchema,
    direction: DirectionSchema,
    velocity: z.number(),
    mass: z.number(),
});

export const ProjectileCellSchema = z.object({
    type: z.literal(CellType.projectile),
    data: ProjectileCellDataSchema,
});

export const GameMapCellSchema = z.union([
    OutOfVisionCellSchema,
    EmptyCellSchema,
    AudioSignatureCellSchema,
    HitBoxCellSchema,
    ShipCellSchema,
    ProjectileCellSchema,
]);

export const GameMapSchema = z.array(z.array(GameMapCellSchema));

export type GameMap = z.infer<typeof GameMapSchema>;
export type Direction = z.infer<typeof DirectionSchema>;
export type OutOfVisionCell = z.infer<typeof OutOfVisionCellSchema>;
export type EmptyCell = z.infer<typeof EmptyCellSchema>;
export type AudioSignatureCell = z.infer<typeof AudioSignatureCellSchema>;
export type ShipCellData = z.infer<typeof ShipCellDataSchema>;
export type ShipCell = z.infer<typeof ShipCellSchema>;
export type GridPosition = z.infer<typeof GridPositionSchema>;
export type ProjectileCellData = z.infer<typeof ProjectileCellDataSchema>;
export type ProjectileCell = z.infer<typeof ProjectileCellSchema>;
export type GameMapCell = z.infer<typeof GameMapCellSchema>;
export type HitBoxCell = z.infer<typeof HitBoxCellSchema>;

const MoveActionPayloadSchema = z.object({
    distance: z.number(),
});

const MoveActionSchema = z.object({
    action: z.literal(ActionType.move),
    payload: MoveActionPayloadSchema,
});

const TurnActionPayloadSchema = z.object({
    direction: DirectionSchema,
});

const TurnActionSchema = z.object({
    action: z.literal(ActionType.turn),
    payload: TurnActionPayloadSchema,
});

const ShootActionPayloadSchema = z.object({
    mass: z.number(),
    speed: z.number(),
});

export const ShootActionSchema = z.object({
    action: z.literal(ActionType.shoot),
    payload: ShootActionPayloadSchema,
});

export const BotActionSchema = z.union([
    MoveActionSchema,
    TurnActionSchema,
    ShootActionSchema,
]);
export type BotAction = z.infer<typeof BotActionSchema>;

export const AuthDataSchema = z.object({
    token: z.string(),
    botName: z.string(),
});
export type AuthData = z.infer<typeof AuthDataSchema>;

export const BotParamsSchema = z.object({
    token: z.string(),
    botName: z.string(),
});
export type BotParams = z.infer<typeof BotParamsSchema>;

export const LobbyParamsSchema = z.object({
    lobbyId: z.string(),
});
export type LobbyParams = z.infer<typeof LobbyParamsSchema>;

// CLIENT EVENTS
export const AuthEventSchema = z.object({
    eventType: z.literal(EventType.auth),
    data: AuthDataSchema,
});
export type AuthEvent = z.infer<typeof AuthEventSchema>;

export const StartAckEventSchema = z.object({
    eventType: z.literal(EventType.startAck),
    data: z.object({}),
});
export type StartAckEvent = z.infer<typeof StartAckEventSchema>;

export const GameActionEventSchema = z.object({
    eventType: z.literal(EventType.gameAction),
    data: BotActionSchema,
});
export type GameActionEvent = z.infer<typeof GameActionEventSchema>;

export const EndAckEventSchema = z.object({
    eventType: z.literal(EventType.endAck),
    data: z.object({}),
});
export type EndAckEvent = z.infer<typeof EndAckEventSchema>;

// SERVER EVENTS
export const AuthAckEventSchema = z.object({
    eventType: z.literal(EventType.authAck),
    data: z.object({}),
});
export type AuthAck = z.infer<typeof AuthAckEventSchema>;

export const StartGameDataSchema = z.object({
    tickLength: z.number(),
    turnRate: z.number()
})
export type StartGameData = z.infer<typeof StartGameDataSchema>;

export const StartGameEventSchema = z.object({
    eventType: z.literal(EventType.startGame),
    data: StartGameDataSchema
});
export type StartGameEvent = z.infer<typeof StartGameEventSchema>;

export const GameTickDataSchema = z.object({
    turnNumber: z.number(),
    gameMap: GameMapSchema,
});
export type GameTickData = z.infer<typeof GameTickDataSchema>;

export const GameTickEventSchema = z.object({
    eventType: z.literal(EventType.gameTick),
    data: GameTickDataSchema,
});

export type GameTickEvent = z.infer<typeof GameTickEventSchema>;

export const EndGameEventSchema = z.object({
    eventType: z.literal(EventType.endGame),
    data: z.object({}),
});
export type EndGameEvent = z.infer<typeof EndGameEventSchema>;

export const WsEventSchema = z.union([
    AuthEventSchema,
    StartAckEventSchema,
    GameActionEventSchema,
    EndAckEventSchema,
    AuthAckEventSchema,
    StartGameEventSchema,
    GameTickEventSchema,
    EndGameEventSchema,
]);
export type WsEvent = z.infer<typeof WsEventSchema>;
