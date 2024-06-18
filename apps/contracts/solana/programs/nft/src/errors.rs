use anchor_lang::prelude::error_code;

#[error_code]
pub enum GcError {
    #[msg("Insufficient usd amount!")]
    InvalidProof,
}
