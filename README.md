<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run the app locally

This repository is ready to run with Vite + React.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. (Optional) Configure Google AdMob rewarded ads in `.env.local`:
   `VITE_ADMOB_ANDROID_REWARDED_ID=ca-app-pub-xxx/yyy`
   `VITE_ADMOB_IOS_REWARDED_ID=ca-app-pub-xxx/yyy`
   `VITE_ADMOB_TEST_MODE=true`
3. (Optional) Configure Supabase in `.env.local`:
   `VITE_SUPABASE_URL=https://<project-ref>.supabase.co`
   `VITE_SUPABASE_ANON_KEY=<anon-key>`
   `VITE_SUPABASE_SCHEMA=public`
   `VITE_SUPABASE_TABLE=profiles`
4. (Optional) In Supabase SQL Editor, run:
   `supabase/schema.sql`
5. Run the app:
   `npm run dev`
