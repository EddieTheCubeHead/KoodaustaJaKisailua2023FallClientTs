import {CellType, CompassDirection, GameMap, GridPosition} from "./wrapper/models";

export const getCoordinateDifference = (origin: GridPosition, target: GridPosition): GridPosition => {
    return {x: target.x - origin.x, y: target.y - origin.y}
}

const getVectorAngleDegrees = (vector: GridPosition) => {
    const angleDegrees = (Math.atan2(vector.y, -vector.x) * 180 / Math.PI)
    return angleDegrees < 0 ? angleDegrees + 360 : angleDegrees
}

export const getApproximateDirection = (vector: GridPosition): CompassDirection => {
    const angle = getVectorAngleDegrees(vector)
    const cutoff = 360 / 16
    if (angle >= 15 * cutoff || angle < cutoff) {
        return CompassDirection.north
    } else if (angle < 3 * cutoff) {
        return CompassDirection.northEast
    } else if (angle < 5 * cutoff) {
        return CompassDirection.east
    } else if (angle < 7 * cutoff) {
        return CompassDirection.southEast
    } else if (angle < 9 * cutoff) {
        return CompassDirection.south
    } else if (angle < 11 * cutoff) {
        return CompassDirection.southWest
    } else if (angle < 13 * cutoff) {
        return CompassDirection.west
    }
    return CompassDirection.northWest
}

export const getEntityCoordinates = (entityId: string, gameMap: GameMap): GridPosition | null => {
    for (const [y, row] of gameMap.entries()) {
        for (const [x, cell] of row.entries()) {
            if (cell.type == CellType.projectile || cell.type == CellType.ship) {
                if (cell.data?.id == entityId) {
                    return {x, y}
                }
            }
        }
    }
    return null
}

const directionMappings: {[key in CompassDirection]: number} = {
    "n": 0,
    "ne": 1,
    "e": 2,
    "se": 3,
    "s": 4,
    "sw": 5,
    "w": 6,
    "nw": 7
}

const directionByIndex = [
    CompassDirection.north,
    CompassDirection.northEast,
    CompassDirection.east,
    CompassDirection.southEast,
    CompassDirection.south,
    CompassDirection.southWest,
    CompassDirection.west,
    CompassDirection.southWest
]

export const getPartialTurn = (startingDirection: CompassDirection, targetDirection: CompassDirection, turnRate: number) => {
    let initialTurn = directionMappings[targetDirection] - directionMappings[startingDirection]
    let afterTurnDirection
    if (initialTurn > 4) {  // Turning counterclockwise
        initialTurn -= 8
        afterTurnDirection = directionMappings[startingDirection] + Math.max(initialTurn, -turnRate)
    } else {
        afterTurnDirection = directionMappings[startingDirection] + Math.min(initialTurn, turnRate)
    }
    return afterTurnDirection < 0 ? directionByIndex[afterTurnDirection + 8] : directionByIndex[afterTurnDirection % 8]
}