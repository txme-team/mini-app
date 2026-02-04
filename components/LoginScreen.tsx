
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { soundManager } from '../utils/audio';
import { db } from '../utils/db'; 

// ----------------------------------------------------------------------
// Custom Assets (Keep existing)
// ----------------------------------------------------------------------

const CuteMascot = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full" shapeRendering="geometricPrecision">
    <defs>
      <filter id="softGlow">
         <feGaussianBlur stdDeviation="0.6" result="coloredBlur"/>
         <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
         </feMerge>
      </filter>
    </defs>
    <ellipse cx="16" cy="28" rx="6" ry="1.5" fill="#000" opacity="0.1" />
    <g className="animate-dog-bounce">
        <rect x="11" y="21" width="10" height="6" rx="2.5" fill="#fff" />
        <rect x="5" y="6" width="22" height="17" rx="5" fill="#fff" />
        <circle cx="5" cy="9" r="3.5" fill="#fff" />
        <circle cx="27" cy="9" r="3.5" fill="#fff" />
        <circle cx="5" cy="9" r="1.5" fill="#fbcfe8" />
        <circle cx="27" cy="9" r="1.5" fill="#fbcfe8" />
        <ellipse cx="10.5" cy="14" rx="3" ry="3.5" fill="#1e3a8a" />
        <ellipse cx="21.5" cy="14" rx="3" ry="3.5" fill="#1e3a8a" />
        <circle cx="9.5" cy="12.5" r="1.2" fill="white" />
        <circle cx="20.5" cy="12.5" r="1.2" fill="white" />
        <circle cx="11.5" cy="15.5" r="0.8" fill="#60a5fa" />
        <circle cx="22.5" cy="15.5" r="0.8" fill="#60a5fa" />
        <ellipse cx="6.5" cy="17.5" rx="2" ry="1.2" fill="#fbcfe8" opacity="0.6" />
        <ellipse cx="25.5" cy="17.5" rx="2" ry="1.2" fill="#fbcfe8" opacity="0.6" />
        <ellipse cx="16" cy="17.5" rx="1.5" ry="1" fill="#1e3a8a" />
        <path d="M14.5 19 Q16 20.5 17.5 19" fill="none" stroke="#1e3a8a" strokeWidth="1" strokeLinecap="round" />
        <circle cx="11" cy="23" r="2" fill="#fff" stroke="#e5e7eb" strokeWidth="0.5" />
        <circle cx="21" cy="23" r="2" fill="#fff" stroke="#e5e7eb" strokeWidth="0.5" />
    </g>
    <g>
        <circle cx="28" cy="6" r="1.5" fill="#fcd34d" className="animate-twinkle" style={{ animationDelay: '0s' }} />
        <path d="M4 18 L6 16 L8 18 L6 20 Z" fill="#f472b6" className="animate-twinkle" style={{ animationDelay: '0.5s' }} />
        <circle cx="2" cy="10" r="1" fill="#60a5fa" className="animate-twinkle" style={{ animationDelay: '1s' }} />
    </g>
  </svg>
);

