use anchor_lang::prelude::*;

#[account]
pub struct GlobalState {
    pub authority: Pubkey,
}

impl GlobalState {
    pub const SEED: &'static [u8; 12] = b"global_state";

    pub const MEM_LENGTH: usize = 32;
}
