import {expect, test} from '@jest/globals';

import {CompassDirection, WsEvent, CellType, EventType} from "../src/wrapper/models";
import {deserializeWebhookEvent} from "../src/wrapper/serialization";

const assertAndFetchValidGameState = (socketEvent: WsEvent | null) =>
{
    if (socketEvent === null)
    {
        throw "null socket event";
    }

    expect(socketEvent.eventType).toBe(EventType.gameTick)

    if (socketEvent.eventType !== EventType.gameTick)
    {
        throw "socket event is not of type game tick";
    }

    return socketEvent.data;
}

test("Should deserialize cells with no data based on type", () => {
    const eventJson =
        "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 1, \"gameMap\": " +
        "[[{\"type\": \"empty\", \"data\": {}}, {\"type\": \"outOfVision\", \"data\": {}}, " +
        "{\"type\": \"audioSignature\", \"data\": {}}]]}}"

    const deserializedEvent = deserializeWebhookEvent(eventJson)

    const eventData = assertAndFetchValidGameState(deserializedEvent);

    expect(eventData.gameMap[0][0].type).toBe(CellType.empty)
    expect(eventData.gameMap[0][1].type).toBe(CellType.outOfVision)
    expect(eventData.gameMap[0][2].type).toBe(CellType.audioSignature)
})

test("Should set entity id on hit box deserialization", () =>
{
    const eventJson =
        "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 1, \"gameMap\": " +
        "[[{\"type\": \"hitBox\", \"data\": {\"entityId\": \"myShipId\"}}]]}}"

    const deserializedEvent = deserializeWebhookEvent(eventJson)

    const eventData = assertAndFetchValidGameState(deserializedEvent);
    expect(eventData.gameMap[0][0].type).toBe(CellType.hitBox)
    if (eventData.gameMap[0][0].type !== CellType.hitBox)
    {
        return;
    }
    expect(eventData.gameMap[0][0].data.entityId).toBe("myShipId")
})

test("Should set ship data on ship deserialization", () => {
    const eventJson =
        "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 1, \"gameMap\": " +
        "[[{\"type\": \"ship\", \"data\": {\"id\": \"myShipId\", \"position\": {\"x\": 1, \"y\": 2}, " +
        "\"direction\": \"ne\", \"health\": 10, \"heat\": 3}}]]}}"

    const deserializedEvent = deserializeWebhookEvent(eventJson)

    const eventData = assertAndFetchValidGameState(deserializedEvent)
    expect(eventData.gameMap[0][0].type).toBe(CellType.ship)
    if (eventData.gameMap[0][0].type !== CellType.ship)
    {
        return;
    }
    expect(eventData.gameMap[0][0].data.id).toBe("myShipId")
    expect(eventData.gameMap[0][0].data.position).toEqual({x: 1, y: 2})
    expect(eventData.gameMap[0][0].data.direction).toBe(CompassDirection.northEast)
    expect(eventData.gameMap[0][0].data.health).toBe(10)
    expect(eventData.gameMap[0][0].data.heat).toBe(3)
})

test("Should set projectile data on projectile deserialization", () => {
    const eventJson =
        "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 1, \"gameMap\": " +
        "[[{\"type\": \"projectile\", \"data\": {\"id\": \"projectileId\", \"position\": {\"x\": 5, \"y\": 3}, " +
        "\"direction\": \"sw\", \"speed\": 4, \"mass\": 2}}]]}}"

    const deserializedEvent = deserializeWebhookEvent(eventJson)

    const eventData = assertAndFetchValidGameState(deserializedEvent)
    expect(eventData.gameMap[0][0].type).toBe(CellType.projectile)
    if (eventData.gameMap[0][0].type !== CellType.projectile)
    {
        return;
    }
    expect(eventData.gameMap[0][0].data.id).toBe("projectileId")
    expect(eventData.gameMap[0][0].data.position).toEqual({x: 5, y: 3})
    expect(eventData.gameMap[0][0].data.direction).toBe(CompassDirection.southWest)
    expect(eventData.gameMap[0][0].data.speed).toBe(4)
    expect(eventData.gameMap[0][0].data.mass).toBe(2)
})

test("Should deserialize whole matrix at a time", () =>{
    const empty = {type: CellType.empty, data: {}}
    const row = [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty]
    const map = [row, row, row, row, row, row, row, row, row, row]
    const eventJson = "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 1, \"gameMap\": " +
        `${JSON.stringify(map)}}}`

    const deserializedEvent = deserializeWebhookEvent(eventJson)

    const eventData = assertAndFetchValidGameState(deserializedEvent)
    expect(eventData.gameMap.length).toBe(10)
    eventData.gameMap.forEach((row) => {
        expect(row.length).toBe(10)
    })
})

test("Should deserialize game state to turn number and map", () => {
    const eventJson =
        "{\"eventType\": \"gameTick\", \"data\": {\"turnNumber\": 82, \"gameMap\": " +
        "[[{\"type\": \"empty\", \"data\": {}}]]}}"

    const deserializedEvent = deserializeWebhookEvent(eventJson)

    const eventData = assertAndFetchValidGameState(deserializedEvent)

    expect(eventData.turnNumber).toBe(82)
    expect(eventData.gameMap).toEqual([[{type: "empty", data: {}}]])
})

test("Should include distance on move action serialization", () => {
    const moveAction = {}
})