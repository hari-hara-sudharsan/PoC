import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { scoreContributor } from "@/lib/claude";
import { serverSupabase } from "@/lib/server-supabase";

export async function GET() {
  try {
    const { data: contributors, error } = await serverSupabase
      .from("contributors")
      .select("*");

    if (error || !contributors) {
      throw new Error("Failed to fetch contributors");
    }

    for (const contributor of contributors) {
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .eq("contributor_id", contributor.id);

      const eventTexts =
        events?.map((event) => event.content) ?? [];

      const result = await scoreContributor(
        contributor.display_name,
        eventTexts
      );

      await supabase
        .from("contributors")
        .update({
          total_score: result.final_score,
          badge: result.badge,
        })
        .eq("id", contributor.id);

      console.log(
        `Scored ${contributor.display_name}`,
        result
      );
    }

    return NextResponse.json({
      success: true,
      message: "Epoch completed",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to run epoch",
      },
      {
        status: 500,
      }
    );
  }
}