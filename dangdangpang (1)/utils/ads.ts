
declare global {
  interface Window {
    // Toss Ads Global Object
    TossAds?: {
      showRewardedVideo: (options: {
        adUnitId: string;
        onSuccess: () => void;
        onFailure: (error: any) => void;
      }) => void;
    };
  }
}

// TEST ID from Toss Docs
const TOSS_AD_UNIT_ID = 'ait-ad-test-rewarded-id';

export const initAds = () => {
  if (typeof window !== 'undefined' && !window.TossAds) {
    console.log("[TossAds] SDK not detected (Dev Mode)");
  }
};

/**
 * Shows a rewarded video ad using Toss Ads SDK.
 * Includes fallback for development and error handling.
 */
export const showRewardAd = (onReward: () => void, onDismiss: () => void) => {
  
  // 1. Check if Toss Ads is available (Real Environment)
  if (typeof window !== 'undefined' && window.TossAds && typeof window.TossAds.showRewardedVideo === 'function') {
    console.log(`[TossAds] Requesting Ad...`);
    
    try {
      window.TossAds.showRewardedVideo({
        adUnitId: TOSS_AD_UNIT_ID,
        onSuccess: () => {
          console.log("[TossAds] Ad Success");
          onReward();
        },
        onFailure: (error) => {
          console.error("[TossAds] Ad Failed:", error);
          // Don't alert in production, just dismiss to let game continue
          onDismiss();
        }
      });
    } catch (e) {
      console.error("[TossAds] Exception:", e);
      onDismiss();
    }
    return;
  }

  // 2. Fallback / Dev Mode (When SDK is missing)
  // Remove blocking 'confirm' to prevent UI freeze bugs.
  // Just simulate a short delay and grant reward for testing.
  console.log("[TossAds] Dev Mode: Simulating Ad delay...");
  
  setTimeout(() => {
    console.log("[TossAds] Dev Mode: Reward Granted");
    onReward(); 
  }, 1500);
};