const GameLogo = () => (
  <div className="w-full max-w-[320px] h-40 relative flex items-center justify-center -mt-4">
    <svg viewBox="0 0 320 160" className="w-full h-full overflow-visible drop-shadow-md">
      <defs>
        <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
       <g>
           <path d="M160 145 C 50 145 20 100 20 80 C 20 30 80 20 160 20 C 240 20 300 30 300 80 C 300 100 270 145 160 145 Z" 
                 fill="#fef08a" stroke="#facc15" strokeWidth="4" />
           <path d="M160 135 C 70 135 40 100 40 80 C 40 50 100 40 160 40 C 220 40 280 50 280 80 C 280 100 250 135 160 135 Z" 
                 fill="#ffffff" opacity="0.4" />
            <g transform="translate(50, 45) rotate(-20)">
                <path d="M0 10 Q10 0 20 10 T40 10 Q20 35 0 10" fill="#f472b6" stroke="#be185d" strokeWidth="2" transform="scale(0.8)" />
            </g>
             <g transform="translate(260, 40) rotate(20)">
                <path d="M0 10 Q10 0 20 10 T40 10 Q20 35 0 10" fill="#f472b6" stroke="#be185d" strokeWidth="2" transform="scale(0.8)" />
            </g>
           <g style={{ fontFamily: '"Gugi", cursive', fontWeight: 400 }}>
                <text x="160" y="105" textAnchor="middle" fontSize="85" 
                      fill="none" stroke="#1e3a8a" strokeWidth="24" strokeLinejoin="round" strokeLinecap="round">
                    댕댕팡
                </text>
                <text x="160" y="105" textAnchor="middle" fontSize="85" 
                      fill="none" stroke="white" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round">
                    댕댕팡
                </text>
                <text x="160" y="105" textAnchor="middle" fontSize="85" 
                      fill="url(#textGradient)">
                    댕댕팡
                </text>
                 <path d="M90 75 Q 160 65 230 75" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.5" fill="none" />
                 <circle cx="90" cy="80" r="3" fill="white" />
                 <circle cx="230" cy="80" r="3" fill="white" />
           </g>
           <g transform="translate(105, 50) rotate(-15)">
              <path d="M10 5 Q15 0 20 5 T30 5 Q20 20 10 5" fill="#60a5fa" stroke="white" strokeWidth="2" />
           </g>
       </g>
    </svg>
  </div>
);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요!');
      soundManager.playError();
      return;
    }
    if (nickname.length > 8) {
      setError('닉네임은 8글자 이하로 해주세요.');
      soundManager.playError();
      return;
    }

    // Offline-First: Don't block login if server is unreachable
    soundManager.init();
    soundManager.playSelect();
    await login(nickname.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4 font-[DotGothic16] overflow-hidden select-none">
      <div className="bg-white p-4 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(30,58,138,0.25)] border-b-8 border-r-8 border-blue-200 w-full max-w-[340px] relative">
        <div className="bg-[#eff6ff] border-[8px] border-blue-900 rounded-2xl overflow-hidden relative shadow-inner h-[520px] flex flex-col">
            <div className="h-8 bg-blue-100/50 border-b-4 border-blue-900 flex items-center justify-between px-3">
                <div className="flex gap-1.5">
                    <div className="w-12 h-2.5 bg-blue-200 rounded-full border border-blue-300"></div>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-900 rounded-full opacity-50"></div>
                    <div className="w-1.5 h-1.5 bg-blue-900 rounded-full opacity-50"></div>
                </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-retro-stripe relative z-10">
                <div className="mb-4 transform -rotate-2 hover:rotate-2 transition-transform duration-300 cursor-default">
                    <GameLogo />
                </div>
                <div className="w-48 h-48 mb-6 relative">
                    <CuteMascot />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/50 rounded-full blur-xl -z-10"></div>
                </div>
                <form onSubmit={handleLogin} className="w-full relative z-20 flex flex-col items-center gap-3">
                    <div className="relative w-full group">
                        <div className="bg-white border-[3px] border-blue-900 rounded-lg p-1 shadow-[4px_4px_0_rgba(30,58,138,0.1)] transition-transform group-focus-within:-translate-y-1">
                            <input 
                                type="text" 
                                value={nickname}
                                onChange={(e) => {
                                    setNickname(e.target.value);
                                    setError('');
                                }}
                                placeholder="댕댕이 이름을 지어줘"
                                className="w-full h-10 bg-transparent text-center text-xl text-blue-900 placeholder-blue-300 focus:outline-none font-bold rounded"
                            />
                        </div>
                        {error && (
                            <div className="absolute -bottom-8 left-0 w-full text-center">
                                <span className="text-red-500 font-bold text-xs bg-white px-2 py-0.5 border-2 border-red-500 rounded-full animate-shake inline-block shadow-sm">
                                    {error}
                                </span>
                            </div>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 bg-blue-500 rounded-xl border-b-[6px] border-blue-700 active:border-b-0 active:translate-y-[6px] text-white text-xl font-black flex items-center justify-center gap-2 transition-all hover:bg-blue-400 shadow-lg"
                    >
                        <span>START</span>
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
                    </button>
                </form>
            </div>
            <div className="h-10 bg-blue-100/50 border-t-4 border-blue-900 flex items-center justify-center gap-6">
                <div className="w-4 h-4 rounded-full bg-blue-300 border-2 border-blue-900 shadow-[0_2px_0_rgba(30,58,138,0.5)]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-300 border-2 border-blue-900 shadow-[0_2px_0_rgba(30,58,138,0.5)]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-300 border-2 border-blue-900 shadow-[0_2px_0_rgba(30,58,138,0.5)]"></div>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_4px] z-20 opacity-50"></div>
        </div>
      </div>
      <div className="mt-6 text-blue-900/30 text-xs font-bold tracking-widest uppercase flex flex-col items-center">
        <span>DangDangPang</span>
        <span className="text-[10px] mt-1">Ver 2.0 • Cute Edition</span>
      </div>
    </div>
  );
};

export default LoginScreen;
