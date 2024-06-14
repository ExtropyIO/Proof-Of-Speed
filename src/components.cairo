use starknet::ContractAddress;

# Game Component
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Game {
    #[key]
    game_id: u32,
    start_time: u64,
    turns_remaining: usize,
    is_finished: bool,
    creator: ContractAddress,
}

# Object Component
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Object{
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    object_id: felt252,
    description: felt252,
}

# Door Component
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Door{
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    secret: felt252,
}

# Ticking function
#[generate_trait]
impl GameImpl of GameTrait {
    #[inline(always)]
    fn tick(self: Game) -> bool {
        let info = starknet::get_block_info().unbox();

        if info.block_timestamp < self.start_time {
            return false;
        }
        if self.is_finished {
            return false;
        }
        true
    }
}