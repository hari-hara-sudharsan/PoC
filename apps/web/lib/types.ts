export interface Contributor {
  id: string;
  wallet_address: string;
  display_name: string;
  contributor_type: string;
  badge: string;
  total_score: number;
  total_rewards: number;
  burnout_risk: number;
  created_at: string;
}