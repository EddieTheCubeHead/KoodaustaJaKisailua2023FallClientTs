import {CellType, CompassDirection, GameMap, GridPosition} from "./wrapper/models";
import {config} from "./config_provider";

/**
 * Get the difference between two coordinates
 *
 * @param origin the origin (source) coordinates for the calculation
 * @param target the target coordinates for the calculation
 *
 * @returns a vector representing the difference from origin to target
 */
export const getCoordinateDifference = (origin: GridPosition, target: GridPosition): GridPosition => {
    return {x: target.x - origin.x, y: target.y - origin.y}
}

const getVectorAngleDegrees = (vector: GridPosition) => {
    const angleDegrees = (Math.atan2(vector.y, -vector.x) * 180 / Math.PI)
    return angleDegrees < 0 ? angleDegrees + 360 : angleDegrees
}

/**
 * Get a compass direction most closely representing the given vector
 *
 * @param vector the vector which should be converted to approximate compass direction
 *
 * @returns the compass direction closest to the vector
 */
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

/**
 * Get coordinates for a given entity from the given game map
 *
 * @param entityId the id of the entity to search for in the map
 * @param gameMap the game map to search for the entity in
 *
 * @returns the entity coordinates if the entity exists, otherwise null
 */
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

/**
 * Get the compass direction that is the furthest one you are allowed to turn towards from the given starting
 * direction, given the turn rate.
 *
 * @param startingDirection the starting direction for the turn
 * @param targetDirection the target direction for the turn
 * @param turnRate the turn rate for the game, see models.ClientContext.turnRate
 *
 * @returns The furthest direction between starting and target directions allowed by the turn rate
 *
 * @remarks If performing a 180-degree turn, the function will always perform the partial turn clockwise
 */
export const getPartialTurn = (startingDirection: CompassDirection, targetDirection: CompassDirection, turnRate: number) => {
    let initialTurn = directionMappings[targetDirection] - directionMappings[startingDirection]
    let afterTurnDirection: number
    if (initialTurn > 4) {  // Turning counterclockwise
        initialTurn -= 8
        afterTurnDirection = directionMappings[startingDirection] + Math.max(initialTurn, -turnRate)
    } else {
        afterTurnDirection = directionMappings[startingDirection] + Math.min(initialTurn, turnRate)
    }
    return afterTurnDirection < 0 ? directionByIndex[afterTurnDirection + 8] : directionByIndex[afterTurnDirection % 8]
}

/**
 * Get the id of your ship
 *
 * @returns The id of your ship as str
 */
export const getOwnShipId = () => {
    return `ship:${config.token}:${config.botName}`
}