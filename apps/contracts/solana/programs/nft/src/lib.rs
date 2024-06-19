use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

use instructions::*;
pub use state::*;
pub use utils::*;

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
        user: Pubkey,
        amount: u64,
        name: String,
        symbol: String,
        uri: String,
        achievement_uuid: [u8; 16],
        merkle_uuid: [u8; 16],
        proofs: Vec<[u8; 32]>,
    ) -> Result<()> {
        instructions::handler(
            ctx,
            user,
            amount,
            name,
            symbol,
            uri,
            achievement_uuid,
            merkle_uuid,
            proofs,
        );
        Ok(())
    }

    pub fn check_mint_extensions_constraints(
        _ctx: Context<CheckMintExtensionConstraints>,
    ) -> Result<()> {
        Ok(())
    }
}
