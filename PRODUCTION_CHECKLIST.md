# Production Checklist & Deployment Guide

Your KidzyColor application is refactored and optimized. Follow this checklist to prepare for production deployment.

## 1. Environment Variables
Ensure you have a `.env` file in the project root (not committed to Git) with your production API keys:
```env
VITE_GEMINI_API_KEY=your_production_key_here
```
> **Security Note:** In a strict enterprise environment, AI calls should be proxied through a backend (like Firebase Functions) to hide this key. For this MVP/Client-side app, restricting the key in Google Cloud Console to your domain is sufficient.

## 2. Firebase Security Rules
Deploy your Firestore and Storage rules to secure user data.
Run these commands if you have Firebase CLI installed:
```bash
firebase deploy --only firestore:rules,storage
```
Ensure your locally defined rules (in `firestore.rules` and `storage.rules` if present, or copying from `FIREBASE_SETUP.md`) match what is in the cloud.

## 3. Build & Optimization
We have implemented **Lazy Loading** for all major routes (`Dashboard`, `StoryViewer`, etc.) to speed up initial load time.
To verify the production build:
```bash
npm run build
npm run preview
```
This will create a `dist` folder and serve it locally. Check the console for any build warnings.

## 4. Performance Tuning
- **Images:** The app uses external URLs (Gemini/Firebase). Ensure your Firebase Storage bucket allows caching (default is usually fine).
- **Fonts:** We utilize Google Fonts. These are typically cached well.
- **Lighthouse:** Run a Lighthouse audit in Chrome DevTools on the `npm run preview` version to catch any final CSS/JS bottlenecks.

## 5. Deployment
You can deploy this app to any static host:
- **Firebase Hosting:** `firebase deploy --only hosting` (Requires `firebase init hosting` first).
- **Vercel/Netlify:** Simply connect your Git repository and set the Build Command to `npm run build` and Output Directory to `dist`.

## 6. Known Limits (MVP)
- **PDF Generation:** Currently relies on the browser's `window.print()`. For mobile optimizations, ensure the `@media print` CSS in `index.css` is tuned for your target paper size.
- **Image Storage:** High-res images from "Photoshoot Mode" are now correctly optimized/uploaded to prevent database errors.

## 7. Troubleshooting
- **"Access to storage is not allowed":** If users see this, they are likely blocking 3rd-party cookies. This is a Firebase Auth limitation in `localhost`. It usually resolves on a real domain `https://your-app.com`.
