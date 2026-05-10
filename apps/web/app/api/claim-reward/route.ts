import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/server-supabase";

function generateMockTxHash() {
  return (
    "0x" +
    Math.random().toString(16).slice(2) +
    Math.random().toString(16).slice(2) +
    Math.random().toString(16).slice(2)
  ).slice(0, 66);
}

export async function POST(request: NextRequest) {
  try {
    const { rewardId } = await request.json();

    if (!rewardId) {
      return NextResponse.json(
        { success: false, error: "rewardId is required" },
        { status: 400 }
      );
    }

    const txHash = generateMockTxHash();

    const { error } = await serverSupabase
      .from("rewards")
      .update({
        claimed: true,
        tx_hash: txHash,
      })
      .eq("id", rewardId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      txHash,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}