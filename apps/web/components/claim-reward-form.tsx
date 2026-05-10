"use client";

export function ClaimRewardForm({ rewardId }: { rewardId: string }) {
  return (
    <form
      action={`/api/claim-reward`}
      method="post"
      className="mt-6"
      onSubmit={(e) => {
        e.preventDefault();
        fetch("/api/claim-reward", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rewardId,
          }),
        }).then(() => {
          window.location.reload();
        });
      }}
    >
      <button
        type="submit"
        className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400"
      >
        Claim Rewards
      </button>
    </form>
  );
}
