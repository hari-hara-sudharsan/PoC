import { NextResponse } from "next/server";
import {
  getMerkleRoot,
  getProof,
} from "@/lib/merkle";

export async function GET() {
  const allocations = [
    {
      wallet:
        "SoLxAlice111111111111111111111111111",
      amount: 4.25,
    },
    {
      wallet:
        "SoLxBob222222222222222222222222222",
      amount: 3.10,
    },
    {
      wallet:
        "SoLxCharlie333333333333333333333333",
      amount: 3.95,
    },
  ];

  const root = getMerkleRoot(allocations);

  const proof = getProof(
    allocations,
    allocations[0].wallet,
    allocations[0].amount
  );

  return NextResponse.json({
    root,
    proof,
  });
}