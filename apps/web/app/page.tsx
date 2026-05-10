import Link from "next/link";
import { motion } from "framer-motion";
import RealtimeLeaderboard from "@/components/realtime-leaderboard";
import { supabase } from "@/lib/supabase";
import ConnectWalletButton from "@/components/connect-wallet-button";

export default async function Home() {
  const { data: contributors } = await supabase
    .from("contributors")
    .select("*")
    .order("total_score", { ascending: false });

  const totalRewards =
    contributors?.reduce(
      (sum, c) => sum + Number(c.total_rewards || 0),
      0
    ) || 0;

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        {/* HERO */}
        <section className="mb-24">
          <div className="max-w-5xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-400">
              AI-Powered Contributor Economy
            </div>

            <h1 className="max-w-5xl text-7xl font-black leading-[0.95] tracking-tight md:text-8xl">
              Reward the people who actually grow the community.
            </h1>

            <p className="mt-8 max-w-3xl text-2xl leading-relaxed text-gray-400">
              ProofOfContribution uses AI to recognize educators,
              moderators, and community builders — then redistributes
              creator-token rewards directly to them.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/admin"
                className="rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-emerald-400"
              >
                Open Demo Console
              </Link>

              <ConnectWalletButton />

              <a
                href="#leaderboard"
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold transition hover:bg-white/10"
              >
                View Leaderboard
              </a>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mb-20 grid gap-6 md:grid-cols-3">
          <StatCard
            label="Contributors Rewarded"
            value={`${contributors?.length || 0}+`}
          />

          <StatCard
            label="Rewards Distributed"
            value={`${totalRewards.toFixed(1)} SOL`}
          />

          <StatCard
            label="AI Events Processed"
            value="250+"
          />
        </section>

        {/* FEATURES */}
        <section className="mb-24">
          <h2 className="mb-10 text-5xl font-bold">
            Why This Matters
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <FeatureCard
              title="AI Contribution Scoring"
              description="Gemini analyzes educational impact, onboarding effectiveness, community retention, and culture health."
            />

            <FeatureCard
              title="Real-Time Reward Distribution"
              description="Contributors automatically earn rewards proportional to the value they create."
            />

            <FeatureCard
              title="Contributor Reputation"
              description="Community educators, moderators, and growth drivers earn persistent recognition."
            />

            <FeatureCard
              title="Creator Sustainability"
              description="Reduce burnout by rewarding the people who help creators grow communities."
            />
          </div>
        </section>

        {/* LEADERBOARD */}
        <section id="leaderboard">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-5xl font-bold">
                Contribution Board
              </h2>

              <p className="mt-3 text-xl text-gray-400">
                AI-ranked contributors earning rewards in real time.
              </p>
            </div>
          </div>

          <RealtimeLeaderboard
            initialContributors={contributors ?? []}
          />
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
      <p className="text-sm uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-3 text-5xl font-black">
        {value}
      </p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-emerald-500/30 hover:bg-white/10">
      <h3 className="text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-4 text-lg leading-relaxed text-gray-400">
        {description}
      </p>
    </div>
  );
}