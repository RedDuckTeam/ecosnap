use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};

use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::spl_token_2022::extension::{
        group_member_pointer::GroupMemberPointer, metadata_pointer::MetadataPointer,
        permanent_delegate::PermanentDelegate,
        transfer_hook::TransferHook,
    },
    token_interface::{
        spl_token_metadata_interface::state::TokenMetadata, token_metadata_initialize, Mint,
        Token2022, TokenAccount, TokenMetadataInitialize,
    },
};

#[derive(Accounts)]
pub struct CheckMintExtensionConstraints<'info> {
    #[account(mut)]
    /// CHECK: can be any account
    pub authority: Signer<'info>,
    #[account(
        extensions::metadata_pointer::authority = authority,
        extensions::metadata_pointer::metadata_address = mint,
        extensions::group_member_pointer::authority = authority,
        extensions::group_member_pointer::member_address = mint,
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,
}
