use crate::state::RootState;
use crate::state::GlobalState;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(external_id: [u8; 16])]
pub struct NewRoot<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = RootState::MEM_LENGTH,
        seeds = [RootState::SEED, global_state.key().as_ref(), &external_id], 
        bump
    )]
    pub root_state: Account<'info, RootState>,

    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,

    pub system_program: Program<'info, System>,
}

pub fn handle(ctx: Context<NewRoot>, external_id: [u8; 16], root: [u8; 32]) -> Result<()> {
    let state = &mut ctx.accounts.root_state;
    state.root = root;

    Ok(())
}
