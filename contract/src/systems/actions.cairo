use array::Array;
use array::ArrayTrait;
use poseidon::poseidon_hash_span;
use traits::Into;
use dojo_starter::models::{Direction, Position, Grid, Vec2, Vec2Trait};
use super::proof_of_speed::proof_of_speed::{start_game, move_player, win_game, update_world};


#[starknet::interface]
trait IActions<T> {
    fn spawn(ref self: T);
    fn move(ref self: T, direction: Direction);
    fn place_treasure(ref self: T, new_position: Vec2) -> bool;
}

#[dojo::contract]
pub mod actions {
    use starknet::{ContractAddress, get_caller_address, get_block_number};
    use starknet::contract_address_const;
    use dojo_starter::models::{Vec2, Moves, DirectionsAvailable, TreasurePosition, Grid};

    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;

    use super::{IActions, Direction, Position, next_position, Vec2Trait, hash_vec2_array};
    use super::{start_game, move_player, win_game, update_world};

    #[derive(Copy, Drop, Serde)]
    struct Wall {
        start: Vec2,
        length: u32,
        is_horizontal: bool,
    }

    fn generate_walls(grid_width: u32, grid_height: u32, block_number: u64) -> Array<Vec2> {
        let mut wall_positions = ArrayTrait::new();

        let difficulty: u32 = (block_number % 10).try_into().unwrap();
        let block_mod: u32 = (block_number % 100).try_into().unwrap();

        let mut y = 1;
        loop {
            if y >= grid_height {
                break;
            }

            if y % 2 == 1 {
                let mut x = 0;
                loop {
                    if x >= grid_width {
                        break;
                    }

                    if (x + y + (block_mod)) % 10 <= difficulty {
                        wall_positions.append(Vec2 { x, y });
                    }

                    x += 1;
                };
            }

            y += 1;
        };

        wall_positions
    }

    fn is_wall(walls: @Array<Vec2>, position: Vec2) -> bool {
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
            let old_grid: Grid = world.read_model(player);

            let new_position_vector = Vec2 { x: 0, y: 0 };

            let treasure_position: TreasurePosition = world.read_model(player);
            let treasure_position_vector = if treasure_position.vec.x == 0_u32
                && treasure_position.vec.y == 0_u32 {
                Vec2 {
                    x: 14, y: 14
                } // Default position if treasure position was not placed = (0,0)
            } else {
                treasure_position.vec
            };

            let new_position = Position { player, vec: new_position_vector };
            let new_treasure_position = TreasurePosition { player, vec: treasure_position_vector };

            let grid_width: u32 = 15;
            let grid_height: u32 = 15;

            let block_number = starknet::get_block_number();

            let walls = generate_walls(grid_width, grid_height, block_number);

            let grid = Grid {
                player,
                width: grid_width,
                height: grid_height,
                treasure_position: treasure_position_vector,
                player_initial_position: new_position_vector,
                starting_block: block_number,
                walls,
            };

            world.write_model(@new_position);
            world.write_model(@new_treasure_position);
            world.write_model(@grid);

            let moves = Moves {
                player, remaining: 100, last_direction: Direction::None(()), can_move: true
            };

            world.write_model(@moves);

            start_game(
                ref world,
                player,
                entity_positions: array![new_position_vector, treasure_position_vector]
            );

            let old_walls_hash = hash_vec2_array(old_grid.walls);
            let new_walls_hash = hash_vec2_array(grid.walls);

            update_world(ref world, player, old_walls_hash, new_walls_hash);
        }

        fn move(ref self: ContractState, direction: Direction) {
            let mut world = self.world_default();
            let player = get_caller_address();

            let position: Position = world.read_model(player);
            let treasure_position: TreasurePosition = world.read_model(player);
            let mut moves: Moves = world.read_model(player);
            let grid: Grid = world.read_model(player);

            let next = next_position(position, direction);

            if !is_wall(@grid.walls, next.vec) {
                // Only update position if there's no wall
                world.write_model(@next);

                moves.remaining -= 1;
                moves.last_direction = direction;
                world.write_model(@moves);

                move_player(ref world, player, direction);

                if (next.vec.x == treasure_position.vec.x
                    && next.vec.y == treasure_position.vec.y) {
                    win_game(ref world, player);
                }
            } else {
                // still count the move
                moves.remaining -= 1;
                moves.last_direction = direction;

                world.write_model(@moves);
            }
        }

        fn place_treasure(ref self: ContractState, new_position: Vec2) -> bool {
            let mut world = self.world_default();
            // let player = get_caller_address();
            let player: ContractAddress = contract_address_const::<
                0x4a655ae081a867b4a84815b858451807caaf4165b70bff22a7a9673397b3d1f
            >();

            let grid: Grid = world.read_model(player);
            let old_treasure_position: Vec2 = grid.treasure_position;

            assert!(grid.player == player, "Player does not match");

            let spawn_position = grid.player_initial_position;

            if !new_position.is_valid_treasure_position(spawn_position, 5_u32) {
                assert!(false, "Invalid treasure position");
                return false;
            }

            if is_wall(@grid.walls, new_position) {
                assert!(false, "Wall at treasure position");
                return false;
            }

            let new_treasure_position = TreasurePosition { player, vec: new_position };

            world.write_model(@new_treasure_position);

            let old_pos_hash = poseidon::poseidon_hash_span(
                array![old_treasure_position.x.into(), old_treasure_position.y.into()].span()
            );
            let new_pos_hash = poseidon::poseidon_hash_span(
                array![new_position.x.into(), new_position.y.into()].span()
            );

            update_world(ref world, player, old_pos_hash, new_pos_hash);

            let new_grid = Grid {
                player,
                width: grid.width,
                height: grid.height,
                treasure_position: new_position,
                player_initial_position: grid.player_initial_position,
                starting_block: grid.starting_block,
                walls: grid.walls,
            };
            world.write_model(@new_grid);

            true
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

fn hash_vec2_array(arr: Array<Vec2>) -> felt252 {
    let mut elements: Array<felt252> = ArrayTrait::new();

    elements.append(arr.len().into());

    let arr_span = arr.span();
    let mut i: usize = 0;
    loop {
        if i >= arr_span.len() {
            break;
        }

        let vec2 = *arr_span.at(i);
        elements.append(vec2.x.into());
        elements.append(vec2.y.into());
        i += 1;
    };

    poseidon_hash_span(elements.span())
}
