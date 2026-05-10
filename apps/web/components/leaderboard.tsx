import Link from "next/link";

interface Contributor {
  id: string;
  display_name: string;
  contributor_type: string;
  badge: string;
  total_score: number | string;
  total_rewards: number | string;
  burnout_risk: number | string;
}

interface Props {
  contributors: Contributor[];
}

function formatNumber(value: number | string | null | undefined) {
  return Number(value ?? 0).toFixed(1);
}

function getRankEmoji(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return "⭐";
}

export default function Leaderboard({ contributors }: Props) {
  if (!contributors || contributors.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
        <h2 className="text-3xl font-bold text-white">
          No Contributors Found
        </h2>
        <p className="mt-3 text-gray-400">
          Check your Supabase connection and seeded data.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {contributors.map((contributor, index) => (
        <Link
          key={contributor.id}
          href={`/contributors/${contributor.id}`}
          className="block"
        >
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 p-6 shadow-2xl backdrop-blur transition hover:scale-[1.01]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  {getRankEmoji(index)} Rank #{index + 1}
                </p>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {contributor.display_name}
                </h2>

                <p className="mt-1 text-gray-400">
                  {contributor.contributor_type}
                </p>
              </div>

              <div className="text-left md:text-right">
                <span className="inline-block rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-medium text-emerald-400">
                  {contributor.badge}
                </span>

                <p className="mt-3 text-5xl font-bold text-white">
                  {formatNumber(contributor.total_score)}
                </p>

                <p className="text-sm text-gray-400">
                  Contribution Score
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Rewards Earned
                </p>
                <p className="mt-1 text-2xl font-semibold text-emerald-400">
                  {formatNumber(contributor.total_rewards)} SOL
                </p>
              </div>

              <div className="rounded-2xl bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Burnout Risk
                </p>
                <p className="mt-1 text-2xl font-semibold text-orange-400">
                  {formatNumber(contributor.burnout_risk)}%
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}