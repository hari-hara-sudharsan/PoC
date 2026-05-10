"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Leaderboard from "@/components/leaderboard";
import { Contributor } from "@/lib/types";

interface Props {
  initialContributors: Contributor[];
}

export default function RealtimeLeaderboard({
  initialContributors,
}: Props) {
  const [contributors, setContributors] =
    useState<Contributor[]>(initialContributors);

  async function fetchContributors() {
    const { data, error } = await supabase
      .from("contributors")
      .select("*")
      .order("total_score", { ascending: false });

    if (!error && data) {
      setContributors(data as Contributor[]);
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel("contributors-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contributors",
        },
        () => {
          fetchContributors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return <Leaderboard contributors={contributors} />;
}