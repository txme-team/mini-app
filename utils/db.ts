
import { createClient } from '@supabase/supabase-js';

// --- Types ---
export interface UserRecord {
  id: string;
  high_score: number;
  games_played: number;
}

export interface RankingEntry {
  rank: number;
  name: string;
  score: number;
  isUser: boolean;
}

// --- Supabase Config ---
const RAW_SUPABASE_URL = 
  // @ts-ignore
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || 
  // @ts-ignore
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SUPABASE_URL) || 
  '';

const RAW_SUPABASE_KEY = 
  // @ts-ignore
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || 
  // @ts-ignore
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SUPABASE_ANON_KEY) || 
  '';

const SUPABASE_URL = RAW_SUPABASE_URL.replace(/['"]/g, '').trim();
const SUPABASE_KEY = RAW_SUPABASE_KEY.replace(/['"]/g, '').trim();

// --- Local Storage Key ---
const LOCAL_DB_KEY = 'shisen_sho_local_data_v3';

// --- Helpers ---
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getDeviceId = (): string => {
  let id = localStorage.getItem('shisen_device_id');
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!id || !uuidRegex.test(id)) {
    id = generateUUID();
    localStorage.setItem('shisen_device_id', id);
  }
  return id;
};

// Mock data
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
    
    const hasUrl = !!SUPABASE_URL && SUPABASE_URL.length > 0;
    const hasKey = !!SUPABASE_KEY && SUPABASE_KEY.length > 20;

    if (hasUrl && hasKey) {
      console.log("Supabase Client Connecting to 'ddp' Schema..."); 
      this.client = createClient(SUPABASE_URL, SUPABASE_KEY, {
        db: { schema: 'ddp' },
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
      });
    } else {
      console.warn("Supabase Config Missing. Running in Offline Mode.");
      this.client = null;
    }
  }

  public isConnected(): boolean {
    return !!this.client;
  }

  // --- Local Storage Helpers ---
  private getLocalData() {
    const data = localStorage.getItem(LOCAL_DB_KEY);
    if (data) return JSON.parse(data);
    return {
      high_score: 0,
      games_played: 0,
      username: ''
    };
  }

  private saveLocalData(data: any) {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(data));
  }

  // --- Public API ---

  // Fetches full user stats - Offline First Strategy
  async getUserProfile(): Promise<{ id: string; nickname: string; highScore: number }> {
    const local = this.getLocalData();

    // 1. If no client, return local immediately
    if (!this.client) {
      return { 
        id: this.userId, 
        nickname: local.username || '', 
        highScore: local.high_score 
      };
    }

    // 2. Try Supabase Sync
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('id, username, high_score')
        .eq('id', this.userId)
        .maybeSingle();

      if (error) throw error;
      
      // If user exists on server, use that data and update local
      if (data) {
          // Sync server data to local
          const merged = { ...local, username: data.username || local.username, high_score: Math.max(local.high_score, data.high_score || 0) };
          this.saveLocalData(merged);
          
          return { 
            id: this.userId, 
            nickname: data.username || '', 
            highScore: data.high_score || 0
          };
      }
      
      // If not found on server, try to create it (Upsert)
      // If this fails due to RLS, we catch it below and just return local
      const { error: upsertError } = await this.client
        .from('profiles')
        .upsert({
            id: this.userId,
            high_score: local.high_score,
            games_played: local.games_played,
            username: local.username || '',
            updated_at: new Date().toISOString()
        });

      if (upsertError) {
          console.warn("Server init failed (RLS blocking?), using local:", upsertError.message);
      }

      // Return local data regardless of server success/fail
      return { 
        id: this.userId, 
        nickname: local.username || '', 
        highScore: local.high_score 
      };

    } catch (e) {
      console.warn("Supabase unavailable, using local profile:", e);
      return { id: this.userId, nickname: local.username || '', highScore: local.high_score };
    }
  }

  // Update Nickname - Fire and Forget for Server
  async updateProfile(nickname: string): Promise<void> {
    // 1. Update Local immediately (UI reflects this)
    const local = this.getLocalData();
    local.username = nickname;
    this.saveLocalData(local);

    // 2. Try Background Sync
    if (this.client) {
      try {
        const { error } = await this.client
          .from('profiles')
          .upsert({ 
            id: this.userId, 
            username: nickname, 
            high_score: local.high_score || 0,
            games_played: local.games_played || 0,
            updated_at: new Date().toISOString() 
          });

        if (error) {
             console.warn("Background Sync Failed (Check RLS):", error.message);
             // No alert() - don't disturb the player
        }
      } catch (e) {
        console.warn("Background Sync Error:", e);
      }
    }
  }

  // Save Score - Fire and Forget for Server
  async saveScore(currentScore: number): Promise<void> {
    const local = this.getLocalData();
    local.games_played += 1;
    if (currentScore > local.high_score) {
      local.high_score = currentScore;
    }
    this.saveLocalData(local);

    if (this.client) {
      try {
        // Fetch current server data to compare (Optimistic)
        const { data: existing } = await this.client
          .from('profiles')
          .select('high_score, games_played')
          .eq('id', this.userId)
          .maybeSingle();

        const oldScore = existing?.high_score || 0;
        const oldGames = existing?.games_played || 0;
        const newHighScore = Math.max(oldScore, currentScore);

        const { error } = await this.client
            .from('profiles')
            .upsert({
              id: this.userId,
              high_score: newHighScore,
              games_played: oldGames + 1,
              username: local.username || '', 
              updated_at: new Date().toISOString()
            });

        if (error) console.warn("Score Sync Failed:", error.message);
      } catch (e) {
        console.warn("Score Sync Error:", e);
      }
    }
  }

  // Get Rankings - Fallback to Local/Mock if server fails
  async getRankings(currentScore: number): Promise<RankingEntry[]> {
    // Helper to format result
    const formatResult = (list: any[], userRank: number, userScore: number) => {
        // ... logic shared with server response
        return list; 
    };

    if (!this.client) {
      return this.getMockRankings(currentScore);
    }

    try {
      const { data: topPlayers, error } = await this.client
        .from('profiles')
        .select('id, username, high_score')
        .order('high_score', { ascending: false })
        .limit(3);

      if (error) throw error;

      const rankingList: RankingEntry[] = [];
      
      (topPlayers || []).forEach((p: any, index: number) => {
        rankingList.push({
          rank: index + 1,
          name: p.id === this.userId ? 'YOU (Best)' : (p.username || 'Anonymous'),
          score: p.high_score,
          isUser: false
        });
      });

      const { count } = await this.client
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('high_score', currentScore);
      
      const myRank = (count || 0) + 1;

      const myEntry: RankingEntry = {
          rank: myRank,
          name: 'YOU',
          score: currentScore,
          isUser: true
      };
      
      const filteredTop3 = rankingList.filter(r => r.name !== 'YOU (Best)');
      let finalList = [...filteredTop3];
      finalList.push(myEntry);
      finalList.sort((a, b) => a.rank - b.rank);
      return finalList;

    } catch (e) {
      console.warn("Ranking Load Failed, using Mock:", e);
      return this.getMockRankings(currentScore);
    }
  }

  private getMockRankings(currentScore: number): RankingEntry[] {
      const all = [...MOCK_RANKERS, { name: 'YOU', score: currentScore }];
      all.sort((a, b) => b.score - a.score);
      return all.slice(0, 5).map((r, i) => ({
        rank: i + 1,
        name: r.name,
        score: r.score,
        isUser: r.name === 'YOU'
      }));
  }
}

export const db = new GameDB();
