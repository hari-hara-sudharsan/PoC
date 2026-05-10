import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";
import idl from "./reward_distributor.json";

export function getProgram(provider: AnchorProvider) {
  return new Program(idl as Idl, provider);
}

export function getConnection() {
  return new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
}