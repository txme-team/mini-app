import { initAds, showRewardAd } from '../utils/ads';
import { soundService } from '../utils/audio';
import { userDataService } from '../utils/db';
import { AdsService, SoundService, UserDataService } from './contracts';

const adsService: AdsService = {
  init: initAds,
  showRewardAd,
};

export const platformServices: {
  sound: SoundService;
  userData: UserDataService;
  ads: AdsService;
} = {
  sound: soundService,
  userData: userDataService,
  ads: adsService,
};

