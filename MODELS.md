# ClientContext

The `ClientContext` object is available in the tick processing function as the `context`
argument. It is reset at the start of a game and can be used to store persistent data
between ticks. It also contains data about the game sent by the server at game start.
This data is the tick length of the game in milliseconds and the maximum turn rate for
the game, in 1/8ths of a circle, or compass direction steps.

If you want to use type checking and/or autocomplete with the data you store in the client
context, you can edit the class in `src/apiwrapper/models.ts` to add the fields you need.
The basic client context class is as follows:

```typescript
interface ClientContext {
    tick_length_ms: number
    turn_rate: number
}
```

# GameState

The `GameState` object houses two fields. `turnNumber` and `gameMap`.

 - `turnNumber` is a rolling integer denoting the current turn,
starting from 1.
 - `gameMap` is a matrix (array of arrays) of `Cell` objects. See [Cells](#cells) for
further reference

```typescript
interface GameState {
    turn_number: number
    game_map: Cell[][]
}
```

## Cells

Each cell houses a `Cell` object, with fields `cellType` and `data`. Cell type denotes
the cell type and data houses the unique data for each cell type. 

```typescript
interface Cell {
    cell_type: CellType
    data: dict | HitBoxData | ShipData | ProjectileData
}
```

Possible cell types and their data models are:

### Empty
Empty cell, only space here. Data is an empty object (`{}`)

### OutOfVision
Cell outside your vision range. Data is an empty object (`{}`)


### AudioSignature
If an enemy ship is outside your vision range, an out of vision cell at the edge of your
vision is converted into an audio signature cell on the line from your ship towards
the ship that is out of vision. Data is an empty object (`{}`)

### HitBox
Entities (ships and projectiles) are not always exactly the size of one cell. In these
cases the middle cell of the entity houses the entity data, while the rest are hit box
cells with a reference to the main entity by entity id.
```typescript
interface HitBoxData {
    entity_id: string
}
```

### Ship
A cell with a ship entity

See [CompassDirection](#compassdirection) for possible compass direction values.
```typescript
class ShipData {
    id: string
    position: CompassDirection
    position: Coordinates
    health: number
    heat: number
}
```

### Projectile
A cell with a projectile entity

See [CompassDirection](#compassdirection) for possible compass direction values.
```typescript
class ProjectileData {
    id: string
    position: CompassDirection
    position: Coordinates
    speed: number
    mass: number
}
```

# Command

The bot sends command models as a response to server game tick events. Each command
model has an `actionType` field and a `payload` field containing action type specific
data.

```typescript
enum ActionType {
    Move,
    Shoot,
    Turn
}

interface Command {
    actionType: ActionType
    payload: MoveAction | ShootAction | TurnAction
}
```

The models are as follows:

### Move

Move straight ahead 0 to 3 cells. Dissipates `distance * 2` heat

```typescript
interface MoveActionData {
    distance: number
}
```

### Turn

Turn to a compass direction. Cannot be compass direction at a time than the game max
turn radius. Validated server-side

```typescript
interface TurnActionData {
    direction: CompassDirection
}
```

### Shoot

Shoot a projectile. Generates `mass * speed` heat, moves at `speed` speed and
does `mass * 2 + speed` damage on impact. Heat exceeding `25` will be converted to
damage on your ship in a ratio of `1:1`


```typescript
interface ShootActionData {
    mass: number
    speed: number
}
```

# CompassDirection
Enum holding compass direction values
```typescript
enum CompassDirection {
    North = "n",
    NorthEast = "ne",
    East = "e",
    SouthEast = "se",
    South = "s",
    SouthWest = "sw",
    West = "w",
    NorthWest = "nw"
}
```