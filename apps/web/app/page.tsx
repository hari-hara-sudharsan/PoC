import RealtimeLeaderboard from "@/components/realtime-leaderboard";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: contributors, error } = await supabase
    .from("contributors")
    .select("*")
    .order("total_score", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <h1 className="text-4xl font-bold text-red-500">
          Failed to load contributors
        </h1>
        <p className="mt-4 text-gray-400">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <p className="mb-3 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-400">
            AI-Powered Contributor Economy
          </p>

          <h1 className="text-6xl font-extrabold tracking-tight md:text-7xl">
            ProofOfContribution
          </h1>

          <p className="mt-4 max-w-3xl text-xl leading-relaxed text-gray-400">
            Reward the people who actually grow the community.
          </p>
        </div>

        <RealtimeLeaderboard
          initialContributors={contributors ?? []}
        />
      </div>
    </main>
  );
}