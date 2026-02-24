type ListenerHandle = { remove: () => Promise<void> | void };

type AdMobPlugin = {
  initialize?: (options?: Record<string, unknown>) => Promise<unknown>;
  prepareRewardVideoAd?: (options: {
    adId: string;
    isTesting?: boolean;
    npa?: boolean;
  }) => Promise<unknown>;
  showRewardVideoAd?: () => Promise<unknown>;
  addListener?: (eventName: string, callback: (event?: any) => void) => Promise<ListenerHandle> | ListenerHandle;
};

declare global {
  interface Window {
    Capacitor?: {
      getPlatform?: () => string;
      isNativePlatform?: () => boolean;
      Plugins?: {
        AdMob?: AdMobPlugin;
      };
    };
    ReactNativeWebView?: {
      postMessage?: (data: string) => void;
    };
  }
}

const DEFAULT_ANDROID_REWARDED_ID = 'ca-app-pub-3940256099942544/5224354917';
const DEFAULT_IOS_REWARDED_ID = 'ca-app-pub-3940256099942544/1712485313';

const ENV_ANDROID_REWARDED_ID = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMOB_ANDROID_REWARDED_ID) ||
  DEFAULT_ANDROID_REWARDED_ID
).trim();

const ENV_IOS_REWARDED_ID = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMOB_IOS_REWARDED_ID) ||
  DEFAULT_IOS_REWARDED_ID
).trim();

const ENV_ADMOB_TEST_MODE = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMOB_TEST_MODE) ||
  'true'
).trim().toLowerCase();

let admobInitPromise: Promise<void> | null = null;
let rnRewardRequestSeq = 0;

const isLocalWeb = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

const isReactNativeWebView = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ReactNativeWebView?.postMessage === 'function';
};

const getPlatform = (): string => {
  if (typeof window === 'undefined' || !window.Capacitor) return 'web';
  if (typeof window.Capacitor.getPlatform === 'function') return window.Capacitor.getPlatform();
  return 'web';
};

const isNativeApp = (): boolean => {
  if (typeof window === 'undefined' || !window.Capacitor) return false;
  if (typeof window.Capacitor.isNativePlatform === 'function') return window.Capacitor.isNativePlatform();
  return getPlatform() !== 'web';
};

const getAdMobPlugin = (): AdMobPlugin | null => {
  if (typeof window === 'undefined' || !window.Capacitor?.Plugins?.AdMob) return null;
  return window.Capacitor.Plugins.AdMob;
};

const isTestingMode = (): boolean => {
  return ENV_ADMOB_TEST_MODE !== 'false';
};

const getRewardedAdUnitId = (): string => {
  const platform = getPlatform();
  return platform === 'ios' ? ENV_IOS_REWARDED_ID : ENV_ANDROID_REWARDED_ID;
};

const ensureAdMobInitialized = async (): Promise<void> => {
  if (!isNativeApp()) return;

  const plugin = getAdMobPlugin();
  if (!plugin || typeof plugin.initialize !== 'function') {
    throw new Error('AdMob plugin not found. Install and register AdMob plugin in native app.');
  }

  if (!admobInitPromise) {
    admobInitPromise = plugin.initialize({
      initializeForTesting: isTestingMode(),
    }).then(() => undefined);
  }

  return admobInitPromise;
};

const addAdMobListener = async (
  eventName: string,
  callback: (event?: any) => void
): Promise<ListenerHandle | null> => {
  const plugin = getAdMobPlugin();
  if (!plugin?.addListener) return null;
  const handle = await plugin.addListener(eventName, callback);
  return handle || null;
};

const cleanupListeners = async (handles: Array<ListenerHandle | null>) => {
  for (const handle of handles) {
    try {
      if (handle && typeof handle.remove === 'function') {
        await handle.remove();
      }
    } catch {
      // No-op
    }
  }
};

export const initAds = () => {
  if (isReactNativeWebView()) {
    console.log('[AdBridge] React Native WebView mode: native rewarded ads enabled.');
    return;
  }

  if (!isNativeApp()) {
    console.log('[AdMob] Web mode: native ads are disabled.');
    return;
  }

  ensureAdMobInitialized()
    .then(() => {
      console.log('[AdMob] Initialized');
    })
    .catch((err) => {
      console.warn('[AdMob] Init failed:', err);
    });
};

