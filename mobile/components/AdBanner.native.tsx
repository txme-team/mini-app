import React, { useEffect, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  MobileAds,
  TestIds,
} from 'react-native-google-mobile-ads';

const getBannerUnitId = () => {
  const iosUnit = process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS?.trim();
  const androidUnit = process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID?.trim();

  if (__DEV__) return TestIds.BANNER;

  if (Platform.OS === 'ios') {
    return iosUnit && iosUnit.length > 0 ? iosUnit : TestIds.BANNER;
  }

  return androidUnit && androidUnit.length > 0 ? androidUnit : TestIds.BANNER;
};

const AdBanner: React.FC = () => {
  const unitId = useMemo(getBannerUnitId, []);

  useEffect(() => {
    MobileAds().initialize().catch(() => {
      // ignore init failure in fallback scenarios
    });
  }, []);

  return (
    <View style={styles.wrapper}>
      <BannerAd unitId={unitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#7ea9c8',
    backgroundColor: '#d4e8f7',
  },
});

export default AdBanner;
