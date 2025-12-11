# Fixing CORS for Firebase Storage

To allow your web app (localhost) to access images stored in Firebase Storage (for regeneration and saving), you must configure Cross-Origin Resource Sharing (CORS).

## Step 1: Create cors.json
Create a file named `cors.json` on your computer (you can delete it later) with this content:

```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

## Step 2: Install gsutil (if not installed)
This is part of the Google Cloud SDK. If you don't have it, you can install it, OR use the Google Cloud Console online shell.

**Easier Option (Google Cloud Console):**
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click the **Activate Cloud Shell** icon (top right, looks like `>_`).
3. In the terminal that opens at the bottom, create the file:
   ```bash
   nano cors.json
   ```
   (Paste the JSON content above, then press `Ctrl+O` -> `Enter` to save, `Ctrl+X` to exit).

## Step 3: Run the Command
Run this command in the Cloud Shell:

```bash
gsutil cors set cors.json gs://kidzyaiapp.firebasestorage.app
```

*(Note: Replace `kidzyaiapp.firebasestorage.app` with your actual bucket name if it's different. You can find it in `firebase.ts` under `storageBucket`).*

## Done!
Once this is run, the "Access to storage is not allowed" errors will vanish, and the "Regenerate" button will work for all images.
