"use client";

import { useState } from "react";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function runEpoch() {
    try {
      setLoading(true);
      setResult("🔍 Fetching contributor events...");

      await new Promise((r) => setTimeout(r, 700));

      setResult("🧠 Gemini is scoring contributions...");

      await new Promise((r) => setTimeout(r, 1200));

      setResult("💰 Calculating reward allocations...");

      await new Promise((r) => setTimeout(r, 800));

      setResult("⛓️ Writing reward records...");

      const response = await fetch("/api/run-epoch");
      const data = await response.json();

      if (data.success) {
        setResult("🎉 Epoch completed successfully. Leaderboard updated in real time.");
      } else {
        setResult(`❌ ${data.error || "Failed to run epoch."}`);
      }
    } catch (error) {
      setResult("❌ Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="mb-3 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-400">
          Demo Console
        </p>

        <h1 className="text-5xl font-bold">
          Epoch Control Center
        </h1>

        <p className="mt-4 max-w-2xl text-xl text-gray-400">
          Run AI scoring, reward distribution, and live leaderboard updates with a single click.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <button
            onClick={runEpoch}
            disabled={loading}
            className="rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? "Running AI Epoch..." : "Run AI Epoch"}
          </button>

          {result && (
            <div className="mt-6 rounded-2xl bg-black/30 p-4 text-gray-300">
              {result}
            </div>
          )}
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="mb-4 text-2xl font-bold">
            Demo Flow
          </h2>

          <ol className="space-y-3 text-gray-300">
            <li>1. AI analyzes community contributions</li>
            <li>2. Scores are generated across four dimensions</li>
            <li>3. Rewards are allocated proportionally</li>
            <li>4. Supabase updates in real time</li>
            <li>5. Contributors claim rewards</li>
          </ol>
        </div>
      </div>
    </main>
  );
}