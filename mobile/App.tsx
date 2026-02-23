import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const DEFAULT_WEB_URL = 'https://dangdangpang.vercel.app';

export default function App() {
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const gameUrl = useMemo(() => {
    const envUrl = process.env.EXPO_PUBLIC_WEB_URL?.trim();
    return envUrl && envUrl.length > 0 ? envUrl : DEFAULT_WEB_URL;
  }, []);

  const retry = () => {
    setHasError(false);
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#d4e8f7" />

      <WebView
        key={reloadKey}
        source={{ uri: gameUrl }}
        style={styles.webView}
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
