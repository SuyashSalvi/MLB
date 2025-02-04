import { PlayerHit, ProcessedPlayerStats } from './types';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

const sampleData = `play_id,ExitVelocity,HitDistance,LaunchAngle,Year,PlayerName
1,105.2,425,32,2023,Mike Trout
2,98.7,389,25,2023,Mike Trout
3,110.5,450,28,2023,Mike Trout
4,92.3,350,18,2023,Mike Trout
5,107.8,432,30,2023,Shohei Ohtani
6,112.4,465,35,2023,Shohei Ohtani
7,103.9,410,27,2023,Shohei Ohtani
8,95.6,375,22,2023,Shohei Ohtani
9,108.3,445,31,2022,Mike Trout
10,99.5,392,26,2022,Mike Trout
11,106.7,428,29,2022,Mike Trout
12,93.8,365,20,2022,Mike Trout
13,109.1,455,33,2022,Shohei Ohtani
14,111.8,460,34,2022,Shohei Ohtani
15,102.4,405,28,2022,Shohei Ohtani
16,97.2,382,24,2022,Shohei Ohtani`;

const CSV_FILE_PATH = path.join(process.cwd(), "public", "player_stats.csv"); // Ensure file is in `public/`

export async function loadPlayerData(): Promise<ProcessedPlayerStats[]> {
  try {

    // Fetch the CSV file
    // Read the CSV file synchronously
    const fileContent = fs.readFileSync(CSV_FILE_PATH, "utf8");
    

    // Parse the CSV data directly from the string
    const records: PlayerHit[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      cast: true
    });

    // Group by player name
    const playerGroups = records.reduce((acc, hit) => {
      if (!acc[hit.PlayerName]) {
        acc[hit.PlayerName] = [];
      }
      acc[hit.PlayerName].push(hit);
      return acc;
    }, {} as Record<string, PlayerHit[]>);

    // Process each player's data
    return Object.entries(playerGroups).map(([name, hits], index) => {
      const years = [...new Set(hits.map(hit => hit.Year))].sort();
      const currentYear = Math.max(...years);
      
      // Calculate stats per year
      const yearlyStats = years.map(year => {
        const yearHits = hits.filter(hit => hit.Year === year);
        
        // Calculate batting average based on exit velocity
        const qualityHits = yearHits.filter(hit => hit.ExitVelocity > 95);
        const avg = yearHits.length > 0 ? qualityHits.length / yearHits.length : 0;
        
        // Calculate home runs based on launch angle, exit velocity, and distance
        const homeRuns = yearHits.filter(hit => 
          hit.LaunchAngle > 25 && 
          hit.ExitVelocity > 95 && 
          hit.HitDistance > 400
        ).length;
        
        // Calculate RBIs (estimated based on hits and home runs)
        const rbi = Math.round(homeRuns * 2.5 + qualityHits.length * 0.5);
        
        return {
          year,
          avg,
          hr: homeRuns,
          rbi
        };
      });

      // Split into historical and predicted data
      const historicalData = yearlyStats.filter(stat => stat.year <= currentYear);
      const predictedData = [];

      // Generate predictions for the next 3 years
      const lastStats = historicalData[historicalData.length - 1];
      for (let i = 1; i <= 3; i++) {
        const predictedYear = currentYear + i;
        predictedData.push({
          year: predictedYear,
          avg: lastStats.avg * (1 + (Math.random() * 0.1 - 0.05)), // ±5% variation
          hr: Math.round(lastStats.hr * (1 + (Math.random() * 0.2 - 0.1))), // ±10% variation
          rbi: Math.round(lastStats.rbi * (1 + (Math.random() * 0.2 - 0.1))) // ±10% variation
        });
      }

      // Get current year stats
      const currentStats = yearlyStats.find(stat => stat.year === currentYear) || yearlyStats[0];

      const playerImages = {
        'Mike Trout': 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100&h=100',
        'Shohei Ohtani': 'https://images.unsplash.com/photo-1629285483773-6b5cde2171d1?auto=format&fit=crop&q=80&w=100&h=100'
      };

      const playerTeams = {
        'Mike Trout': 'Los Angeles Angels',
        'Shohei Ohtani': 'Los Angeles Dodgers'
      };

      const playerPositions = {
        'Mike Trout': 'CF',
        'Shohei Ohtani': 'DH/SP'
      };

      return {
        id: index + 1,
        name,
        team: playerTeams[name] || 'MLB Team',
        position: playerPositions[name] || 'Player',
        image: playerImages[name] || `https://images.unsplash.com/photo-${index + 1}?auto=format&fit=crop&q=80&w=100&h=100`,
        bio: name === 'Mike Trout' 
          ? 'Mike Trout is widely regarded as one of the greatest baseball players of all time. His combination of power, speed, and defensive prowess has earned him numerous accolades.'
          : name === 'Shohei Ohtani'
          ? 'Shohei Ohtani is a unique talent in MLB history, excelling both as a pitcher and hitter. His two-way ability has drawn comparisons to Babe Ruth.'
          : `Professional baseball player with exceptional hitting capabilities.`,
        currentStats: {
          avg: currentStats.avg.toFixed(3),
          hr: currentStats.hr,
          rbi: currentStats.rbi,
          ops: (currentStats.avg + 0.5).toFixed(3) // Simplified OPS calculation
        },
        historicalData,
        predictedData
      };
    });
  } catch (error) {
    console.error('Error processing player data:', error);
    throw error;
  }
}