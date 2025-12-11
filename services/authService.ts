
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { User } from "../types";

// Helper to map Firebase User to our App User type
const mapUser = (fbUser: FirebaseUser): User => ({
  id: fbUser.uid,
  name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
  email: fbUser.email || '',
  avatarUrl: fbUser.photoURL || `https://ui-avatars.com/api/?name=${fbUser.email}&background=0ea5e9&color=fff`
});

export const getCurrentUser = (): User | null => {
  const fbUser = auth.currentUser;
  return fbUser ? mapUser(fbUser) : null;
};

export const login = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return mapUser(userCredential.user);
};

export const signup = async (name: string, email: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  return mapUser(userCredential.user);
};

export const googleSignIn = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return mapUser(result.user);
  } catch (error: any) {
    console.error("Google Sign In Error", error);
    // We throw the error so the UI can show the specific message (e.g. Domain not authorized)
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};
