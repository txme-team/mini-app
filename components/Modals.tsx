
import React, { useState } from 'react';
import { TrophyIcon, SadDogIcon, PartyIcon, HintIcon, VideoIcon } from './Icons';
import { RankingEntry } from '../utils/db';
import { soundManager } from '../utils/audio';

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
  disabled?: boolean;
}

const ActionButton: React.FC<ButtonProps> = ({ onClick, children, colorClass = 'glossy-blue', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-4 px-6 text-xl font-black mt-4 btn-pixel-glossy uppercase tracking-widest shadow-xl active:translate-y-2 active:shadow-none transition-all ${colorClass} ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
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
        <span className={`shrink-0 w-8 h-6 flex items-center justify-center text-xs font-bold border-2 border-black ${rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-slate-300' : rank === 3 ? 'bg-orange-300' : 'bg-slate-200'}`}>
           {rank}
        </span>
        <span className={`text-base truncate ${isUser ? 'font-bold text-black' : 'text-slate-600'}`}>{name}</span>
     </div>
     <span className={`font-bold shrink-0 ${isUser ? 'text-red-600' : 'text-slate-600'}`}>{score.toLocaleString()}</span>
  </div>
);

// Visual Separator for large rank gaps
const RankSeparator = () => (
  <div className="w-full flex justify-center items-center py-1 mb-2">
      <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-blue-900/40 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-blue-900/40 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-blue-900/40 rounded-full"></div>
      </div>
  </div>
);

const RankingView = ({ rankings }: { rankings: RankingEntry[] }) => {
  return (
    <div className="w-full mt-4 mb-2 text-left bg-white border-4 border-blue-900 p-2">
       <h3 className="text-sm font-bold text-blue-900 uppercase mb-3 text-center border-b-2 border-blue-900 pb-1">GLOBAL RANKING</h3>
       {rankings.length === 0 ? (
         <div className="text-center text-gray-400 py-4">Loading...</div>
       ) : (
         rankings.map((r, i) => {
           // Check if there is a gap between this item and the previous one
           const prevRank = i > 0 ? rankings[i-1].rank : 0;
           const isGap = r.rank > prevRank + 1;

           return (
             <React.Fragment key={i}>
               {isGap && <RankSeparator />}
               <RankingItem 
                 rank={r.rank} 
                 name={r.name} 
                 score={r.score} 
                 isUser={r.isUser} 
               />
             </React.Fragment>
           );
         })
       )}
    </div>
  );
};

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
                <span className="text-blue-600">보너스:</span> 매칭할 때마다 시간이 <span className="text-green-600">2초</span> 늘어납니다!
            </li>
            <li>
                <span className="text-blue-600">아이템:</span> 힌트와 섞기는 광고를 보고 사용할 수 있어요.
            </li>
        </ul>
    </div>

    <ActionButton onClick={onClose} colorClass="glossy-blue">GAME START</ActionButton>
  </ModalOverlay>
);

export const AdConfirmModal = ({ type, onConfirm, onCancel }: { type: 'hint' | 'shuffle', onConfirm: () => void, onCancel: () => void }) => (
  <ModalOverlay>
    <div className="w-16 h-16 mx-auto mb-4 p-2 bg-blue-100 rounded-full border-4 border-blue-900 flex items-center justify-center">
      <div className="w-10 h-10 text-blue-600"><VideoIcon /></div>
    </div>
    <h2 className="text-2xl font-black text-blue-900 mb-4 border-b-4 border-blue-900 pb-2 w-full">
        {type === 'hint' ? '힌트가 필요하신가요?' : '타일을 섞을까요?'}
    </h2>
    
    <div className="text-lg font-bold text-slate-700 mb-6 break-keep">
       광고를 시청하면<br/>
       <span className="text-blue-600">{type === 'hint' ? '정답 하나를 알려드려요!' : '타일을 재배치해드려요!'}</span>
    </div>

    <div className="flex gap-3 w-full">
        <button onClick={onCancel} className="flex-1 py-3 font-black text-slate-500 border-4 border-slate-300 bg-white hover:bg-slate-50 active:translate-y-1 rounded-lg">
            취소
        </button>
        <button onClick={onConfirm} className="flex-1 py-3 font-black text-white border-4 border-blue-800 bg-blue-500 hover:bg-blue-400 shadow-[2px_2px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none rounded-lg flex items-center justify-center gap-2">
            <span>네, 볼게요!</span>
        </button>
    </div>
  </ModalOverlay>
);
