
import { createClient } from '@supabase/supabase-js';

// --- Types ---
export interface UserRecord {
  id: string;
  high_score: number;
  games_played: number;
}

export interface RankingEntry {
  rank: number; // Explicit rank number
  name: string;
  score: number;
  isUser: boolean;
}

// --- Supabase Config ---
// 중요: Vite는 빌드 시점에 'import.meta.env.VITE_...' 문자열을 정적으로 찾아 교체합니다.
// 함수로 감싸거나 동적으로 접근하면 빌드 도구가 이를 인식하지 못해 값이 undefined가 됩니다.
// 따라서 아래와 같이 직접 접근해야 합니다.

const SUPABASE_URL = 
  // @ts-ignore
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || 
  // @ts-ignore
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SUPABASE_URL) || 
  '';

const SUPABASE_KEY = 
  // @ts-ignore
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || 
  // @ts-ignore
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SUPABASE_ANON_KEY) || 
  '';

// --- Local Storage Key ---
const LOCAL_DB_KEY = 'shisen_sho_local_data_v3';

// --- Helpers ---

// UUID Generator for compatibility with UUID columns in DB
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getDeviceId = (): string => {
  let id = localStorage.getItem('shisen_device_id');
  
  // Basic validation: if it's not a UUID-like string, regenerate it.
  // This ensures we don't send "user-xyz" to a UUID column which causes insert failures.
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!id || !uuidRegex.test(id)) {
    id = generateUUID();
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
    
    // 디버깅을 위한 로그 (배포 환경에서 확인 가능)
    // 실제 키 값은 보안상 출력하지 않고 길이만 확인합니다.
    const hasUrl = !!SUPABASE_URL && SUPABASE_URL.length > 0;
    const hasKey = !!SUPABASE_KEY && SUPABASE_KEY.length > 20;

    if (hasUrl && hasKey) {
      console.log("Supabase Client Connecting..."); 
      this.client = createClient(SUPABASE_URL, SUPABASE_KEY, {
        db: { schema: 'ddp' }
      });
    } else {
      console.warn(`Supabase Connection Failed. Env Vars Missing. URL: ${hasUrl}, KEY: ${hasKey}`);
      console.warn("Falling back to Local Storage Mode.");
      this.client = null;
    }
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

  // Fetches full user stats including nickname
  async getUserProfile(): Promise<{ id: string; nickname: string; highScore: number }> {
    // 1. Local Fallback
    if (!this.client) {
      const local = this.getLocalData();
      return { 
        id: this.userId, 
        nickname: local.username || '', 
        highScore: local.high_score 
      };
    }

    // 2. Supabase
    try {
      // Use maybeSingle() to handle 0 rows gracefully without error
      const { data, error } = await this.client
        .from('profiles')
        .select('id, username, high_score')
        .eq('id', this.userId)
        .maybeSingle();

      if (error) {
         console.warn("Supabase getUserProfile error:", error.code, error.message);
         throw error;
      }
      
      // If no user found, create one immediately (Upsert pattern)
      if (!data) {
        console.log("User not found, initializing profile...");
        const { error: upsertError } = await this.client
            .from('profiles')
            .upsert({
                id: this.userId,
                high_score: 0,
                games_played: 0,
                username: '', // Empty initially
                updated_at: new Date().toISOString()
            });

        if (upsertError) {
             console.error("Failed to initialize profile:", upsertError);
             // Even if server fails, return default to allow app to run
             return { id: this.userId, nickname: '', highScore: 0 };
        }
        return { id: this.userId, nickname: '', highScore: 0 };
      }
      
      return { 
        id: this.userId, 
        nickname: data.username || '', 
        highScore: data.high_score || 0
      };

    } catch (e) {
      console.error("Supabase load failed, falling back to local:", e);
      const local = this.getLocalData();
      return { id: this.userId, nickname: local.username || '', highScore: local.high_score };
    }
  }

  // Update Nickname
  async updateProfile(nickname: string): Promise<void> {
    // 1. Local
    const local = this.getLocalData();
    local.username = nickname;
    this.saveLocalData(local);

    // 2. Supabase
    if (this.client) {
      try {
        // Upsert handles both insert and update
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
             console.error("Failed to update profile:", error);
        }
      } catch (e) {
        console.error("Failed to update profile:", e);
      }
    }
  }

  async saveScore(currentScore: number): Promise<void> {
    const local = this.getLocalData();
    local.games_played += 1;
    if (currentScore > local.high_score) {
      local.high_score = currentScore;
    }
    this.saveLocalData(local);

    if (this.client) {
      try {
        // Fetch current server data to ensure we don't overwrite a higher score from another device (edge case)
        // or simply to get the current state.
        const { data: existing } = await this.client
          .from('profiles')
          .select('high_score, games_played')
          .eq('id', this.userId)
          .maybeSingle();

        const oldScore = existing?.high_score || 0;
        const oldGames = existing?.games_played || 0;
        const newHighScore = Math.max(oldScore, currentScore);

        // Upsert ensures record exists
        const { error } = await this.client
            .from('profiles')
            .upsert({
              id: this.userId,
              high_score: newHighScore,
              games_played: oldGames + 1,
              username: local.username || '', // Persist local username if not on server
              updated_at: new Date().toISOString()
            });

        if (error) {
            console.error("Failed to save score to server:", error);
        }
      } catch (e) {
        console.error("Failed to save score to server:", e);
      }
    }
  }

  async getRankings(currentScore: number): Promise<RankingEntry[]> {
    if (!this.client) {
      const all = [...MOCK_RANKERS, { name: 'YOU', score: currentScore }];
      all.sort((a, b) => b.score - a.score);
      return all.slice(0, 5).map((r, i) => ({
        rank: i + 1,
        name: r.name,
        score: r.score,
        isUser: r.name === 'YOU'
      }));
    }

    try {
      const { data: topPlayers } = await this.client
        .from('profiles')
        .select('id, username, high_score')
        .order('high_score', { ascending: false })
        .limit(3);

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
      console.error("Failed to get rankings:", e);
      return [];
    }
  }
}

export const db = new GameDB();
