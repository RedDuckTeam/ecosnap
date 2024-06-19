use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;
pub mod utils;

use instructions::*;

declare_id!("5Mew5NxqLr5NGG6VbHtkNNK6LNGa5ucKyuV6stWmfy16");

#[program]
pub mod gc {
    use super::*;

    pub fn initialize_global_state(
        ctx: Context<InitializeGlobalState>,
        authority: Pubkey,
    ) -> Result<()> {
        initialize_global_state::handle(ctx, authority)
    }

    pub fn new_root(ctx: Context<NewRoot>, merkle_uuid: [u8; 16], root: [u8; 32]) -> Result<()> {
        new_root::handle(ctx, merkle_uuid, root)
    }
}
