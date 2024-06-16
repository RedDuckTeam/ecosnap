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

    pub fn new_proof(ctx: Context<NewProof>, proof_hash: String) -> Result<()> {
        new_proof::handle(ctx, proof_hash)
    }
}
