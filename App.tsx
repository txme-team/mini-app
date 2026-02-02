import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createBoard, findPath, hasPossibleMoves, shuffleBoard, findAvailableMatch } from './utils/gameLogic';
import { soundManager } from './utils/audio';
import { db, RankingEntry } from './utils/db'; // Import Database
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
  INITIAL_HEARTS
} from './constants';
import { HeartIcon, PauseIcon, PlayIcon, StarIcon, ClockIcon, HintIcon, SoundOnIcon, SoundOffIcon } from './components/Icons';

import Board from './components/Board';
import { 
  GameOverModal, 
  LevelCompleteModal, 
  GameCompleteModal, 
  HelpModal 
} from './components/Modals';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    hearts: INITIAL_HEARTS,
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
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Bonus System State
  const [combo, setCombo] = useState(0);
  const lastMatchTime = useRef<number>(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextData[]>([]);
  const [isScoreAnimating, setIsScoreAnimating] = useState(false);

  // Ranking State for Modals
  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  // --- Initialization with DB ---
  useEffect(() => {
    const initGame = async () => {
        const userStats = await db.getUserStats();
        setGameState(prev => ({
          ...prev,
          hearts: userStats.hearts
        }));
    };
    initGame();
  }, []);

  // --- Back Button Handling (History API) ---
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If the user hits back while playing, pause the game instead of exiting immediately.
      // The history pop has already happened, so we are now at length-1.
      setGameState(prev => {
        if (prev.isPlaying && !prev.isGameOver && !prev.isLevelComplete) {
          setIsPaused(true);
          return prev;
        }
        return prev;
      });
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
      timeLeft: TOTAL_TIME_SECONDS, // Reset time on new level
    }));
    setSelectedTile(null);
    setSecondSelectedTile(null);
    setConnectionPath(null);
    setErrorTile(null);
    setIsPaused(false);
    setCombo(0);
    lastMatchTime.current = 0;
    setFloatingTexts([]);
    setRankings([]); // Clear rankings until needed
  }, []);

  const restartGame = async () => {
    await db.saveHearts(INITIAL_HEARTS); // Reset DB hearts
    
    setGameState({
      level: 1,
      score: 0,
      hearts: INITIAL_HEARTS,
      timeLeft: TOTAL_TIME_SECONDS,
      isPlaying: true,
      isGameOver: false,
      isLevelComplete: false,
    });
    startLevel(1);
  };

  // --- Timer ---
  useEffect(() => {
    let timer: number;
    if (gameState.isPlaying && !gameState.isGameOver && !gameState.isLevelComplete && !showHelp && !isPaused) {
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
  }, [gameState.isPlaying, gameState.isGameOver, gameState.isLevelComplete, showHelp, isPaused]);

  // Effect to handle Game Over Async Tasks (Save Score & Fetch Ranking)
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
    if (!gameState.isPlaying || gameState.isGameOver || connectionPath || secondSelectedTile || isPaused) return; 

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
    // Cleanup after animation
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

    // --- Bonus Logic ---
    const now = Date.now();
    const timeDiff = now - lastMatchTime.current;
    
    // Condition: Match within 1 second (1000ms) - Updated from 3000ms
    const isCombo = lastMatchTime.current > 0 && timeDiff < 1000;
    
    let newCombo = 0;
    let points = SCORE_PER_MATCH;
    let subText = undefined;

    if (isCombo) {
        newCombo = combo + 1;
        // Speed/Combo Bonus: Base + 100 (Total 200)
        points += 100; 
        subText = `Combo x${newCombo} 🔥`;
    } else {
        newCombo = 1; // Reset to 1
    }

    setCombo(newCombo);
    lastMatchTime.current = now;

    // --- Visuals ---
    addFloatingText(`+${points}`, subText, isCombo ? 'combo' : 'normal');
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
        timeLeft: prev.timeLeft + 10 
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

  const handleHint = async () => {
    if (gameState.hearts <= 0 || !gameState.isPlaying || isPaused || connectionPath) return;

    const match = findAvailableMatch(board);
    if (match) {
        soundManager.playSelect();
        
        // Update State & DB
        const newHearts = gameState.hearts - 1;
        
        // Fire and forget save
        db.saveHearts(newHearts); 
        
        setGameState(prev => ({ ...prev, hearts: newHearts }));
        
        setSelectedTile(match.tile1);
        setSecondSelectedTile(match.tile2);
        
        setTimeout(() => {
             handleMatch(match.tile1, match.tile2, match.path);
        }, 500);
    }
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
        // Handled by modal
    } else {
        startLevel(gameState.level + 1);
    }
  };

  const togglePause = () => {
      setIsPaused(!isPaused);
      soundManager.playSelect();
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    // Safe Area padding applied here
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
               <span className="text-2xl font-bold text-red-500 mt-1 drop-shadow-sm bg-white/80 px-2 rounded-full border border-red-500">{ft.subText}</span>
             )}
          </div>
        ))}
      </div>

      {/* Retro Console Container */}
      <div className="w-full max-w-[800px] bg-white border-4 border-blue-900 shadow-[8px_8px_0_rgba(0,0,0,0.2)] p-1 flex flex-col h-full max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-blue-100 border-b-4 border-blue-900 p-1.5 flex items-center justify-start gap-6 shrink-0 mb-1">
           {/* Controls */}
           <div className="flex gap-2">
              <button onClick={togglePause} className="w-10 h-10 bg-blue-500 border-2 border-blue-900 shadow-[2px_2px_0_rgba(0,0,0,0.2)] flex items-center justify-center text-white active:translate-y-0.5 active:shadow-none">
                 <div className="w-5 h-5">{isPaused ? <PlayIcon /> : <PauseIcon />}</div>
              </button>
              <button onClick={toggleMute} className="w-10 h-10 bg-blue-400 border-2 border-blue-900 shadow-[2px_2px_0_rgba(0,0,0,0.2)] flex items-center justify-center text-white active:translate-y-0.5 active:shadow-none">
                 <div className="w-5 h-5">{isMuted ? <SoundOffIcon /> : <SoundOnIcon />}</div>
              </button>
           </div>
           
           {/* Stats */}
           <div className="flex gap-4 text-blue-900">
               <div className="flex items-center gap-1">
                   <div className="w-4 h-4"><HeartIcon /></div>
                   <span className="font-bold text-xl">{gameState.hearts}</span>
               </div>
               <div className="flex items-center gap-1">
                   <div className="w-4 h-4"><StarIcon /></div>
                   <span className={`font-bold text-xl transition-transform ${isScoreAnimating ? 'animate-score-bump' : ''}`}>
                      {gameState.score}
                   </span>
               </div>
               <div className="flex items-center gap-1">
                   <div className="w-4 h-4"><ClockIcon /></div>
                   <span className={`font-bold text-xl ${gameState.timeLeft < 30 ? 'text-red-500 animate-pulse' : ''}`}>
                      {formatTime(gameState.timeLeft)}
                   </span>
               </div>
           </div>
        </div>

        {/* Level Indicator */}
        <div className="flex justify-center -mt-5 mb-1 z-10 pointer-events-none">
            <div className="bg-yellow-300 border-2 border-blue-900 px-3 py-0.5 text-blue-900 font-bold shadow-sm">
                LEVEL {gameState.level}
            </div>
        </div>

        {/* Game Screen */}
        <div className="flex-grow bg-retro-grid border-4 border-blue-900 relative overflow-hidden flex flex-col justify-center">
            <div className="w-full h-full p-0">
                {board.length > 0 && (
                    <Board 
                        board={board}
                        selectedTile={selectedTile}
                        secondSelectedTile={secondSelectedTile}
                        errorTile={errorTile}
                        onTileClick={handleTileClick}
                        connectionPath={connectionPath}
                        isPaused={isPaused}
                    />
                )}
            </div>
        </div>

        {/* Bottom Controls */}
        <div className="mt-1 shrink-0">
           <button 
             onClick={handleHint}
             disabled={gameState.hearts <= 0}
             className={`w-full py-4 text-white text-xl font-bold border-4 border-blue-900 shadow-[4px_4px_0_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 transition-transform active:translate-y-1 active:shadow-[0_0_0_0] 
               ${gameState.hearts > 0 ? 'bg-yellow-400' : 'bg-gray-400 cursor-not-allowed'}`}
           >
              <div className="w-6 h-6"><HintIcon /></div>
              HINT
           </button>
        </div>

      </div>

      {/* Modals */}
      {showHelp && (
        <HelpModal onClose={() => {
            // Push state when game starts to enable back-button-to-pause
            window.history.pushState({ page: 'game' }, '', '');
            
            setShowHelp(false);
            if (!gameState.isPlaying && gameState.level === 1) {
                startLevel(1);
            }
        }} />
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

export default App;