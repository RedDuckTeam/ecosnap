use anchor_lang::{
    prelude::*, solana_program::entrypoint::ProgramResult, solana_program::hash::hashv,
};

use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::spl_token_2022::extension::{
        group_member_pointer::GroupMemberPointer, metadata_pointer::MetadataPointer,
        mint_close_authority::MintCloseAuthority, non_transferable::NonTransferable,
        permanent_delegate::PermanentDelegate, transfer_hook::TransferHook,
    },
    token_2022::{mint_to, MintTo},
    token_interface::{
        spl_token_metadata_interface::state::TokenMetadata, token_metadata_initialize, Mint,
        Token2022, TokenAccount, TokenMetadataInitialize,
    },
};
use spl_pod::optional_keys::OptionalNonZeroPubkey;

use gc::id as GC_PROGRAM_ID;
use gc::state::{GlobalState, RootState};

use crate::program::Nft;

use crate::{
    constants::*, errors::GcError, get_meta_list_size, get_mint_extensible_extension_data,
    get_mint_extension_data, state::NftGlobalState, update_account_lamports_to_minimum_balance,
    utils::verify,
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateMintAccountArgs {
    pub user: Pubkey,
    pub amount: u16,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub achievement_uuid: [u8; 16],
    pub merkle_uuid: [u8; 16],
    pub proofs: Vec<[u8; 32]>,
}

#[derive(Accounts)]
pub struct CreateMintAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK:
    #[account(
        init_if_needed,
        seeds = [VAULT_PDA_SEED],
        bump,
        payer = payer,
        space = 0
    )]
    pub authority: AccountInfo<'info>,

    #[account(
            init_if_needed,
            seeds = [MINT_ACCOUNT_SEED, nft_global_state.key().as_ref()],
            bump,
            payer = payer,
            mint::token_program = token_program,
            mint::decimals = 0,
            mint::authority = authority,
            extensions::metadata_pointer::authority = authority,
            extensions::metadata_pointer::metadata_address = mint,
            extensions::group_member_pointer::authority = authority,
            extensions::group_member_pointer::member_address = mint,
        )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
            init,
            payer = payer,
            associated_token::token_program = token_program,
            associated_token::mint = mint,
            associated_token::authority = payer,
        )]
    pub mint_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        // seeds = [RootState::SEED, global_state.key().as_ref(), &merkle_uuid],
        // seeds::program = GC_PROGRAM_ID(),
        // bump
    )]
    pub root_account: Account<'info, RootState>,
    #[account(mut, constraint = global_state.key().as_ref() == nft_global_state.gc_address.key().as_ref())]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub nft_global_state: Account<'info, NftGlobalState>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token2022>,
}

impl<'info> CreateMintAccount<'info> {
    fn initialize_token_metadata(
        &self,
        name: String,
        symbol: String,
        uri: String,
    ) -> ProgramResult {
        let cpi_accounts = TokenMetadataInitialize {
            token_program_id: self.token_program.to_account_info(),
            mint: self.mint.to_account_info(),
            metadata: self.mint.to_account_info(),
            mint_authority: self.authority.to_account_info(),
            update_authority: self.authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        token_metadata_initialize(cpi_ctx, name, symbol, uri)?;
        Ok(())
    }
}

pub fn handler(
    ctx: Context<CreateMintAccount>,
    user: Pubkey,
    amount: u16,
    name: String,
    symbol: String,
    uri: String,
    achievement_uuid: [u8; 16],
    merkle_uuid: [u8; 16],
    proofs: Vec<[u8; 32]>,
) -> Result<()> {
    let root_account = &mut ctx.accounts.root_account;

    let node = hashv(&[
        &user.to_bytes(),
        &amount.to_le_bytes(),
        &name.clone().into_bytes(),
        &symbol.clone().into_bytes(),
        &uri.clone().into_bytes(),
        &achievement_uuid,
        &merkle_uuid,
    ]);

    require!(
        verify(proofs, root_account.root, node.to_bytes()),
        GcError::InvalidProof
    );

    // ctx.accounts
    //     .initialize_token_metadata(name.clone(), symbol.clone(), uri.clone())?;

    ctx.accounts.mint.reload()?;

    let (_, vault_pda_bump_seed) = Pubkey::find_program_address(&[VAULT_PDA_SEED], &Nft::id());

    update_account_lamports_to_minimum_balance(
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.authority.to_account_info(),
            MintTo {
                authority: ctx.accounts.authority.to_account_info(),
                to: ctx.accounts.mint_token_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
            },
            &[&[VAULT_PDA_SEED, &[vault_pda_bump_seed]]],
        ),
        amount as u64,
    )?;

    Ok(())
}
