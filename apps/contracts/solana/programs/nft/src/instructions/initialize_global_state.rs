use crate::state::NftGlobalState;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeGlobalState<'info> {
     #[account(mut)]
      pub signer: Signer<'info>,

      #[account(
          init,
          payer = signer,
          space = NftGlobalState::MEM_LENGTH
      )]
      pub global_state: Account<'info, NftGlobalState>,

      pub system_program: Program<'info, System>,
}

pub fn handle(ctx: Context<InitializeGlobalState>, address: Pubkey) -> Result<()> {
    let state = &mut ctx.accounts.global_state;
    state.gc_address = address;

    Ok(())
}
