use crate::state::GlobalState;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeGlobalState<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handle(ctx: Context<InitializeGlobalState>, address: Pubkey) -> Result<()> {
    let gc_address = address;

    Ok(())
}
