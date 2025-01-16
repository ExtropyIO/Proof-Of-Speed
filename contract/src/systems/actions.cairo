use dojo_starter::models::{Direction, Position, Grid};
use super::proof_of_speed::proof_of_speed::{start_game, move_player, win_game};


#[starknet::interface]
trait IActions<T> {
    fn spawn(ref self: T);
    fn move(ref self: T, direction: Direction);
}

#[dojo::contract]
pub mod actions {
    use super::{IActions, Direction, Position, next_position};
    use starknet::{ContractAddress, get_caller_address, get_block_number};
    use dojo_starter::models::{Vec2, Moves, DirectionsAvailable, TreasurePosition, Grid};

    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;

    use super::{start_game, move_player, win_game};

    #[derive(Copy, Drop, Serde)]
    struct Wall {
        start: Vec2,
        length: u32,
        is_horizontal: bool,
    }

    fn generate_walls(
        grid_width: u32, grid_height: u32, num_walls: u32, total_length: u32
    ) -> Array<Vec2> {
        let mut wall_positions = ArrayTrait::new();

        let avg_length = total_length / num_walls;

        let mut remaining_length = total_length;
        let mut walls_created = 0;

        loop {
            if walls_created >= num_walls {
                break;
            }

            let is_horizontal = walls_created % 2 == 0;

            let mut wall_length = if walls_created == num_walls - 1 {
                remaining_length
            } else {
                avg_length
            };

            // I would need proper randomness here
            let start_x = if is_horizontal {
                grid_width - wall_length
            } else {
                grid_width - 1
            };

            let start_y = if is_horizontal {
                grid_height - 1
            } else {
                grid_height - wall_length
            };

            let mut current_pos = Vec2 { x: start_x, y: start_y };
            let mut length_added = 0;

            loop {
                if length_added >= wall_length {
                    break;
                }

                wall_positions.append(current_pos);

                if is_horizontal {
                    current_pos.x += 1;
                } else {
                    current_pos.y += 1;
                }

                length_added += 1;
            };

            remaining_length -= wall_length;
            walls_created += 1;
        };

        wall_positions
    }

    fn is_wall(walls: Array<Vec2>, position: Vec2) -> bool {
        let mut i = 0;
        loop {
            if i >= walls.len() {
                break false;
            }
            let wall_pos = *walls.at(i);
            if wall_pos.x == position.x && wall_pos.y == position.y {
                break true;
            }
            i += 1;
        }
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn(ref self: ContractState) {
            let mut world = self.world_default();

            let player = get_caller_address();
            let position: Position = world.read_model(player);

            let new_position_vector = Vec2 { x: position.vec.x + 10, y: position.vec.y + 10 };
            let new_treasure_position_vector = Vec2 { x: 16, y: 16 };

            let new_position = Position { player, vec: new_position_vector };
            let new_treasure_position = TreasurePosition {
                player, vec: new_treasure_position_vector
            };

            let grid_width: u32 = 15;
            let grid_height: u32 = 15;

            let walls = generate_walls(grid_width, grid_height, 10, 30);

            let grid = Grid {
                player,
                width: grid_width,
                height: grid_height,
                treasure_position: new_treasure_position_vector,
                player_initial_position: new_position_vector,
                starting_block: starknet::get_block_number(),
                walls,
            };

            world.write_model(@new_position);
            world.write_model(@new_treasure_position);
            world.write_model(@grid);

            let moves = Moves {
                player, remaining: 100, last_direction: Direction::None(()), can_move: true
            };

            world.write_model(@moves);

            start_game(ref world, player, grid);
            // world
        //     .emit_event(
        //         @PlayerSpawned {
        //             player, timestamp: starknet::get_block_timestamp(), grid: grid
        //         }
        //     );
        }

        fn move(ref self: ContractState, direction: Direction) {
            let mut world = self.world_default();
            let player = get_caller_address();

            let position: Position = world.read_model(player);
            let treasure_position: TreasurePosition = world.read_model(player);
            let mut moves: Moves = world.read_model(player);
            let grid: Grid = world.read_model(player);

            let next = next_position(position, direction);

            if !is_wall(grid.walls, next.vec) {
                // Only update position if there's no wall
                world.write_model(@next);

                moves.remaining -= 1;
                moves.last_direction = direction;
                world.write_model(@moves);

                move_player(ref world, player, direction);
                // world.emit_event(@Moved { player, direction });

                if (next.vec.x == treasure_position.vec.x
                    && next.vec.y == treasure_position.vec.y) {
                    let current_block = starknet::get_block_number();

                    if (current_block - grid.starting_block < 10_u64) { // world
                    //     .emit_event(
                    //         @Warning__FastWin {
                    //             player,
                    //             timestamp: starknet::get_block_timestamp(),
                    //             block_number: current_block,
                    //         }
                    //     );
                    }

                    win_game(ref world, player);
                    //world
                //    .emit_event(
                //        @TreasureFound {
                //            player,
                //            treasure_position: treasure_position.vec,
                //            timestamp: starknet::get_block_timestamp()
                //        }
                //    );
                }
            } else {
                // still count the move
                moves.remaining -= 1;
                moves.last_direction = direction;

                world.write_model(@moves);
            }
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "dojo_starter". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }
    }
}

fn next_position(mut position: Position, direction: Direction) -> Position {
    match direction {
        Direction::None => { return position; },
        Direction::Left => { position.vec.x -= 1; },
        Direction::Right => { position.vec.x += 1; },
        Direction::Up => { position.vec.y -= 1; },
        Direction::Down => { position.vec.y += 1; },
    };
    position
}
