"use client";

import { AnchorProvider } from "@coral-xyz/anchor";
import { getProgram } from "./program";

export async function commitEpochRoot(
  provider: AnchorProvider,
  epochNumber: number,
  merkleRoot: Uint8Array,
  statePublicKey: any
) {
  const program = getProgram(provider);

  const signature = await program.methods
    .commitEpochRoot(
      epochNumber,
      Array.from(merkleRoot)
    )
    .accounts({
      state: statePublicKey,
      authority: provider.wallet.publicKey,
    })
    .rpc();

  return signature;
}