const parseMessagePayload = (raw: unknown): any | null => {
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (typeof raw === 'object') {
    const maybeWrapped = raw as { data?: unknown };
    if (typeof maybeWrapped.data === 'string') {
      try {
        return JSON.parse(maybeWrapped.data);
      } catch {
        return null;
      }
    }
    return raw;
  }
  return null;
};

const requestRewardFromReactNativeWebView = (onReward: () => void, onDismiss: () => void) => {
  if (!isReactNativeWebView()) {
    onDismiss();
    return;
  }

  const requestId = `rn-reward-${Date.now()}-${rnRewardRequestSeq++}`;
  let settled = false;

  const cleanup = () => {
    window.removeEventListener('message', onMessage as EventListener);
    document.removeEventListener('message', onMessage as EventListener);
    clearTimeout(timeoutId);
  };

  const settleReward = () => {
    if (settled) return;
    settled = true;
    cleanup();
    onReward();
  };

  const settleDismiss = () => {
    if (settled) return;
    settled = true;
    cleanup();
    onDismiss();
  };

  const onMessage = (event: MessageEvent) => {
    const payload = parseMessagePayload(event.data);
    if (!payload || payload.source !== 'dangdangpang') return;
    if (payload.type !== 'REWARDED_AD_RESULT' || payload.requestId !== requestId) return;

    if (payload.rewarded) settleReward();
    else settleDismiss();
  };

  window.addEventListener('message', onMessage as EventListener);
  document.addEventListener('message', onMessage as EventListener);

  const timeoutId = window.setTimeout(() => {
    settleDismiss();
  }, 90000);

  try {
    window.ReactNativeWebView!.postMessage!(
      JSON.stringify({
        source: 'dangdangpang',
        type: 'SHOW_REWARDED_AD',
        requestId,
      })
    );
  } catch (error) {
    console.warn('[AdBridge] Failed to request native rewarded ad:', error);
    settleDismiss();
  }
};

/**
 * Shows rewarded ad.
 * - Native app: Google AdMob rewarded
 * - Local web dev: simulated reward fallback
 * - Non-local web: dismiss
 */
export const showRewardAd = (onReward: () => void, onDismiss: () => void) => {
  const run = async () => {
    if (isReactNativeWebView()) {
      requestRewardFromReactNativeWebView(onReward, onDismiss);
      return;
    }

    if (!isNativeApp()) {
      if (!isLocalWeb()) {
        onDismiss();
        return;
      }

      console.log('[AdMob] Web dev mode: simulating rewarded ad.');
      setTimeout(() => onReward(), 1200);
      return;
    }

    const plugin = getAdMobPlugin();
    if (!plugin || typeof plugin.prepareRewardVideoAd !== 'function' || typeof plugin.showRewardVideoAd !== 'function') {
      console.warn('[AdMob] Rewarded API is unavailable in current native runtime.');
      onDismiss();
      return;
    }

    let rewarded = false;
    let settled = false;
    const listenerHandles: Array<ListenerHandle | null> = [];

    const settleReward = async () => {
      if (settled) return;
      settled = true;
      await cleanupListeners(listenerHandles);
      onReward();
    };

    const settleDismiss = async () => {
      if (settled) return;
      settled = true;
      await cleanupListeners(listenerHandles);
      onDismiss();
    };

    listenerHandles.push(await addAdMobListener('onRewardedVideoAdReward', async () => {
      rewarded = true;
      await settleReward();
    }));
    listenerHandles.push(await addAdMobListener('onRewardedVideoAdDismissed', async () => {
      if (!rewarded) {
        await settleDismiss();
      }
    }));
    listenerHandles.push(await addAdMobListener('onRewardedVideoAdFailedToLoad', async () => {
      await settleDismiss();
    }));
    listenerHandles.push(await addAdMobListener('onRewardedVideoAdFailedToShow', async () => {
      await settleDismiss();
    }));

    try {
      await ensureAdMobInitialized();

      const adId = getRewardedAdUnitId();
      console.log(`[AdMob] Requesting rewarded ad (${getPlatform()})`);

      await plugin.prepareRewardVideoAd({
        adId,
        isTesting: isTestingMode(),
      });
      await plugin.showRewardVideoAd();

      setTimeout(async () => {
        if (!settled && !rewarded) {
          await settleDismiss();
        }
      }, 25000);
    } catch (error) {
      console.error('[AdMob] Rewarded flow failed:', error);
      await settleDismiss();
    }
  };

  void run();
};
