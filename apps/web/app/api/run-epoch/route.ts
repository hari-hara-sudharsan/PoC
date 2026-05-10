import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/server-supabase";
import { scoreContributor } from "@/lib/claude";

export async function GET() {
  try {
    // Fetch contributors
    const { data: contributors, error } =
      await serverSupabase
        .from("contributors")
        .select("*");

    if (error || !contributors) {
      throw new Error("Failed to fetch contributors");
    }

    // Fetch or create epoch
    let { data: epoch } = await serverSupabase
      .from("epochs")
      .select("*")
      .eq("epoch_number", 1)
      .single();

    if (!epoch) {
      const { data: createdEpoch } =
        await serverSupabase
          .from("epochs")
          .insert({
            epoch_number: 1,
            total_reward_pool: 25,
            status: "completed",
          })
          .select()
          .single();

      epoch = createdEpoch;
    }

    if (!epoch) {
      throw new Error("Failed to create epoch");
    }

    // Store AI results temporarily
    const scoredContributors: any[] = [];

    // AI score contributors
    for (const contributor of contributors) {
      const { data: events } = await serverSupabase
        .from("events")
        .select("*")
        .eq("contributor_id", contributor.id);

      const eventTexts =
        events?.map((event) => event.content) ?? [];

      if (eventTexts.length === 0) {
        continue;
      }

      const result = await scoreContributor(
        contributor.display_name,
        eventTexts
      );

      scoredContributors.push({
        contributor,
        result,
      });
    }

    // Calculate total score sum
    const totalScoreSum =
      scoredContributors.reduce(
        (sum, item) =>
          sum + Number(item.result.final_score),
        0
      );

    // Distribute rewards
    for (const item of scoredContributors) {
      const { contributor, result } = item;

      const rewardAmount =
        (Number(result.final_score) /
          totalScoreSum) *
        Number(epoch.total_reward_pool);

      // Update contributor summary
      await serverSupabase
        .from("contributors")
        .update({
          total_score: result.final_score,
          badge: result.badge,
          total_rewards: rewardAmount,
        })
        .eq("id", contributor.id);

      // Remove old score
      await serverSupabase
        .from("scores")
        .delete()
        .eq("contributor_id", contributor.id)
        .eq("epoch_id", epoch.id);

      // Insert detailed score
      await serverSupabase
        .from("scores")
        .insert({
          contributor_id: contributor.id,
          epoch_id: epoch.id,
          education_score:
            result.education_score,
          growth_score:
            result.growth_score,
          retention_score:
            result.retention_score,
          culture_score:
            result.culture_score,
          final_score:
            result.final_score,
          reasoning:
            result.reasoning,
          suspicious: false,
        });

      // Remove previous reward
      await serverSupabase
        .from("rewards")
        .delete()
        .eq("contributor_id", contributor.id)
        .eq("epoch_id", epoch.id);

      // Insert reward
      await serverSupabase
        .from("rewards")
        .insert({
          contributor_id: contributor.id,
          epoch_id: epoch.id,
          reward_amount: rewardAmount,
          claimed: false,
        });

      console.log(
        `${contributor.display_name} earned ${rewardAmount.toFixed(
          2
        )} SOL`
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Epoch completed with reward distribution",
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
      {
        status: 500,
      }
    );
  }
}