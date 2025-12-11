
import { db, storage } from "../firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { SavedStory, SavedPhoto, Story, PaperSize, StoryConfig } from "../types";

// Helper to upload Base64 string to Firebase Storage
const uploadBase64Image = async (userId: string, base64Data: string, folder: 'stories' | 'photos'): Promise<string> => {
  // Create a unique reference
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
  const storageRef = ref(storage, `users/${userId}/${folder}/${fileName}`);

  // Clean base64 string if needed (remove data:image/png;base64, prefix)
  const snapshot = await uploadString(storageRef, base64Data, 'data_url');

  // Get the public URL
  return await getDownloadURL(snapshot.ref);
};

export const saveStoryToLibrary = async (userId: string, story: Story, config: StoryConfig, isPurchased: boolean = false): Promise<SavedStory> => {
  try {
    // 0. Handle Config Images (User Photo) - Prevent 400 Bad Request (Payload too large)
    let finalConfig = { ...config };
    if (finalConfig.photoBase64 && finalConfig.photoBase64.startsWith('data:')) {
      finalConfig.photoBase64 = await uploadBase64Image(userId, finalConfig.photoBase64, 'stories');
    }

    // 1. Upload the cover image to Storage (This part was already here but we can unify loop)
    // We will iterate through ALL pages (including cover at index 0 if it's there) and upload any base64 images.

    // Create a deep copy of pages to modify
    const processedPages = await Promise.all(story.pages.map(async (page) => {
      let finalUrl = page.imageUrl || '';

      // If it's a base64 string, upload it
      if (finalUrl.startsWith('data:')) {
        finalUrl = await uploadBase64Image(userId, finalUrl, 'stories');
      }

      return {
        ...page,
        imageUrl: finalUrl
      };
    }));

    // Reconstruct the story with processed pages (URLs instead of Base64)
    const processedStory = {
      ...story,
      pages: processedPages
    };

    // Also update the top-level coverUrl from the processed first page if available
    const coverUrl = processedPages[0]?.imageUrl || '';

    const newSavedStory: Omit<SavedStory, 'id'> = {
      userId,
      title: story.title,
      coverUrl,
      createdAt: Date.now(),
      storyData: processedStory, // Now contains URLs, so it's lightweight < 1MB
      paperSize: config.paperSize,
      config: finalConfig,
      isPurchased
    };

    // Sanitize to remove undefined values (which Firestore rejects)
    const sanitizedStory = JSON.parse(JSON.stringify(newSavedStory));

    const docRef = await addDoc(collection(db, "stories"), sanitizedStory);

    return { id: docRef.id, ...newSavedStory };
  } catch (e) {
    console.error("Error saving story", e);
    throw e;
  }
};

export const getStories = async (userId: string): Promise<SavedStory[]> => {
  const q = query(
    collection(db, "stories"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedStory));
};

export const savePhotoToLibrary = async (userId: string, base64Url: string, prompt: string, theme: string): Promise<SavedPhoto> => {
  try {
    // 1. Upload to Cloud Storage
    const cloudUrl = await uploadBase64Image(userId, base64Url, 'photos');

    // 2. Save Metadata to Firestore
    const newPhoto: Omit<SavedPhoto, 'id'> = {
      userId,
      url: cloudUrl,
      prompt,
      theme,
      createdAt: Date.now()
    };

    const docRef = await addDoc(collection(db, "photos"), newPhoto);
    return { id: docRef.id, ...newPhoto };
  } catch (e) {
    console.error("Error saving photo", e);
    throw e;
  }
};

export const getPhotos = async (userId: string): Promise<SavedPhoto[]> => {
  const q = query(
    collection(db, "photos"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedPhoto));
};

// New: Record Payment Transaction
export const recordPayment = async (userId: string, amount: number, itemId: string, type: 'STORY' | 'GALLERY') => {
  await addDoc(collection(db, "transactions"), {
    userId,
    amount,
    itemId,
    type,
    status: 'SUCCESS',
    createdAt: Date.now()
  });
};
