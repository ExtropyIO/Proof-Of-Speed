pub mod proof_of_speed {
    use starknet::{ContractAddress, get_block_number};
    use dojo_starter::models::{Vec2, Direction};
    use dojo::event::EventStorage;
    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::world::WorldStorage;

    #[derive(Drop, Serde)]
    #[dojo::event]
    pub struct StartGame {
        #[key]
        pub player: ContractAddress,
        pub entity_positions: Array<Vec2>,
        pub timestamp: u64,
        pub block_number: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct Moved {
        #[key]
        pub player: ContractAddress,
        pub direction: Direction,
        pub timestamp: u64,
        pub block_number: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct WinGame {
        #[key]
        pub player: ContractAddress,
        pub timestamp: u64,
        pub block_number: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct UpdateWorld {
        #[key]
        pub player: ContractAddress,
        pub current_state: felt252,
        pub new_state: felt252,
        pub timestamp: u64,
        pub block_number: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct AddCheckpoint {
        #[key]
        pub player: ContractAddress,
        pub position: Vec2,
        pub checkpoint: felt252,
        pub timestamp: u64,
        pub block_number: u64,
    }

    fn start_game(ref world: WorldStorage, player: ContractAddress, entity_positions: Array<Vec2>) {
        let timestamp = get_block_number();
        let block_number = get_block_number();

        world.emit_event(@StartGame { player, entity_positions, timestamp, block_number });
    }

    fn move_player(ref world: WorldStorage, player: ContractAddress, direction: Direction) {
        let timestamp = get_block_number();
        let block_number = get_block_number();

        world.emit_event(@Moved { player, direction, timestamp, block_number });
    }

    fn add_checkpoint(
        ref world: WorldStorage, player: ContractAddress, position: Vec2, checkpoint: felt252
    ) {
        let timestamp = get_block_number();
        let block_number = get_block_number();

        world.emit_event(@AddCheckpoint { player, position, checkpoint, timestamp, block_number });
    }

    fn win_game(ref world: WorldStorage, player: ContractAddress) {
        let timestamp = get_block_number();
        let block_number = get_block_number();

        world.emit_event(@WinGame { player, timestamp, block_number });
    }

    fn update_world(
        ref world: WorldStorage, player: ContractAddress, current_state: felt252, new_state: felt252
    ) {
        let timestamp = get_block_number();
        let block_number = get_block_number();

        world
            .emit_event(@UpdateWorld { player, current_state, new_state, timestamp, block_number });
    }
}
