import Link from "next/link";
import { notFound } from "next/navigation";
import { serverSupabase } from "@/lib/server-supabase";
import { ClaimRewardForm } from "@/components/claim-reward-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function format(value: number | string | null | undefined) {
  return Number(value ?? 0).toFixed(1);
}

export default async function ContributorPage({
  params,
}: PageProps) {
  const { id } = await params;

  // Fetch contributor
  const { data: contributor } = await serverSupabase
    .from("contributors")
    .select("*")
    .eq("id", id)
    .single();

  if (!contributor) {
    notFound();
  }

  // Fetch latest score
  const { data: score } = await serverSupabase
    .from("scores")
    .select("*")
    .eq("contributor_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: reward } = await serverSupabase
    .from("rewards")
    .select("*")
    .eq("contributor_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-emerald-400 hover:underline"
        >
          ← Back to Leaderboard
        </Link>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="mb-3 inline-block rounded-full bg-emerald-500/20 px-4 py-1 text-sm text-emerald-400">
            {contributor.badge}
          </p>

          <h1 className="text-5xl font-bold">
            {contributor.display_name}
          </h1>

          <p className="mt-2 text-xl text-gray-400">
            {contributor.contributor_type}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Contribution Score"
              value={format(contributor.total_score)}
            />
            <MetricCard
              label="Rewards Earned"
              value={`${format(
                contributor.total_rewards
              )} SOL`}
            />
            <MetricCard
              label="Burnout Risk"
              value={`${format(
                contributor.burnout_risk
              )}%`}
            />
          </div>
        </div>

        {reward && (
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="mb-4 text-3xl font-bold">
              Reward Claim
            </h2>

            <p className="text-gray-400">
              Pending Reward:{" "}
              <span className="font-semibold text-emerald-400">
                {Number(reward.reward_amount).toFixed(2)} SOL
              </span>
            </p>

            <p className="mt-2 text-gray-400">
              Status:{" "}
              <span
                className={
                  reward.claimed
                    ? "text-emerald-400"
                    : "text-yellow-400"
                }
              >
                {reward.claimed ? "Claimed" : "Pending"}
              </span>
            </p>

            {reward.tx_hash && (
              <p className="mt-2 break-all text-sm text-gray-500">
                Tx Hash: {reward.tx_hash}
              </p>
            )}

            {!reward.claimed && (
              <ClaimRewardForm rewardId={reward.id} />
            )}
          </div>
        )}

        {score && (
          <>
            <h2 className="mb-4 text-3xl font-bold">
              AI Score Breakdown
            </h2>

            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <MetricCard
                label="Education Quality"
                value={format(score.education_score)}
              />
              <MetricCard
                label="Growth Impact"
                value={format(score.growth_score)}
              />
              <MetricCard
                label="Retention Signal"
                value={format(score.retention_score)}
              />
              <MetricCard
                label="Culture Health"
                value={format(score.culture_score)}
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <h3 className="mb-4 text-2xl font-bold">
                AI Reasoning
              </h3>
              <p className="leading-8 text-gray-300">
                {score.reasoning}
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-black/30 p-6">
      <p className="text-sm uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}