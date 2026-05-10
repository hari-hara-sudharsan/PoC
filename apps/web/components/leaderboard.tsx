import { Contributor } from "@/lib/types";

interface Props {
  contributors: Contributor[];
}

export default function Leaderboard({ contributors }: Props) {
  return (
    <div className="grid gap-6">
      {contributors.map((contributor, index) => (
        <div
          key={contributor.id}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">#{index + 1}</p>
              <h2 className="text-2xl font-bold">{contributor.display_name}</h2>
              <p className="text-gray-400">
                {contributor.contributor_type}
              </p>
            </div>

            <div className="text-right">
              <p className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">
                {contributor.badge}
              </p>
              <p className="mt-3 text-3xl font-bold">
                {contributor.total_score}
              </p>
              <p className="text-sm text-gray-400">Contribution Score</p>
            </div>
          </div>

          <div className="mt-4 flex justify-between text-sm text-gray-400">
            <span>
              Rewards: {Number(contributor.total_rewards).toFixed(2)} SOL
            </span>
            <span>
              Burnout Risk: {contributor.burnout_risk}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}