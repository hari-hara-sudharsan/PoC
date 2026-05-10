import Leaderboard from "@/components/leaderboard";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: contributors, error } = await supabase
    .from("contributors")
    .select("*")
    .order("total_score", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <h1 className="text-3xl font-bold text-red-500">
          Failed to load contributors
        </h1>
        <p className="mt-4 text-gray-400">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-6xl font-bold">
          ProofOfContribution
        </h1>

        <p className="mb-10 max-w-3xl text-xl text-gray-400">
          Reward the people who actually grow the community.
        </p>

        <Leaderboard contributors={contributors ?? []} />
      </div>
    </main>
  );
}