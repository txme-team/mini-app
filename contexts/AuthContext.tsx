
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../utils/db';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (nickname: string) => Promise<void>;
  logout: () => void;
  updateNickname: (newNickname: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const profile = await db.getUserProfile();
        // If profile exists and has a nickname, we consider them "Logged In"
        if (profile.nickname) {
          setUser(profile);
        } else {
          // If no nickname, they need to "Login" (set nickname)
          setUser(null); 
        }
      } catch (error) {
        console.error("Auth initialization failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  // Use this for "Toss Login" later. 
  // Currently it just takes a nickname, saves it, and sets the user state.
  const login = async (nickname: string) => {
    setIsLoading(true);
    try {
      await db.updateProfile(nickname);
      const profile = await db.getUserProfile();
      setUser(profile);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateNickname = async (newNickname: string) => {
    if (!user) return;
    try {
        await db.updateProfile(newNickname);
        setUser(prev => prev ? { ...prev, nickname: newNickname } : null);
    } catch (e) {
        console.error("Failed to update nickname", e);
    }
  };

  const logout = () => {
    // For now, this just clears the local state. 
    // In a real device-ID based system, "logout" might not clear DB, just the session view.
    // Or we could clear the device ID from localStorage to reset the account.
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateNickname }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
