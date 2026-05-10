import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

export interface Allocation {
  wallet: string;
  amount: number;
}

export function hashLeaf(wallet: string, amount: number) {
  return keccak256(`${wallet}:${amount.toFixed(6)}`);
}

export function buildMerkleTree(allocations: Allocation[]) {
  const leaves = allocations.map((a) =>
    hashLeaf(a.wallet, a.amount)
  );

  const tree = new MerkleTree(leaves, keccak256, {
    sortPairs: true,
  });

  return tree;
}

export function getMerkleRoot(
  allocations: Allocation[]
): string {
  const tree = buildMerkleTree(allocations);
  return tree.getHexRoot();
}

export function getProof(
  allocations: Allocation[],
  wallet: string,
  amount: number
): string[] {
  const tree = buildMerkleTree(allocations);
  const leaf = hashLeaf(wallet, amount);
  return tree.getHexProof(leaf);
}
