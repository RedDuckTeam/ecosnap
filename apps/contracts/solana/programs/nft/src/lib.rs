use anchor_lang::prelude::*;

pub mod instructions;
pub mod utils;
pub mod state;
pub mod errors;
pub mod constants;

use instructions::*;
pub use utils::*;
pub use state::*;

declare_id!("7PkvYFurAyci1hZFhkvfwHvMFZt9ctdpK8pogGNVizjm");

#[program]
pub mod nft {
    use super::*;

     pub fn initialize_global_state(
         ctx: Context<InitializeGlobalState>,
         gc_address: Pubkey,
     ) -> Result<()> {
         initialize_global_state::handle(ctx, gc_address)
     }

    pub fn create_mint_account(
        ctx: Context<CreateMintAccount>,
        args: CreateMintAccountArgs,
    ) -> Result<()> {
        instructions::handler(ctx, args)
    }

    pub fn check_mint_extensions_constraints(
        _ctx: Context<CheckMintExtensionConstraints>,
    ) -> Result<()> {
        Ok(())
    }
}
