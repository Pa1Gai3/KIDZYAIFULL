# Firebase Security Rules Setup

You are encountering "Missing or insufficient permissions" errors because your Firebase project is likely set to **Locked Mode** or **Production Mode** by default. To fix this and allow valid users to save their stories, you must update your Rules in the Firebase Console.

## 1. Firestore Database Rules

1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Firestore Database** > **Rules** tab.
3. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow users to read/write their OWN data in the 'stories' collection
    match /stories/{storyId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Allow users to read/write their OWN photos
    match /photos/{photoId} {
        allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
        allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    // Default fallback (optional, but good for testing if above fails)
    // ONLY USE TEMPORARILY IF STILL STUCK:
    // match /{document=**} {
    //   allow read, write: if request.auth != null;
    // }
  }
}
```

*Note: If the strict rules above fail initially (due to data structure mismatches), you can temporarily use `allow read, write: if request.auth != null;` for the whole database to verify functionality, then tighten them later.*

## 2. Storage Rules

1. Navigate to **Storage** > **Rules** tab.
2. Replace the existing rules with the following:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Allow authenticated users to upload and read their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Fallback for testing
    // match /{allPaths=**} {
    //   allow read, write: if request.auth != null;
    // }
  }
}
```

## 3. Indexes (If Required)

Sometimes Firestore requires a composite index for sorting by date (`orderBy("createdAt", "desc")`).
- If you see an error link in the Browser Console that says "The query requires an index...", click that link! It will automatically build the index for you.

## Summary
Once you paste these rules and click **Publish**, the "Missing permissions" errors will disappear, and the "Save to Library" feature will work immediately.
