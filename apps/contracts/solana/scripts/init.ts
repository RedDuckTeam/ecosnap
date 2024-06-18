import { program } from "../lib/common/constants";
import {
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";

const anchor = require("@coral-xyz/anchor");

async function deploy() {
  const provider = AnchorProvider.env();

  anchor.setProvider(provider);

  const authority = new Keypair((provider.wallet as any).payer._keypair);

  const globalStatePda = anchor.web3.Keypair.generate();

  const initProtocolTx = new Transaction().add(
    await program.methods
      .initializeGlobalState(authority.publicKey)
      .accounts({
        signer: authority.publicKey,
        globalState: globalStatePda.publicKey,
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
    console.error("🔴🔴🔴🔴🔴 ERROR! 🔴🔴🔴🔴🔴");
    console.error(e);
  }
}

deploy();
