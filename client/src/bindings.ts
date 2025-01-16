/**
 * Interface representing a player's movement capabilities and state.
 */
interface Moves {
  /** Order of fields in the model */
  fieldOrder: string[];
  /** Player identifier */
  player: string;
  /** Number of moves remaining */
  remaining: number;
  /** Last direction moved */
  last_direction: Direction;
  /** Whether the player can currently move */
  can_move: boolean;
}

interface Grid {
  fieldOrder: string[];
  player: string;
  width: number;
  height: number;
  treasure_position: Vec2;
  player_initial_position: Vec2;
  starting_block: number;
  walls: Array<Vec2>;
}

/**
 * Interface representing available movement directions for a player.
 */
interface DirectionsAvailable {
  /** Order of fields in the model */
  fieldOrder: string[];
  /** Player identifier */
  player: string;
  /** List of available directions */
  directions: Direction[];
}

interface Warning__FastWin {
  fieldOrder: string[];
  player: string;
  timestamp: number;
  block_number: number;
}

interface StartGame {
  fieldOrder: string[];
  player: string;
  grid: Grid;
  timestamp: number;
  block_number: number;
}

interface WinGame {
  fieldOrder: string[];
  player: string;
  timestamp: number;
  block_number: number;
}

interface Moved {
  fieldOrder: string[];
  player: string;
  direction: Direction;
  timestamp: number;
  block_number: number;
}

interface TreasurePosition {
  fieldOrder: string[];
  player: string;
  vec: Vec2;
}

/**
 * Interface representing a player's position in the game world.
 */
interface Position {
  /** Order of fields in the model */
  fieldOrder: string[];
  /** Player identifier */
  player: string;
  /** 2D vector representing position */
  vec: Vec2;
}

/**
 * Enum representing possible movement directions.
 */
enum Direction {
  None = "0",
  Left = "1",
  Right = "2",
  Up = "3",
  Down = "4",
}

/**
 * Interface representing a 2D vector.
 */
interface Vec2 {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Type representing the complete schema of game models.
 */
type Schema = {
  dojo_starter: {
    Moves: Moves;
    DirectionsAvailable: DirectionsAvailable;
    Position: Position;
    WinGame: WinGame;
    StartGame: StartGame;
    Warning__FastWin: Warning__FastWin;
    TreasurePosition: TreasurePosition;
    Moved: Moved;
    Grid: Grid;
  };
};

/**
 * Enum representing model identifiers in the format "namespace-modelName".
 */
enum Models {
  Moves = "dojo_starter-Moves",
  DirectionsAvailable = "dojo_starter-DirectionsAvailable",
  Position = "dojo_starter-Position",
  WinGame = "dojo_starter-WinGame",
  TreasurePosition = "dojo_starter-TreasurePosition",
  StartGame = "dojo_starter-StartGame",
  Grid = "dojo_starter-Grid",
  Moved = "dojo_starter-Moved",
}

const schema: Schema = {
  dojo_starter: {
    Moves: {
      fieldOrder: ["player", "remaining", "last_direction", "can_move"],
      player: "",
      remaining: 0,
      last_direction: Direction.None,
      can_move: false,
    },
    Moved: {
      fieldOrder: ["player", "direction", "timestamp", "block_number"],
      player: "",
      direction: Direction.None,
      timestamp: 0,
      block_number: 0,
    },
    DirectionsAvailable: {
      fieldOrder: ["player", "directions"],
      player: "",
      directions: [],
    },
    Position: {
      fieldOrder: ["player", "vec"],
      player: "",
      vec: { x: 0, y: 0 },
    },
    WinGame: {
      fieldOrder: ["player", "timestamp", "block_number"],
      player: "",
      timestamp: 0,
      block_number: 0,
    },
    TreasurePosition: {
      fieldOrder: ["player", "vec"],
      player: "",
      vec: { x: 0, y: 0 },
    },
    StartGame: {
      fieldOrder: ["player", "grid", "timestamp", "block_number"],
      player: "",
      grid: {
        fieldOrder: [],
        player: "",
        width: 0,
        height: 0,
        treasure_position: { x: 0, y: 0 },
        player_initial_position: { x: 0, y: 0 },
        starting_block: 0,
        walls: [],
      },
      timestamp: 0,
      block_number: 0,
    },
    Warning__FastWin: {
      fieldOrder: ["player", "timestamp", "block_number"],
      player: "",
      timestamp: 0,
      block_number: 0,
    },
    Grid: {
      fieldOrder: [
        "player",
        "width",
        "height",
        "treasure_position",
        "player_initial_position",
        "starting_block",
        "walls",
      ],
      player: "",
      width: 0,
      height: 0,
      treasure_position: { x: 0, y: 0 },
      player_initial_position: { x: 0, y: 0 },
      starting_block: 0,
      walls: [],
    },
  },
};

export type {
  Schema,
  Moves,
  DirectionsAvailable,
  Position,
  StartGame,
  Warning__FastWin,
  WinGame,
  TreasurePosition,
  Moved,
  Vec2,
  Grid,
};
export { Direction, schema, Models };
