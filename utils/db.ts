import { createClient } from '@supabase/supabase-js';
import { INITIAL_HEARTS } from '../constants';

// --- Types ---
export interface UserRecord {
  id: string;
  high_score: number;
  hearts: number;
  games_played: number;
}

export interface RankingEntry {
  name: string;
  score: number;
  isUser: boolean;
}

// --- Supabase Config ---
const SUPABASE_URL = 'https://nxpuaxxdjkupktlyrtje.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cHVheHhkamt1cGt0bHlydGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDE4MjAsImV4cCI6MjA4NTYxNzgyMH0.ojAH2ZcOeVrcFMCoN9C7zGcM3WvuexcjqnJtA23RauY';

// --- Local Storage Key ---
const LOCAL_DB_KEY = 'shisen_sho_local_data_v2';

// --- Helpers ---
const getDeviceId = (): string => {
  let id = localStorage.getItem('shisen_device_id');
  if (!id) {
    id = 'user-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('shisen_device_id', id);
  }
  return id;
};

// Mock data for local fallback
const MOCK_RANKERS = [
  { name: 'DOGGY', score: 25000 },
  { name: 'POODLE', score: 18000 },
  { name: 'HUSKY', score: 15000 },
  { name: 'PUG', score: 12000 },
  { name: 'SHIBA', score: 8000 },
];

class GameDB {
  private client;
  private userId: string;

  constructor() {
    this.userId = getDeviceId();
    // 유효한 키가 있을 때만 Supabase 클라이언트 생성
    if (SUPABASE_URL && SUPABASE_KEY && SUPABASE_KEY.length > 20) {
      this.client = createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
      console.log("Supabase Key not found. Running in Local Storage Mode.");
      this.client = null;
    }
  }

  // --- Local Storage Helpers ---
  private getLocalData() {
    const data = localStorage.getItem(LOCAL_DB_KEY);
    if (data) return JSON.parse(data);
    return {
      hearts: INITIAL_HEARTS,
      high_score: 0,
      games_played: 0
    };
  }

  private saveLocalData(data: any) {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(data));
  }

  // --- Public API ---

  async getUserStats(): Promise<{ hearts: number; highScore: number }> {
    // 1. Local Fallback
    if (!this.client) {
      const local = this.getLocalData();
      return { hearts: local.hearts, highScore: local.high_score };
    }

    // 2. Supabase
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', this.userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const { error: insertError } = await this.client
          .from('profiles')
          .insert([
            {
              id: this.userId,
              hearts: INITIAL_HEARTS,
              high_score: 0,
              username: `Player ${this.userId.slice(-4)}`
            }
          ]);
        if (insertError) throw insertError;
        return { hearts: INITIAL_HEARTS, highScore: 0 };
      } else if (data) {
        return { hearts: data.hearts, highScore: data.high_score };
      }
    } catch (e) {
      console.error("Supabase load failed, falling back to local:", e);
      // Error fallback
      const local = this.getLocalData();
      return { hearts: local.hearts, highScore: local.high_score };
    }

    return { hearts: INITIAL_HEARTS, highScore: 0 };
  }

  async saveHearts(hearts: number): Promise<void> {
    // 1. Local Fallback
    const local = this.getLocalData();
    local.hearts = hearts;
    this.saveLocalData(local);

    // 2. Supabase
    if (this.client) {
      try {
        await this.client
          .from('profiles')
          .update({ hearts, updated_at: new Date() })
          .eq('id', this.userId);
      } catch (e) {
        console.error("Failed to save hearts to server:", e);
      }
    }
  }

  async saveScore(currentScore: number): Promise<void> {
    // 1. Local Fallback
    const local = this.getLocalData();
    local.games_played += 1;
    if (currentScore > local.high_score) {
      local.high_score = currentScore;
    }
    this.saveLocalData(local);

    // 2. Supabase
    if (this.client) {
      try {
        // Optimistic update logic usually, but here we fetch-check-update for simplicity in logic
        const { data } = await this.client
          .from('profiles')
          .select('high_score, games_played')
          .eq('id', this.userId)
          .single();

        if (data) {
          const newHighScore = Math.max(data.high_score, currentScore);
          await this.client
            .from('profiles')
            .update({
              high_score: newHighScore,
              games_played: (data.games_played || 0) + 1,
              updated_at: new Date()
            })
            .eq('id', this.userId);
        }
      } catch (e) {
        console.error("Failed to save score to server:", e);
      }
    }
  }

  async getRankings(currentScore: number): Promise<RankingEntry[]> {
    // 1. Local Fallback (Mock Rankings)
    if (!this.client) {
      const local = this.getLocalData();
      const rankingPool = [
        ...MOCK_RANKERS.map(r => ({ ...r, isUser: false })),
      ];
      
      const userBest = Math.max(local.high_score, currentScore);
      rankingPool.push({ name: 'YOU', score: userBest, isUser: true });

      rankingPool.sort((a, b) => b.score - a.score);
      return rankingPool.slice(0, 5);
    }

    // 2. Supabase
    try {
      const { data: topPlayers } = await this.client
        .from('profiles')
        .select('id, username, high_score')
        .order('high_score', { ascending: false })
        .limit(10);

      let userFound = false;

      const rankingList: RankingEntry[] = (topPlayers || []).map((p: any) => {
        const isMe = p.id === this.userId;
        if (isMe) userFound = true;
        
        return {
          name: isMe ? 'YOU' : (p.username || 'Anonymous'),
          score: p.high_score,
          isUser: isMe
        };
      });

      // If user is not in top 10, add them (using currentScore as best effort proxy if local high_score logic isn't perfectly synced or just to show 'YOU' context)
      // Note: We already called saveScore, so if we are in top 10, we are found. 
      // If we are NOT in top 10, we simply append YOU at the end (or sorted position)
      if (!userFound) {
        rankingList.push({
          name: 'YOU',
          score: currentScore,
          isUser: true
        });
      }

      rankingList.sort((a, b) => b.score - a.score);
      
      return rankingList.slice(0, 5);

    } catch (e) {
      console.error("Failed to get rankings from server:", e);
      return [];
    }
  }
}

export const db = new GameDB();
