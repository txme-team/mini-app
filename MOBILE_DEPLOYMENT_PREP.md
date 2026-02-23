# Dangdangpang Mobile Deployment Prep

## Done in this round
- Removed bottom debug preview buttons from in-game UI.
- Added PWA manifest: `/Users/doyoulovez/Documents/dangdangpang/public/manifest.webmanifest`
- Added mobile web app metadata in `/Users/doyoulovez/Documents/dangdangpang/index.html`
  - `manifest` link
  - `apple-touch-icon`
  - theme/app title/description tags
- Generated app icons from logo:
  - `/Users/doyoulovez/Documents/dangdangpang/public/icons/app-icon-192.png`
  - `/Users/doyoulovez/Documents/dangdangpang/public/icons/app-icon-512.png`

## Next steps (recommended order)
1. Stabilize production web deployment first (Vercel/Netlify).
2. Wrap web app with Capacitor for iOS/Android package generation.
3. Replace web-only ads with native AdMob SDK integration for store builds.
4. Add app boot/splash and launcher icons per platform guidelines.
5. QA on real devices:
   - safe-area
   - touch latency
   - audio unlock/resume
   - rewarded ad flow
   - app pause/resume state
6. Store prep:
   - privacy policy URL
   - app screenshots and age rating
   - test account and review notes

## Migration note (React Native later)
- Current architecture already separates game logic (`utils/gameLogic.ts`) from UI.
- When migrating to React Native + Expo later, keep logic/services and replace view layer/components incrementally.
