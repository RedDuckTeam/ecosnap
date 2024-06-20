import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";

import * as anchor from "@coral-xyz/anchor";
import { Nft } from "../target/types/nft";

module.exports = async function (provider: AnchorProvider) {
  console.log("test");
  anchor.setProvider(provider);
  console.log("test1");
  const program = anchor.workspace.Nft as Program<Nft>;

  const authority = new Keypair((provider.wallet as any).payer._keypair);

  const gcGlobalStatePda = new PublicKey(
    "9b6WPU1sD4XwiYFx3rHUf6WGRVTVEE9kF4Gfs9FmZDQL"
  );
  const globalStatePda = anchor.web3.Keypair.generate();

  const initProtocolTx = new Transaction().add(
    await program.methods
      .initializeGlobalState(gcGlobalStatePda)
      .accounts({
        authority: provider.wallet.publicKey,
        globalState: globalStatePda.publicKey,
        signer: authority.publicKey,
      })
      .signers([authority, globalStatePda])
      .instruction()
  );

  try {
    const sendedTx = await sendAndConfirmTransaction(
      provider.connection,
      initProtocolTx,
      [authority, globalStatePda]
    );
    console.log("Initialized, tx id:  ", sendedTx);

    console.log("Authority: ", authority.publicKey);
    console.log("Global state PDA ", globalStatePda.publicKey);
  } catch (e) {
    console.error("ERROR! 🔴");
    console.error(e);
  }
};
