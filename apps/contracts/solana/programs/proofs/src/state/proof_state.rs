use anchor_lang::prelude::*;

#[account]
pub struct ProofState {
    pub proof_hash: String,
}

impl ProofState {
    pub const SEED: &[u8; 11] = b"proof_state";

    pub const MEM_LENGTH: usize = 512;
}
