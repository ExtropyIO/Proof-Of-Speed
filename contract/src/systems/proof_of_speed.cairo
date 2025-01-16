pub mod proof_of_speed {
    use starknet::{ContractAddress, get_block_number};
    use dojo_starter::models::{Vec2, Grid, Direction};
    use dojo::event::EventStorage;
    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::world::WorldStorage;

    #[derive(Drop, Serde)]
    #[dojo::event]
    pub struct StartGame {
        #[key]
        pub player: ContractAddress,
        pub grid: Grid,
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

    fn start_game(ref world: WorldStorage, player: ContractAddress, grid: Grid) {
        let timestamp = get_block_number();
        let block_number = get_block_number();

        world.emit_event(@StartGame { player, grid, timestamp, block_number, });
    }

    fn move_player(ref world: WorldStorage, player: ContractAddress, direction: Direction) {
        let timestamp = get_block_number();
        let block_number = get_block_number();

        world.emit_event(@Moved { player, direction, timestamp, block_number });
    }

    fn win_game(ref world: WorldStorage, player: ContractAddress) {
        let timestamp = get_block_number();
        let block_number = get_block_number();

        world.emit_event(@WinGame { player, timestamp, block_number });
    }
}
