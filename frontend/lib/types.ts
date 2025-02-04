export interface PlayerHit {
  play_id: string;
  ExitVelocity: number;
  HitDistance: number;
  LaunchAngle: number;
  Year: number;
  PlayerName: string;
}

export interface ProcessedPlayerStats {
  id: number;
  name: string;
  team: string;
  position: string;
  image: string;
  bio: string;
  currentStats: {
    avg: string;
    hr: number;
    rbi: number;
    ops: string;
  };
  historicalData: Array<{
    year: number;
    avg: number;
    hr: number;
    rbi: number;
  }>;
  predictedData: Array<{
    year: number;
    avg: number;
    hr: number;
    rbi: number;
  }>;
}