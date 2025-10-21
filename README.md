APK Toolkit — Ready for Vercel
===============================

What's included
- `index.html` — client UI. Open on the root of the deployed site.
- `api/create.js` — Vercel serverless function (put under `api/`) that proxies requests to the upstream APK conversion service and returns either JSON or binary APKs. CORS enabled.
- `cli/create-apk.js` — simple Node CLI you can run locally.
- This repo is structured for a zero-config deploy to Vercel: push to GitHub, import the repo into Vercel, and it will deploy both the static site and the serverless function automatically.

How to use
1. Upload the ZIP to GitHub (as your repository). Ensure files are at the repo root.
2. Import the repo into Vercel (https://vercel.com/import/git). No extra settings required — Vercel will detect the `api/` folder and deploy the serverless function.
3. Open the deployed site. Use the web UI to create APKs.

Notes and reminders
- This project forwards requests to an external service (`url-to-apk-convert.bjcoderx.workers.dev`). Ensure you have permission to convert and distribute the target site as an APK.
- If the upstream service requires authentication or blocks automated requests, you'll need to add headers or API keys inside `api/create.js` and set environment variables in Vercel.
- For production, replace `Access-Control-Allow-Origin: '*'` with your domain for improved security.
