import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/server-supabase";
import { scoreContributor } from "@/lib/claude";

export async function GET() {
  try {
    // Get contributors
    const { data: contributors, error } = await serverSupabase
      .from("contributors")
      .select("*");

    if (error || !contributors) {
      throw new Error("Failed to fetch contributors");
    }

    // Get or create epoch #1
    let { data: epoch } = await serverSupabase
      .from("epochs")
      .select("*")
      .eq("epoch_number", 1)
      .single();

    if (!epoch) {
      const { data: createdEpoch, error: epochError } =
        await serverSupabase
          .from("epochs")
          .insert({
            epoch_number: 1,
            total_reward_pool: 25,
            status: "completed",
          })
          .select()
          .single();

      if (epochError || !createdEpoch) {
        throw new Error("Failed to create epoch");
      }

      epoch = createdEpoch;
    }

    for (const contributor of contributors) {
      // Fetch contributor events
      const { data: events } = await serverSupabase
        .from("events")
        .select("*")
        .eq("contributor_id", contributor.id);

      const eventTexts =
        events?.map((event) => event.content) ?? [];

      // Skip contributors with no events
      if (eventTexts.length === 0) {
        continue;
      }

      // AI scoring
      const result = await scoreContributor(
        contributor.display_name,
        eventTexts
      );

      // Update contributor summary
      await serverSupabase
        .from("contributors")
        .update({
          total_score: result.final_score,
          badge: result.badge,
        })
        .eq("id", contributor.id);

      // Remove previous score for this epoch
      await serverSupabase
        .from("scores")
        .delete()
        .eq("contributor_id", contributor.id)
        .eq("epoch_id", epoch.id);

      // Insert detailed score record
      await serverSupabase
        .from("scores")
        .insert({
          contributor_id: contributor.id,
          epoch_id: epoch.id,
          education_score: result.education_score,
          growth_score: result.growth_score,
          retention_score: result.retention_score,
          culture_score: result.culture_score,
          final_score: result.final_score,
          reasoning: result.reasoning,
          suspicious: false,
        });

      console.log(
        `Scored ${contributor.display_name}: ${result.final_score}`
      );
    }

    return NextResponse.json({
      success: true,
      message: "Epoch completed and scores persisted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Unknown error",
      },
      { status: 500 }
    );
  }
}