import { PublicKey } from "@solana/web3.js";
import anchor, { Idl, Program } from "@coral-xyz/anchor";

export const findPDA = <TProgram extends Idl | unknown>(
  seeds: Array<string | Buffer | PublicKey | anchor.BN>,
  program: TProgram extends Idl ? Program<TProgram> : PublicKey
) => {
  const programId = (program as Program).programId || (program as PublicKey);

  return PublicKey.findProgramAddressSync(
    [
      ...seeds.map((v) =>
        Buffer.from((v as PublicKey)?.toBuffer?.() ?? (v as string | Buffer))
      ),
    ],
    programId
  );
};
