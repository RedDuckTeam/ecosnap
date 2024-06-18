import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import { Nft } from "../target/types/nft";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { assert, expect } from "chai";
import { randomUUID } from "node:crypto";
import { toBinaryUUID } from "../lib/utils/toBinaryUUID";
import { createMockVec } from "../lib/utils/mocVec";
import { Gc } from "../target/types/gc";

const TOKEN_2022_PROGRAM_ID = new anchor.web3.PublicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);

export function associatedAddress({
  mint,
  owner,
}: {
  mint: PublicKey;
  owner: PublicKey;
}): PublicKey {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_PROGRAM_ID
  )[0];
}

describe("token extensions", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const nftProgram = anchor.workspace.Nft as Program<Nft>;
  const nftGlobalState = anchor.web3.Keypair.generate();

  const gcProgram = anchor.workspace.Gc as Program<Gc>;
  const gcGlobalState = anchor.web3.Keypair.generate();
  const gcExternalUUID = toBinaryUUID(randomUUID());
  const achievementUUID = toBinaryUUID(randomUUID());
  const gcRoot = createMockVec(1);

  const [mintAuthority] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("authority-seed")],
    nftProgram.programId
  );

  const [mint] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("mint-seed"), achievementUUID],
    nftProgram.programId
  );

  const [gcRootState] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("root_state"),
      gcGlobalState.publicKey.toBuffer(),
      gcExternalUUID,
    ],
    gcProgram.programId
  );

  const payer = Keypair.generate();

  it("airdrop payer", async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, 10000000000),
      "confirmed"
    );
  });

  it("Init states", async () => {
    await gcProgram.methods
      .initializeGlobalState(payer.publicKey)
      .accounts({
        signer: payer.publicKey,
        globalState: gcGlobalState.publicKey,
      })
      .signers([payer, gcGlobalState])
      .rpc();

    try {
      await gcProgram.methods
        .newRoot(Array.from(gcExternalUUID), Array.from(new Uint8Array(32)))
        .accounts({
          authority: payer.publicKey,
          globalState: gcGlobalState.publicKey,
        })
        .signers([payer])
        .rpc();
    } catch (e) {
      console.log(e.logs);
    }

    await nftProgram.methods
      .initializeGlobalState(gcRootState)
      .accounts({
        signer: payer.publicKey,
        globalState: nftGlobalState.publicKey,
      })
      .signers([payer, nftGlobalState])
      .rpc();
  });

  it("Create mint account test passes", async () => {
    const user = anchor.web3.Keypair.generate();

    const [extraMetasAccount] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("extra-account-metas"), mint.toBuffer()],
      nftProgram.programId
    );

    await nftProgram.methods
      .createMintAccount(
        user.publicKey,
        10000,
        "quick token",
        "QT",
        "https://my-token-data.com/metadata.json",
        Array.from(achievementUUID),
        Array.from(gcExternalUUID),
        createMockVec(1)
      )
      .accountsStrict({
        payer: payer.publicKey,
        authority: mintAuthority,
        receiver: payer.publicKey,
        mint,
        mintTokenAccount: associatedAddress({
          mint,
          owner: payer.publicKey,
        }),
        extraMetasAccount: extraMetasAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        rootAccount: gcRootState,
        globalState: gcGlobalState.publicKey,
      })
      .signers([payer])
      .rpc();
  });

  it("mint extension constraints test passes", async () => {
    try {
      const tx = await nftProgram.methods
        .checkMintExtensionsConstraints()
        .accountsStrict({
          authority: payer.publicKey,
          mint,
        })
        .signers([payer])
        .rpc();
      assert.ok(tx, "transaction should be processed without error");
    } catch (e) {
      assert.fail("should not throw error");
    }
  });
  it("mint extension constraints fails with invalid authority", async () => {
    const wrongAuth = Keypair.generate();
    try {
      const x = await nftProgram.methods
        .checkMintExtensionsConstraints()
        .accountsStrict({
          authority: wrongAuth.publicKey,
          mint,
        })
        .signers([payer, wrongAuth])
        .rpc();
      assert.fail("should have thrown an error");
    } catch (e) {
      expect(e, "should throw error");
    }
  });
});
