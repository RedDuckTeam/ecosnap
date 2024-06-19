use anchor_lang::prelude::*;

#[account]
pub struct NftGlobalState {
    pub gc_address: Pubkey,
    pub authority: Pubkey,
}

impl NftGlobalState {
    pub const SEED: &'static [u8; 12] = b"global_state";

    pub const MEM_LENGTH: usize = 8 + 32 + 32;
}
