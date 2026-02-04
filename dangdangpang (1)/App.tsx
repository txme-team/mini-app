
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createBoard, findPath, hasPossibleMoves, shuffleBoard, findAvailableMatch } from './utils/gameLogic';
import { soundManager } from './utils/audio';
import { db, RankingEntry } from './utils/db'; 
import { initAds, showRewardAd } from './utils/ads'; 
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import LoginScreen from './components/LoginScreen'; 
import { 
  GameState, 
  TileData, 
  Path, 
  LevelConfig,
  FloatingTextData
} from './types';
import { 
  LEVEL_CONFIGS, 
  MAX_LEVEL, 
  TOTAL_TIME_SECONDS, 
  TIME_PENALTY_SECONDS,
  SCORE_PER_MATCH,
  BOARD_COLS,
  BOARD_ROWS
} from './constants';
import { GearIcon, ShuffleIcon, StarIcon, ClockIcon, HintIcon, SoundOnIcon, SoundOffIcon, VideoIcon } from './components/Icons';

import Board from './components/Board';
import { 
  GameOverModal, 
  LevelCompleteModal, 
  GameCompleteModal, 
  HelpModal,
  AdConfirmModal
} from './components/Modals';

// Separated Game Component to use Auth Context
const GameApp: React.FC = () => {
  const { user } = useAuth(); // Get logged in user
  
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    timeLeft: TOTAL_TIME_SECONDS,
    isPlaying: false,
    isGameOver: false,
    isLevelComplete: false,
  });

  const [board, setBoard] = useState<(TileData | null)[][]>([]);
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);
  const [secondSelectedTile, setSecondSelectedTile] = useState<TileData | null>(null);
  const [errorTile, setErrorTile] = useState<TileData | null>(null);
  const [connectionPath, setConnectionPath] = useState<Path | null>(null);
  
  const [showHelp, setShowHelp] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  
  // Ad Confirmation State
  const [adConfirmType, setAdConfirmType] = useState<'hint' | 'shuffle' | null>(null);

  // Bonus System State
  const [combo, setCombo] = useState(0);
  const lastMatchTime = useRef<number>(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextData[]>([]);
  const [isScoreAnimating, setIsScoreAnimating] = useState(false);

  // Ranking State for Modals
  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  // Init Ads
  useEffect(() => {
    initAds();
  }, []);

  // --- Back Button Handling (History API) ---
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
        // Just prevent back navigation for now in PWA context
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const startLevel = useCallback((level: number) => {
    const config: LevelConfig = LEVEL_CONFIGS[level];
    const newBoard = createBoard(config.rows, config.cols, config.tileTypesCount);
    
    setBoard(newBoard);
    setGameState(prev => ({
      ...prev,
      level,
      isPlaying: true,
      isLevelComplete: false,
      isGameOver: false,
      timeLeft: config.timeLimit, 
    }));
    setSelectedTile(null);
    setSecondSelectedTile(null);
    setConnectionPath(null);
    setErrorTile(null);
    setCombo(0);
    lastMatchTime.current = 0;
    setFloatingTexts([]);
    setRankings([]); 
    setShowSettings(false);
  }, []);

  const restartGame = async () => {
    const l1Config = LEVEL_CONFIGS[1];
    setGameState(prev => ({
      level: 1,
      score: 0,
      timeLeft: l1Config.timeLimit,
      isPlaying: true,
      isGameOver: false,
      isLevelComplete: false,
    }));
    startLevel(1);
  };

  // --- Timer ---
  useEffect(() => {
    let timer: number;
    // Timer pauses when help or settings are open
    if (gameState.isPlaying && !gameState.isGameOver && !gameState.isLevelComplete && !showHelp && !showSettings && !isLoadingAd && !isShuffling && !adConfirmType) {
      timer = window.setInterval(async () => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
             return { ...prev, timeLeft: 0, isGameOver: true, isPlaying: false };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.isGameOver, gameState.isLevelComplete, showHelp, showSettings, isLoadingAd, isShuffling, adConfirmType]);

  // Game Over
  useEffect(() => {
    if (gameState.isGameOver && gameState.timeLeft === 0) {
        soundManager.playError();
        const finishGame = async () => {
            await db.saveScore(gameState.score);
            const r = await db.getRankings(gameState.score);
            setRankings(r);
        };
        finishGame();
    }
  }, [gameState.isGameOver, gameState.timeLeft, gameState.score]);


  // --- Logic ---

  const handleTileClick = (clickedTile: TileData) => {
    if (!gameState.isPlaying || gameState.isGameOver || connectionPath || secondSelectedTile || showSettings || isLoadingAd || isShuffling || adConfirmType) return; 

    soundManager.playSelect();

    if (!selectedTile) {
      setSelectedTile(clickedTile);
      setErrorTile(null);
      return;
    }

    if (selectedTile.id === clickedTile.id) {
      setSelectedTile(null);
      return;
    }

    setSecondSelectedTile(clickedTile);

    if (selectedTile.type === clickedTile.type) {
      const path = findPath(selectedTile.position, clickedTile.position, board);
      if (path) {
        handleMatch(selectedTile, clickedTile, path);
      } else {
        handleMismatch(clickedTile);
      }
    } else {
       handleMismatch(clickedTile);
    }
  };

  const addFloatingText = (text: string, subText?: string, type: 'normal' | 'combo' = 'normal') => {
    const id = Date.now();
    setFloatingTexts(prev => [...prev, { id, text, subText, type }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
    }, 1200);
  };

  const triggerScoreAnimation = () => {
    setIsScoreAnimating(true);
    setTimeout(() => setIsScoreAnimating(false), 300);
  };

  const handleMatch = (tile1: TileData, tile2: TileData, path: Path) => {
    soundManager.playMatchSuccess();
    setConnectionPath(path);

    const now = Date.now();
    const timeDiff = now - lastMatchTime.current;
    
    const isCombo = lastMatchTime.current > 0 && timeDiff < 1000;
    
    let newCombo = 0;
    let points = SCORE_PER_MATCH;
    let subText = undefined;

    if (isCombo) {
        newCombo = combo + 1;
        points += 100; 
        subText = `Combo x${newCombo} 🔥`;
    } else {
        newCombo = 1;
    }

    setCombo(newCombo);
    lastMatchTime.current = now;

    // Add +2s logic text
    const timeBonusText = "+2s";
    const finalSubText = subText ? `${subText} ${timeBonusText}` : timeBonusText;

    addFloatingText(`+${points}`, finalSubText, isCombo ? 'combo' : 'normal');
    triggerScoreAnimation();
    
    setTimeout(() => {
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(row => row.map(t => {
            if (!t) return null;
            if (t.id === tile1.id || t.id === tile2.id) {
                return { ...t, isMatched: true };
            }
            return t;
        }));
        
        const remainingTiles = newBoard.flat().filter(t => t && !t.isMatched).length;
        if (remainingTiles === 0) {
           handleLevelComplete(gameState.score + points);
        } else if (!hasPossibleMoves(newBoard)) {
             return shuffleBoard(newBoard);
        }
        return newBoard;
      });

      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        timeLeft: prev.timeLeft + 2, // Bonus time!
      }));
      
      setConnectionPath(null);
      setSelectedTile(null);
      setSecondSelectedTile(null); 
    }, 300);
  };

  const handleMismatch = (secondTile: TileData) => {
    soundManager.playError();
    setErrorTile(secondTile);
    setCombo(0); 
    
    setGameState(prev => {
        const newTime = Math.max(0, prev.timeLeft - TIME_PENALTY_SECONDS);
        return { ...prev, timeLeft: newTime };
    });

    setTimeout(() => {
      setSelectedTile(null);
      setSecondSelectedTile(null); 
      setErrorTile(null);
    }, 500);
  };

  // --- Ad Based Actions ---

  const handleHintClick = () => {
    if (!gameState.isPlaying || showSettings || connectionPath || isLoadingAd || isShuffling) return;
    soundManager.playSelect();
    setAdConfirmType('hint');
  };

  const handleShuffleClick = () => {
    if (!gameState.isPlaying || showSettings || connectionPath || isLoadingAd || isShuffling) return;
    soundManager.playSelect();
    setAdConfirmType('shuffle');
  };

  const handleAdConfirmed = async () => {
    const type = adConfirmType;
    setAdConfirmType(null); // Close modal
    setIsLoadingAd(true);

    // SAFETY: If ad fails silently, reset loading after 5s
    const safetyTimer = setTimeout(() => {
        setIsLoadingAd(false);
    }, 5000);

    showRewardAd(
      async () => {
        // Success
        clearTimeout(safetyTimer);
        setIsLoadingAd(false);
        
        if (type === 'hint') {
            const match = findAvailableMatch(board);
            if (match) {
                soundManager.playStoreSuccess();
                setSelectedTile(match.tile1);
                setSecondSelectedTile(match.tile2);
                setTimeout(() => {
                     handleMatch(match.tile1, match.tile2, match.path);
                }, 500);
            }
        } else if (type === 'shuffle') {
            // Start Shuffle Animation
            setIsShuffling(true);
            soundManager.playSelect(); 

            setTimeout(() => {
                soundManager.playStoreSuccess();
                setBoard(prev => shuffleBoard(prev));
                setIsShuffling(false);
                addFloatingText("SHUFFLE!", "", 'combo');
            }, 800);
        }
      },
      () => {
        // Dismissed/Failed
        clearTimeout(safetyTimer);
        setIsLoadingAd(false);
        soundManager.playError();
      }
    );
  };

  const handleAdCancel = () => {
    soundManager.playSelect();
    setAdConfirmType(null);
  };

  const handleLevelComplete = async (finalScore: number) => {
    soundManager.playLevelComplete();
    await db.saveScore(finalScore);
    const r = await db.getRankings(finalScore);
    setRankings(r);

    setGameState(prev => ({
        ...prev,
        isLevelComplete: true,
        isPlaying: false 
    }));
    setCombo(0);
    setFloatingTexts([]);
  };

  const nextLevel = () => {
    if (gameState.level >= MAX_LEVEL) {
    } else {
        startLevel(gameState.level + 1);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    soundManager.playSelect();
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.playSelect();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center font-[DotGothic16] p-2 pt-[calc(0.5rem+env(safe-area-inset-top))] pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      
      {/* Floating Text Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingTexts.map(ft => (
          <div 
            key={ft.id}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center animate-float-up ${ft.type === 'combo' ? 'text-yellow-500 scale-125' : 'text-blue-500'}`}
          >
             <span className="text-5xl font-black stroke-white drop-shadow-md" style={{ WebkitTextStroke: '2px white' }}>{ft.text}</span>
             {ft.subText && (
               <span className="text-2xl font-bold text-green-500 mt-1 drop-shadow-sm bg-white/90 px-3 py-1 rounded-full border border-green-500">{ft.subText}</span>
             )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-[480px] md:max-w-[600px] lg:max-w-[800px] bg-white border-4 border-blue-900 shadow-[8px_8px_0_rgba(0,0,0,0.2)] p-1 flex flex-col h-full max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-blue-100 border-b-4 border-blue-900 p-2 flex items-center justify-between shrink-0 mb-1 relative h-16">
           
           {/* Left: Settings Button */}
           <button 
              onClick={toggleSettings} 
              className="w-10 h-10 bg-white border-2 border-blue-900 shadow-[2px_2px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-blue-900 active:translate-y-0.5 active:shadow-none z-20"
           >
              <div className="w-6 h-6"><GearIcon /></div>
           </button>

           {/* Settings Menu Overlay */}
           {showSettings && (
             <div className="absolute top-14 left-2 z-50 bg-white border-4 border-blue-900 shadow-xl p-2 flex flex-col gap-2 w-40 animate-pixel-bounce origin-top-left items-center text-center">
                <button onClick={toggleMute} className="w-full flex items-center justify-center gap-2 p-2 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200">
                   <div className="w-5 h-5">{isMuted ? <SoundOffIcon /> : <SoundOnIcon />}</div>
                   <span className="font-bold text-sm">{isMuted ? "소리 켜기" : "소리 끄기"}</span>
                </button>
                <button onClick={restartGame} className="w-full flex items-center justify-center gap-2 p-2 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200 text-red-500">
                   <span className="font-bold text-sm">다시 시작</span>
                </button>
             </div>
           )}
           
           {/* Center: Big Timer */}
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
               <div className={`flex items-center gap-2 text-4xl font-black tracking-widest ${gameState.timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-900'}`}>
                  {formatTime(gameState.timeLeft)}
               </div>
           </div>

           {/* Right: Score & Level (Small) */}
           <div className="flex flex-col items-end justify-center text-blue-900">
               <div className="flex items-center gap-1">
                   <div className="w-3 h-3"><StarIcon /></div>
                   <span className={`font-bold text-lg transition-transform ${isScoreAnimating ? 'animate-score-bump' : ''}`}>
                      {gameState.score}
                   </span>
               </div>
               <div className="text-xs font-bold opacity-70">
                   Lv.{gameState.level}
               </div>
           </div>
        </div>

        {/* Game Screen */}
        <div className="flex-grow bg-retro-grid border-4 border-blue-900 relative overflow-hidden flex items-center justify-center p-2">
            {board.length > 0 && (
                <div 
                  className="relative shadow-sm"
                  style={{ 
                    aspectRatio: `${BOARD_COLS}/${BOARD_ROWS}`,
                    height: '100%', 
                    width: 'auto',
                    maxWidth: '100%'
                  }}
                >
                    <Board 
                        board={board}
                        selectedTile={selectedTile}
                        secondSelectedTile={secondSelectedTile}
                        errorTile={errorTile}
                        onTileClick={handleTileClick}
                        connectionPath={connectionPath}
                        isPaused={false}
                        isShuffling={isShuffling}
                    />
                </div>
            )}
            
            {/* Loading Ad Overlay */}
            {isLoadingAd && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <div className="w-12 h-12 mb-4 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                    <div className="font-bold text-xl">광고 불러오는 중...</div>
                </div>
            )}
        </div>

        {/* Bottom Controls */}
        <div className="mt-1 shrink-0 flex gap-2 h-14">
           {/* Hint Button */}
           <button 
             onClick={handleHintClick}
             className="flex-1 bg-yellow-400 border-4 border-blue-900 shadow-[4px_4px_0_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 text-white active:translate-y-1 active:shadow-none hover:bg-yellow-300 transition-colors"
           >
              <div className="w-6 h-6"><HintIcon /></div>
              <div className="flex flex-col items-start leading-none">
                 <span className="font-black text-lg">HINT</span>
                 <div className="flex items-center gap-1 text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full">
                    <div className="w-3 h-3"><VideoIcon /></div>
                    <span>AD</span>
                 </div>
              </div>
           </button>

           {/* Shuffle Button */}
           <button 
             onClick={handleShuffleClick}
             className="flex-1 bg-blue-500 border-4 border-blue-900 shadow-[4px_4px_0_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 text-white active:translate-y-1 active:shadow-none hover:bg-blue-400 transition-colors"
           >
              <div className="w-6 h-6"><ShuffleIcon /></div>
              <div className="flex flex-col items-start leading-none">
                 <span className="font-black text-lg">SHUFFLE</span>
                 <div className="flex items-center gap-1 text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full">
                    <div className="w-3 h-3"><VideoIcon /></div>
                    <span>AD</span>
                 </div>
              </div>
           </button>
        </div>

      </div>

      {showHelp && (
        <HelpModal onClose={() => {
            soundManager.init();
            window.history.pushState({ page: 'game' }, '', '');
            setShowHelp(false);
            if (!gameState.isPlaying && gameState.level === 1) {
                startLevel(1);
            }
        }} />
      )}
      
      {/* Ad Confirmation Modal */}
      {adConfirmType && (
          <AdConfirmModal 
              type={adConfirmType} 
              onConfirm={handleAdConfirmed} 
              onCancel={handleAdCancel} 
          />
      )}

      {gameState.isGameOver && (
          <GameOverModal 
            score={gameState.score} 
            onRestart={restartGame} 
            rankings={rankings}
          />
      )}

      {gameState.isLevelComplete && (
          gameState.level >= MAX_LEVEL ? (
             <GameCompleteModal 
                score={gameState.score} 
                onRestart={restartGame} 
                rankings={rankings}
             />
          ) : (
             <LevelCompleteModal 
                score={gameState.score} 
                level={gameState.level} 
                onNext={nextLevel} 
                rankings={rankings}
             />
          )
      )}
    </div>
  );
};

// Root Component that handles Switching
const App: React.FC = () => {
    return (
        <AuthProvider>
            <AuthConsumer />
        </AuthProvider>
    );
}

const AuthConsumer: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
             <div className="h-screen w-screen bg-retro-stripe flex items-center justify-center">
                 <div className="text-2xl font-black text-blue-900 animate-bounce">LOADING...</div>
             </div>
        );
    }

    if (!user) {
        return <LoginScreen />;
    }

    return <GameApp />;
}

export default App;
