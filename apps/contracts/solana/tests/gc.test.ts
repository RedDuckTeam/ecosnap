import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, sendAndConfirmTransaction } from "@solana/web3.js";
import { Nft } from "../target/types/nft";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { assert, expect } from "chai";
import { randomUUID } from "node:crypto";
import { toBinaryUUID } from "../lib/utils/toBinaryUUID";
import { createMockVec } from "../lib/utils/mocVec";
import { Gc } from "../target/types/gc";
import * as borsh from "borsh";
import {
  getMerkleProof,
  getMerkleRoot,
  getMerkleTree,
} from "@metaplex-foundation/js";

import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  Account as SplAccount,
  createCloseAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import { BN } from "bn.js";

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
  const gcExternalUUIDBuffer = randomUUID();
  const gcExternalUUID = toBinaryUUID(gcExternalUUIDBuffer);
  const achievementUUIDBuffer = randomUUID();
  const achievementUUID = toBinaryUUID(randomUUID());
  console.log(achievementUUID);
  const gcRoot = createMockVec(1);
  const payer = Keypair.generate();

  const leafToEncoded = ({
    user,
    id,
    achievementId,
    amount,
  }: {
    achievementId: string;
    amount: number;
    id: number;
    user: string;
  }) => {
    return Buffer.from([
      ...new PublicKey(user).toBuffer(),
      // ...borsh.serialize("u64", amount),
      ...new BN(amount).toArray("le", 8),
      // ...borsh.serialize({ array: { type: "u8" } }, Buffer.from("name")),
      // borsh.serialize({ array: { type: "u8" } }, Buffer.from("symb")),
      // borsh.serialize({ array: { type: "u8" } }, Buffer.from("uri")),
      // ...borsh.serialize(
      //   { array: { type: "u8", len: 16 } },
      //   toBinaryUUID(achievementId)
      // ),
      // ...borsh.serialize(
      //   { array: { type: "u8", len: 16 } },
      //   toBinaryUUID(gcExternalUUIDBuffer)
      // ),
    ]);
  };

  const claimLeafs = [
    {
      achievementId: achievementUUIDBuffer,
      id: 0,
      user: payer.publicKey.toBase58(),
      amount: 1,
    },
  ];
  const encodedClaimLeaves = claimLeafs.map(leafToEncoded);
  const claimMerkleTree = getMerkleTree(encodedClaimLeaves);
  const proofs = getMerkleProof(encodedClaimLeaves, encodedClaimLeaves[0]);
  const root = getMerkleRoot(encodedClaimLeaves);

  const [mintAuthority] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("authority-seed")],
    nftProgram.programId
  );

  const [mint] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("mint-seed"),
      nftGlobalState.publicKey.toBuffer(),
      // new Uint8Array(achievementUUID),
    ],

    nftProgram.programId
  );

  const [gcRootState] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("root_state"),
      gcGlobalState.publicKey.toBuffer(),
      gcExternalUUID,
    ],
    gcProgram.programId
  );

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
        .newRoot(Array.from(gcExternalUUID), Array.from(root))
        .accountsStrict({
          authority: payer.publicKey,
          globalState: gcGlobalState.publicKey,
          rootState: gcRootState,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([payer])
        .rpc();
    } catch (e) {
      console.log(e.logs);
    }

    await nftProgram.methods
      .initializeGlobalState(gcGlobalState.publicKey)
      .accounts({
        signer: payer.publicKey,
        globalState: nftGlobalState.publicKey,
        authority: payer.publicKey,
      })
      .signers([payer, nftGlobalState])
      .rpc();

    const accountInfo = await provider.connection.getAccountInfo(gcRootState);
    console.log(gcRootState);
    if (!accountInfo) {
      throw new Error(`Account ${gcRootState.toBase58()} is not initialized`);
    }
  });

  it("Create mint account test passes", async () => {
    const user = anchor.web3.Keypair.generate();

    const [extraMetasAccount] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("extra-account-metas"), mint.toBuffer()],
      nftProgram.programId
    );

    console.log(
      await nftProgram.account.nftGlobalState.fetch(nftGlobalState.publicKey),
      gcGlobalState.publicKey,
      Array.from(new Uint8Array(achievementUUID))
    );

    const tx = await nftProgram.methods
      .createMintAccount(
        payer.publicKey,
        new BN(1),
        "name",
        "symb",
        "uri",
        Array.from(new Uint8Array(achievementUUID)),
        Array.from(new Uint8Array(gcExternalUUID)),
        proofs.map((v) => Array.from(v))
      )
      .accountsStrict({
        payer: payer.publicKey,
        authority: mintAuthority,
        mint,
        mintTokenAccount: associatedAddress({
          mint,
          owner: payer.publicKey,
        }),
        //extraMetasAccount: extraMetasAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        rootAccount: gcRootState,
        globalState: gcGlobalState.publicKey,
        nftGlobalState: nftGlobalState.publicKey,
      })
      .signers([payer])
      .transaction();

    await sendAndConfirmTransaction(provider.connection, tx, [payer]);

    const acc = await getAccount(
      provider.connection,
      associatedAddress({
        mint,
        owner: payer.publicKey,
      }),
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    console.log(acc);
  });

  // it("mint extension constraints test passes", async () => {
  //   try {
  //     const tx = await nftProgram.methods
  //       .checkMintExtensionsConstraints()
  //       .accountsStrict({
  //         authority: payer.publicKey,
  //         mint,
  //       })
  //       .signers([payer])
  //       .rpc();
  //     assert.ok(tx, "transaction should be processed without error");
  //   } catch (e) {
  //     assert.fail("should not throw error");
  //   }
  // });
  // it("mint extension constraints fails with invalid authority", async () => {
  //   const wrongAuth = Keypair.generate();
  //   try {
  //     const x = await nftProgram.methods
  //       .checkMintExtensionsConstraints()
  //       .accountsStrict({
  //         authority: wrongAuth.publicKey,
  //         mint,
  //       })
  //       .signers([payer, wrongAuth])
  //       .rpc();
  //     assert.fail("should have thrown an error");
  //   } catch (e) {
  //     expect(e, "should throw error");
  //   }
  // });
});
