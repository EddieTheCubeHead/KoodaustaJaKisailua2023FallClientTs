"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const models_1 = require("../src/wrapper/models");
const serialization_1 = require("../src/wrapper/serialization");
const assertAndFetchValidGameState = (socketEvent) => {
    if (socketEvent === null) {
        throw "null socket event";
    }
    (0, globals_1.expect)(socketEvent.eventType).toBe(models_1.EventType.gameTick);
    if (socketEvent.eventType !== models_1.EventType.gameTick) {
        throw "socket event is not of type game tick";
    }
    return socketEvent.data;
};
(0, globals_1.test)("Should deserialize cells with no data based on type", () => {
    const eventJson = "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 1, \"gameMap\": " +
        "[[{\"type\": \"empty\", \"data\": {}}, {\"type\": \"outOfVision\", \"data\": {}}, " +
        "{\"type\": \"audioSignature\", \"data\": {}}]]}}";
    const deserializedEvent = (0, serialization_1.deserializeWebhookEvent)(eventJson);
    const eventData = assertAndFetchValidGameState(deserializedEvent);
    (0, globals_1.expect)(eventData.gameMap[0][0].type).toBe(models_1.CellType.empty);
    (0, globals_1.expect)(eventData.gameMap[0][1].type).toBe(models_1.CellType.outOfVision);
    (0, globals_1.expect)(eventData.gameMap[0][2].type).toBe(models_1.CellType.audioSignature);
});
(0, globals_1.test)("Should set entity id on hit box deserialization", () => {
    const eventJson = "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 1, \"gameMap\": " +
        "[[{\"type\": \"hitBox\", \"data\": {\"entityId\": \"myShipId\"}}]]}}";
    const deserializedEvent = (0, serialization_1.deserializeWebhookEvent)(eventJson);
    const eventData = assertAndFetchValidGameState(deserializedEvent);
    (0, globals_1.expect)(eventData.gameMap[0][0].type).toBe(models_1.CellType.hitBox);
    if (eventData.gameMap[0][0].type !== models_1.CellType.hitBox) {
        return;
    }
    (0, globals_1.expect)(eventData.gameMap[0][0].data.entityId).toBe("myShipId");
});
(0, globals_1.test)("Should set ship data on ship deserialization", () => {
    const eventJson = "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 1, \"gameMap\": " +
        "[[{\"type\": \"ship\", \"data\": {\"id\": \"myShipId\", \"position\": {\"x\": 1, \"y\": 2}, " +
        "\"direction\": \"ne\", \"health\": 10, \"heat\": 3}}]]}}";
    const deserializedEvent = (0, serialization_1.deserializeWebhookEvent)(eventJson);
    const eventData = assertAndFetchValidGameState(deserializedEvent);
    (0, globals_1.expect)(eventData.gameMap[0][0].type).toBe(models_1.CellType.ship);
    if (eventData.gameMap[0][0].type !== models_1.CellType.ship) {
        return;
    }
    (0, globals_1.expect)(eventData.gameMap[0][0].data.id).toBe("myShipId");
    (0, globals_1.expect)(eventData.gameMap[0][0].data.position).toEqual({ x: 1, y: 2 });
    (0, globals_1.expect)(eventData.gameMap[0][0].data.direction).toBe(models_1.CompassDirection.northEast);
    (0, globals_1.expect)(eventData.gameMap[0][0].data.health).toBe(10);
    (0, globals_1.expect)(eventData.gameMap[0][0].data.heat).toBe(3);
});
(0, globals_1.test)("Should set projectile data on projectile deserialization", () => {
    const eventJson = "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 1, \"gameMap\": " +
        "[[{\"type\": \"projectile\", \"data\": {\"id\": \"projectileId\", \"position\": {\"x\": 5, \"y\": 3}, " +
        "\"direction\": \"sw\", \"velocity\": 4, \"mass\": 2}}]]}}";
    const deserializedEvent = (0, serialization_1.deserializeWebhookEvent)(eventJson);
    const eventData = assertAndFetchValidGameState(deserializedEvent);
    (0, globals_1.expect)(eventData.gameMap[0][0].type).toBe(models_1.CellType.projectile);
    if (eventData.gameMap[0][0].type !== models_1.CellType.projectile) {
        return;
    }
    (0, globals_1.expect)(eventData.gameMap[0][0].data.id).toBe("projectileId");
    (0, globals_1.expect)(eventData.gameMap[0][0].data.position).toEqual({ x: 5, y: 3 });
    (0, globals_1.expect)(eventData.gameMap[0][0].data.direction).toBe(models_1.CompassDirection.southWest);
    (0, globals_1.expect)(eventData.gameMap[0][0].data.velocity).toBe(4);
    (0, globals_1.expect)(eventData.gameMap[0][0].data.mass).toBe(2);
});
(0, globals_1.test)("Should deserialize whole matrix at a time", () => {
    const empty = { type: models_1.CellType.empty, data: {} };
    const row = [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty];
    const map = [row, row, row, row, row, row, row, row, row, row];
    const eventJson = "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 1, \"gameMap\": " +
        `${JSON.stringify(map)}}}`;
    const deserializedEvent = (0, serialization_1.deserializeWebhookEvent)(eventJson);
    const eventData = assertAndFetchValidGameState(deserializedEvent);
    (0, globals_1.expect)(eventData.gameMap.length).toBe(10);
    eventData.gameMap.forEach((row) => {
        (0, globals_1.expect)(row.length).toBe(10);
    });
});
(0, globals_1.test)("Should deserialize game state to turn number and map", () => {
    const eventJson = "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 82, \"gameMap\": " +
        "[[{\"type\": \"empty\", \"data\": {}}]]}}";
    const deserializedEvent = (0, serialization_1.deserializeWebhookEvent)(eventJson);
    const eventData = assertAndFetchValidGameState(deserializedEvent);
    (0, globals_1.expect)(eventData.turnNumber).toBe(82);
    (0, globals_1.expect)(eventData.gameMap).toEqual([[{ type: "empty", data: {} }]]);
});
(0, globals_1.test)("Should include distance on move action serialization", () => {
    const moveAction = {};
});
