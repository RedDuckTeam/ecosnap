use crate::{state::ProofState};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeProof<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = ProofState::MEM_LENGTH
    )]
    pub proof_state: Account<'info, ProofState>,

    pub system_program: Program<'info, System>,
}

pub fn handle(
    ctx: Context<InitializeProof>,
    proof_hash: String
) -> Result<()> {
    let state = &mut ctx.accounts.proof_state;
    state.proof_hash = proof_hash;

    Ok(())
}
