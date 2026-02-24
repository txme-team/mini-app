import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { useRef } from 'react';

const DEFAULT_WEB_URL = __DEV__ ? 'http://127.0.0.1:3000' : 'https://dangdangpang.vercel.app';

type AdBridgePayload = {
  source: 'dangdangpang';
  type: 'SHOW_REWARDED_AD' | 'REWARDED_AD_RESULT';
  requestId: string;
  rewarded?: boolean;
  error?: string;
};

type AdsModuleType = typeof import('react-native-google-mobile-ads');

let adsModule: AdsModuleType | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  adsModule = require('react-native-google-mobile-ads') as AdsModuleType;
} catch {
  adsModule = null;
}

const parseBridgePayload = (raw: string): AdBridgePayload | null => {
  try {
    const data = JSON.parse(raw);
    if (!data || data.source !== 'dangdangpang') return null;
    if (!data.type || !data.requestId) return null;
    return data as AdBridgePayload;
  } catch {
    return null;
  }
};

const getRewardedAdUnitId = (): string => {
  if (!adsModule) return '';
  const { TestIds } = adsModule;
  if (__DEV__) return TestIds.REWARDED;

  const iosUnit = process.env.EXPO_PUBLIC_ADMOB_REWARDED_IOS?.trim();
  const androidUnit = process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID?.trim();
  if (Platform.OS === 'ios') return iosUnit && iosUnit.length > 0 ? iosUnit : TestIds.REWARDED;
  return androidUnit && androidUnit.length > 0 ? androidUnit : TestIds.REWARDED;
};

const showNativeRewardedAd = async (): Promise<boolean> => {
  if (!adsModule) return false;
  const { MobileAds, RewardedAd, RewardedAdEventType, AdEventType } = adsModule;

  await MobileAds().initialize();
  const unitId = getRewardedAdUnitId();
  const ad = RewardedAd.createForAdRequest(unitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  return await new Promise<boolean>((resolve) => {
    let settled = false;
    let earnedReward = false;

    const settle = (rewarded: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      unsubscribe();
      resolve(rewarded);
    };

    const unsubscribe = ad.addAdEventsListener(({ type }) => {
      if (type === RewardedAdEventType.LOADED) {
        ad.show().catch(() => settle(false));
      } else if (type === RewardedAdEventType.EARNED_REWARD) {
        earnedReward = true;
      } else if (type === AdEventType.CLOSED) {
        settle(earnedReward);
      } else if (type === AdEventType.ERROR) {
        settle(false);
      }
    });

    const timer = setTimeout(() => {
      settle(false);
    }, 45000);

    ad.load();
  });
};

export default function App() {
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const gameUrl = useMemo(() => {
    const envUrl = process.env.EXPO_PUBLIC_WEB_URL?.trim();
    return envUrl && envUrl.length > 0 ? envUrl : DEFAULT_WEB_URL;
  }, []);

  const retry = () => {
    setHasError(false);
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const postRewardResult = (payload: AdBridgePayload) => {
    const data = JSON.stringify(payload);
    const js = `
      window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(data)} }));
      true;
    `;
    webViewRef.current?.injectJavaScript(js);
  };

  const onWebViewMessage = async (event: WebViewMessageEvent) => {
    const payload = parseBridgePayload(event.nativeEvent.data);
    if (!payload || payload.type !== 'SHOW_REWARDED_AD') return;

    let rewarded = false;
    let error = '';

    try {
      rewarded = await showNativeRewardedAd();
    } catch (e) {
      rewarded = false;
      error = e instanceof Error ? e.message : 'unknown_error';
    }

    postRewardResult({
      source: 'dangdangpang',
      type: 'REWARDED_AD_RESULT',
      requestId: payload.requestId,
      rewarded,
      error,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#d4e8f7" />

      <WebView
        ref={webViewRef}
        key={reloadKey}
        source={{ uri: gameUrl }}
        style={styles.webView}
        onMessage={onWebViewMessage}
        onLoadStart={() => {
          setIsLoading(true);
          setHasError(false);
        }}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
      />

      {isLoading && !hasError && (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#2f6b9c" />
          <Text style={styles.overlayText}>Loading Dangdangpang...</Text>
        </View>
      )}

      {hasError && (
        <View style={styles.overlay}>
          <Text style={styles.errorTitle}>Connection failed</Text>
          <Text style={styles.errorDesc}>Check network or EXPO_PUBLIC_WEB_URL and retry.</Text>
          <Pressable onPress={retry} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4e8f7',
  },
  webView: {
    flex: 1,
    backgroundColor: '#d4e8f7',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(212,232,247,0.9)',
    paddingHorizontal: 24,
  },
  overlayText: {
    fontSize: 16,
    color: '#1f4e7e',
    fontWeight: '600',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f4e7e',
  },
  errorDesc: {
    fontSize: 14,
    color: '#335e85',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#255683',
    backgroundColor: '#f5c44f',
  },
  retryText: {
    color: '#4a2b0a',
    fontSize: 16,
    fontWeight: '700',
  },
});
