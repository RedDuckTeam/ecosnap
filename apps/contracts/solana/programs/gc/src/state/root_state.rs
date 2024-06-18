use anchor_lang::prelude::*;

#[account]
pub struct RootState {
    pub root: [u8; 32],
}

impl RootState {
    pub const SEED: &'static [u8; 10] = b"root_state";

    pub const MEM_LENGTH: usize = 8 + 32;
}
