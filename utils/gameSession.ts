interface TimerGuardParams {
  isPlaying: boolean;
  isGameOver: boolean;
  isLevelComplete: boolean;
  showHelp: boolean;
  showSettings: boolean;
  isLoadingAd: boolean;
  isShuffling: boolean;
  hasAdConfirm: boolean;
}

interface MatchRewardParams {
  combo: number;
  lastMatchTime: number;
  now: number;
  scorePerMatch: number;
}

interface MatchRewardResult {
  points: number;
  newCombo: number;
  isCombo: boolean;
  finalSubText: string;
}

export const shouldRunGameTimer = (params: TimerGuardParams): boolean => {
  return params.isPlaying
    && !params.isGameOver
    && !params.isLevelComplete
    && !params.showHelp
    && !params.showSettings
    && !params.isLoadingAd
    && !params.isShuffling
    && !params.hasAdConfirm;
};

export const evaluateMatchReward = (params: MatchRewardParams): MatchRewardResult => {
  const isCombo = params.lastMatchTime > 0 && (params.now - params.lastMatchTime) < 1000;
  const newCombo = isCombo ? params.combo + 1 : 1;
  const points = params.scorePerMatch + (isCombo ? 100 : 0);
  const timeBonusText = '+2s';
  const comboText = isCombo ? `Combo x${newCombo} 🔥` : '';
  const finalSubText = comboText ? `${comboText} ${timeBonusText}` : timeBonusText;

  return {
    points,
    newCombo,
    isCombo,
    finalSubText,
  };
};

