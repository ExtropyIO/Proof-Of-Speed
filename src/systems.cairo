#[system]
mod create {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;
    use starknet::{ContractAddress};

    use dojo_examples::components::{Door};
    use dojo_examples::components::{Object, ObjectTrait};
    use dojo_examples::components::{Game, GameTrait};

    #[event]
    use dojo_examples::events::{Event, ObjectData, GameState};

    fn execute(ctx: Context, start_time: u64, turns_remaining: usize,) {

        let game_id = ctx.world.uuid();

        let game = Game {
            game_id,
            start_time,
            turns_remaining,
            is_finished: false,
            creator: ctx.origin,
        };

        let door = Door {
            game_id,
            player_id: ctx.origin,
            secret: '1984',
        };

        set !(ctx.world, (game, door));

        set !(
            ctx.world,
            (
                Object {
                    game_id:game_id, player_id: ctx.origin, object_id: 'Painting', description: 'An intriguing painting.', 
                    },
                Object {
                    game_id:game_id, player_id: ctx.origin, object_id: 'Foto', description: 'An egyptian cat.',
                    },
                Object {
                    game_id:game_id, player_id: ctx.origin, object_id: 'Strange Amulet', description: 'Until tomorrow',
                    },
                Object {
                    game_id:game_id, player_id: ctx.origin, object_id: 'Book', description: '1984',
                    },
            )
        );

        emit!(ctx.world, GameState { game_state: 'Game Initialized'});
        
        return ();
    }
}