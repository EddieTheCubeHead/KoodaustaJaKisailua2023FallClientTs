import {describe, expect, it, test} from '@jest/globals';
import {getApproximateDirection, getCoordinateDifference, getEntityCoordinates, getPartialTurn} from "../src/helpers";
import {CellType, CompassDirection, EmptyCell, HitBoxCell, ProjectileCell} from "../src/wrapper/models";

describe("getCoordinateDifference test cases", () => {
    test("Should return zero vector if origin ", () => {
        const origin = {x: 3, y: -5}
        const actual = getCoordinateDifference(origin, origin)
        expect(actual).toEqual({x: 0, y: 0})
    })

    test("Should return vector pointing from origin to target if not same coordinates", () => {
        const origin = {x: -3, y: 4}
        const target = {x: -5, y: -2}
        const actual = getCoordinateDifference(origin, target)
        expect(actual).toEqual({x: -2, y: -6})
    })
})

describe("getApproximateDirection test cases", () => {
    it.each([
        {x: -1, y: 0, expectedDirection: CompassDirection.north},
        {x: -1, y: 1, expectedDirection: CompassDirection.northEast},
        {x: 0, y: 1, expectedDirection: CompassDirection.east},
        {x: 1, y: 1, expectedDirection: CompassDirection.southEast},
        {x: 1, y: 0, expectedDirection: CompassDirection.south},
        {x: 1, y: -1, expectedDirection: CompassDirection.southWest},
        {x: 0, y: -1, expectedDirection: CompassDirection.west},
        {x: -1, y: -1, expectedDirection: CompassDirection.northWest},
    ])("Should return $expectedDirection for exact direction ($x, $y)", ({x, y, expectedDirection}) => {
        const actual_direction = getApproximateDirection({x, y})
        expect(actual_direction).toBe(expectedDirection)
    })

    it.each([
        {x: -5, y: 1, expectedDirection: CompassDirection.north},
        {x: -5, y: -1, expectedDirection: CompassDirection.north},
        {x: -4, y: 5, expectedDirection: CompassDirection.northEast},
        {x: -5, y: 4, expectedDirection: CompassDirection.northEast},
        {x: -1, y: 5, expectedDirection: CompassDirection.east},
        {x: 1, y: 5, expectedDirection: CompassDirection.east},
        {x: 5, y: 5, expectedDirection: CompassDirection.southEast},
        {x: 4, y: 4, expectedDirection: CompassDirection.southEast},
        {x: 5, y: 1, expectedDirection: CompassDirection.south},
        {x: 5, y: -1, expectedDirection: CompassDirection.south},
        {x: 5, y: -4, expectedDirection: CompassDirection.southWest},
        {x: 4, y: -5, expectedDirection: CompassDirection.southWest},
        {x: -1, y: -5, expectedDirection: CompassDirection.west},
        {x: 1, y: -5, expectedDirection: CompassDirection.west},
        {x: -4, y: -5, expectedDirection: CompassDirection.northWest},
        {x: -5, y: -4, expectedDirection: CompassDirection.northWest}
    ])("Should return $expectedDirection for non-exact direction ($x, $y)", ({x, y, expectedDirection}) => {
        const actual_direction = getApproximateDirection({x, y})
        expect(actual_direction).toBe(expectedDirection)
    })
})

describe("getEntityCoordinates test cases", () => {
    test("Should give entity coordinates for single cell entity", () => {
        const empty: EmptyCell = {type: CellType.empty, data: {}}
        const entity: ProjectileCell = {
            type: CellType.projectile,
            data: {id: "entity", position: {x: 1, y: 1}, direction: CompassDirection.northEast, velocity: 3, mass: 4}
        }
        const gameMap = [
            [empty, empty, empty, empty],
            [empty, entity, empty, empty],
            [empty, empty, empty, empty],
            [empty, empty, empty, empty]
        ]
        const actualCoordinates = getEntityCoordinates("entity", gameMap)
        expect(actualCoordinates).toEqual(entity.data.position)
    })

    test("Should ignore hit box coordinates and return actual entity", () => {
        const empty: EmptyCell = {type: CellType.empty, data: {}}
        const hitBox: HitBoxCell = {type: CellType.hitBox, data: {entityId: "entity"}}
        const entity: ProjectileCell = {
            type: CellType.projectile,
            data: {id: "entity", position: {x: 3, y: 3}, direction: CompassDirection.northEast, velocity: 3, mass: 4}
        }
        const gameMap = [
            [empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty],
            [empty, empty, hitBox, hitBox, hitBox],
            [empty, empty, hitBox, entity, hitBox],
            [empty, empty, hitBox, hitBox, hitBox]
        ]
        const actualCoordinates = getEntityCoordinates("entity", gameMap)
        expect(actualCoordinates).toEqual(entity.data.position)
    })
})

describe("getPartialTurn test cases", () => {
    test("Should return given direction if turn is not too sharp", () => {
        const actualDirection = getPartialTurn(CompassDirection.north, CompassDirection.east, 2)
        expect(actualDirection).toBe(CompassDirection.east)
    })

    test("Should return less sharp turn if turn is too sharp", () => {
        const actualDirection = getPartialTurn(CompassDirection.north, CompassDirection.southEast, 2)
        expect(actualDirection).toBe(CompassDirection.east)
    })

    test("Should turn clockwise if half circle turn required", () => {
        const actualDirection = getPartialTurn(CompassDirection.northEast, CompassDirection.southWest, 2)
        expect(actualDirection).toBe(CompassDirection.southEast)
    })

    test("Should function correctly for counterclockwise turns", () => {
        const actualDirection = getPartialTurn(CompassDirection.northEast, CompassDirection.west, 1)
        expect(actualDirection).toBe(CompassDirection.north)
    })
})