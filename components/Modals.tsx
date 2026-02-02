import React from 'react';
import { TrophyIcon, SadDogIcon, PartyIcon, HintIcon } from './Icons';
import { RankingEntry } from '../utils/db';

// Reusable Modal Wrapper
interface ModalOverlayProps {
  children: React.ReactNode;
  containerClass?: string;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, containerClass }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className={containerClass || "bg-sky-50 p-6 border-[6px] border-blue-900 shadow-[8px_8px_0_rgba(0,0,0,0.5)] max-w-sm w-[90%] text-center relative flex flex-col items-center max-h-[90vh]"}>
      {children}
    </div>
  </div>
);

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  colorClass?: string;
}

const ActionButton: React.FC<ButtonProps> = ({ onClick, children, colorClass = 'glossy-blue' }) => (
  <button
    onClick={onClick}
    className={`w-full py-4 px-6 text-xl font-black mt-4 btn-pixel-glossy uppercase tracking-widest shadow-xl active:translate-y-2 active:shadow-none transition-all ${colorClass}`}
  >
    {children}
  </button>
);

interface RankingItemProps {
  rank: number;
  name: string;
  score: number;
  isUser?: boolean;
}

const RankingItem: React.FC<RankingItemProps> = ({ rank, name, score, isUser }) => (
  <div className={`w-full flex items-center justify-between p-2 mb-2 border-2 border-blue-900 ${isUser ? 'bg-yellow-100 scale-[1.02] border-yellow-500 shadow-sm' : 'bg-white'}`}>
     <div className="flex items-center gap-3 overflow-hidden">
        <span className={`shrink-0 w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-black ${rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-slate-300' : rank === 3 ? 'bg-orange-300' : 'bg-slate-200'}`}>
           {rank}
        </span>
        <span className={`text-base truncate ${isUser ? 'font-bold text-black' : 'text-slate-600'}`}>{name}</span>
     </div>
     <span className={`font-bold shrink-0 ${isUser ? 'text-red-600' : 'text-slate-600'}`}>{score.toLocaleString()}</span>
  </div>
);

const RankingView = ({ rankings }: { rankings: RankingEntry[] }) => (
  <div className="w-full mt-4 mb-2 text-left bg-white border-4 border-blue-900 p-2">
     <h3 className="text-sm font-bold text-blue-900 uppercase mb-3 text-center border-b-2 border-blue-900 pb-1">WEEKLY RANK</h3>
     {rankings.length === 0 ? (
       <div className="text-center text-gray-400 py-4">Loading...</div>
     ) : (
       rankings.map((r, i) => (
         <RankingItem 
           key={i} 
           rank={i + 1} 
           name={r.name} 
           score={r.score} 
           isUser={r.isUser} 
         />
       ))
     )}
  </div>
);

export const GameOverModal = ({ score, onRestart, rankings }: { score: number; onRestart: () => void; rankings: RankingEntry[] }) => (
  <ModalOverlay>
    <div className="w-20 h-20 mx-auto mb-2">
      <SadDogIcon />
    </div>
    <h2 className="text-4xl font-black text-red-600 mb-2 stroke-black" style={{ textShadow: '2px 2px 0 #000' }}>GAME OVER</h2>
    
    <RankingView rankings={rankings} />
    
    <ActionButton onClick={onRestart} colorClass="glossy-green">RETRY</ActionButton>
  </ModalOverlay>
);

export const LevelCompleteModal = ({ score, level, onNext, rankings }: { score: number; level: number; onNext: () => void; rankings: RankingEntry[] }) => (
  <ModalOverlay>
    <div className="w-20 h-20 mx-auto mb-2">
       <PartyIcon />
    </div>
    <h2 className="text-4xl font-black text-blue-600 mb-2" style={{ textShadow: '2px 2px 0 #fff' }}>LEVEL {level} CLEAR!</h2>

    <RankingView rankings={rankings} />
    
    <ActionButton onClick={onNext} colorClass="glossy-blue">
      {level >= 5 ? 'ENDING' : 'NEXT LEVEL'}
    </ActionButton>
  </ModalOverlay>
);

export const GameCompleteModal = ({ score, onRestart, rankings }: { score: number; onRestart: () => void; rankings: RankingEntry[] }) => (
  <ModalOverlay>
    <div className="w-24 h-24 mx-auto mb-4">
      <TrophyIcon />
    </div>
    <h2 className="text-4xl font-black text-yellow-500 mb-2" style={{ textShadow: '3px 3px 0 #000' }}>YOU WIN!</h2>
    
    <RankingView rankings={rankings} />
    
    <ActionButton onClick={onRestart} colorClass="glossy-pink">RESTART GAME</ActionButton>
  </ModalOverlay>
);

export const HelpModal = ({ onClose }: { onClose: () => void }) => (
  <ModalOverlay>
    <div className="w-20 h-20 mx-auto mb-2">
      <HintIcon /> 
    </div>
    <h2 className="text-3xl font-black text-blue-900 mb-4 border-b-4 border-blue-900 pb-2 w-full">게임 방법</h2>
    
    <div className="w-full text-left bg-white p-4 border-2 border-blue-900 mb-4 shadow-inner">
        <ul className="list-decimal pl-5 space-y-3 text-lg font-bold text-slate-700 break-keep">
            <li>
                <span className="text-blue-600">짝 맞추기:</span> 똑같은 모양의 패 2개를 선택해서 없애세요.
            </li>
            <li>
                <span className="text-blue-600">규칙:</span> 연결하는 선은 <span className="text-red-500">2번까지만</span> 꺾일 수 있어요.
            </li>
            <li>
                <span className="text-blue-600">목표:</span> 제한 시간 안에 모든 패를 없애면 성공!
            </li>
        </ul>
    </div>

    <ActionButton onClick={onClose} colorClass="glossy-blue">GAME START</ActionButton>
  </ModalOverlay>
);