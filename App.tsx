
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';

// Lazy Load Heavy Components
const StoryConfigForm = lazy(() => import('./components/StoryConfig'));
const StoryViewer = lazy(() => import('./components/StoryViewer'));
const PhotoshootGallery = lazy(() => import('./components/PhotoshootGallery'));
const Pricing = lazy(() => import('./components/Pricing'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const InfoPage = lazy(() => import('./components/InfoPage'));
import { AppState, StoryConfig, Story, PaperSize, User, SavedStory } from './types';
import { generateStoryOutline } from './services/geminiService';
import { logout } from './services/authService';
import { saveStoryToLibrary, savePhotoToLibrary } from './services/storageService';
import { auth } from './firebase'; // Import Firebase Auth
import { onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [config, setConfig] = useState<StoryConfig | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeInfoPage, setActiveInfoPage] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatarUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email}&background=0ea5e9&color=fff`
        });
        // If we are on login/signup, move to dashboard
        if (appState === AppState.LOGIN || appState === AppState.SIGNUP) {
          setAppState(AppState.DASHBOARD);
        }
      } else {
        setUser(null);
        if (appState === AppState.DASHBOARD) {
          setAppState(AppState.LANDING);
        }
      }
    });

    return () => unsubscribe();
  }, [appState]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAppState(AppState.LANDING);
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    // Explicitly set user to support cases like Mock Auth where the Auth Listener doesn't fire
    setUser(loggedInUser);
    setAppState(AppState.DASHBOARD);
  };

  // Protect the Create flow
  const handleStartStory = () => {
    if (!user) {
      setAppState(AppState.LOGIN);
    } else {
      setAppState(AppState.CONFIG);
    }
  };

  const handleConfigSubmit = async (submission: StoryConfig) => {
    setIsGenerating(true);
    setConfig(submission);
    try {
      const generatedStory = await generateStoryOutline(submission);
      setStory(generatedStory);
      setAppState(AppState.STORY_VIEW);
    } catch (error) {
      alert("Something went wrong creating the magic. The AI might be busy (Rate Limit), please try again in a moment.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePhotoshootMode = (submission: StoryConfig) => {
    setConfig(submission);
    setAppState(AppState.PHOTOSHOOT_GALLERY);
  };

  const handleSaveStory = async (currentStory?: Story, currentPurchased?: boolean) => {
    const storyToSave = currentStory || story;
    const purchasedState = currentPurchased ?? isPurchased;

    if (user && storyToSave && config) {
      setIsSaving(true);
      try {
        await saveStoryToLibrary(user.id, storyToSave, config, purchasedState);
        if (currentStory) setStory(currentStory);
        if (currentPurchased !== undefined) setIsPurchased(currentPurchased);
        // Alert kept for manual saves in header, handled by throw for internal
      } catch (e) {
        alert("Failed to save story. Please try again.");
        console.error(e);
        throw e;
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSelectStory = (savedStory: SavedStory) => {
    setStory(savedStory.storyData);
    setConfig(savedStory.config);
    setIsPurchased(savedStory.isPurchased || false);
    setAppState(AppState.STORY_VIEW);
  };

  const handleSaveGalleryPhoto = async (url: string, prompt: string) => {
    if (user && config) {
      // We don't await this in the UI to keep it snappy, unless explicit save button used
      savePhotoToLibrary(user.id, url, prompt, config.theme).catch(e => console.error("Auto-save failed", e));
    }
  };

  const handleFooterNavigation = (page: string) => {
    setActiveInfoPage(page);
    setAppState(AppState.INFO_PAGE);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Header
        setAppState={setAppState}
        user={user}
        onLogout={handleLogout}
      />

      {/* Added pt-28 (padding top) to account for the larger fixed header */}
      <main className="flex-1 pt-28 print:pt-0">
        <Suspense fallback={<div className="flex h-[50vh] w-full items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-brand-500 border-t-transparent rounded-full"></div></div>}>
          {appState === AppState.LANDING && (
            <Hero onStart={handleStartStory} user={user} />
          )}

          {appState === AppState.LOGIN && (
            <Login setAppState={setAppState} onLoginSuccess={handleLoginSuccess} />
          )}

          {appState === AppState.SIGNUP && (
            <Signup setAppState={setAppState} onLoginSuccess={handleLoginSuccess} />
          )}

          {appState === AppState.DASHBOARD && user && (
            <Dashboard user={user} setAppState={setAppState} onSelectStory={handleSelectStory} />
          )}

          {appState === AppState.CONFIG && (
            <StoryConfigForm
              onSubmit={handleConfigSubmit}
              onPhotoshootMode={handlePhotoshootMode}
              isGenerating={isGenerating}
            />
          )}

          {appState === AppState.STORY_VIEW && story && config && (
            <StoryViewer
              story={story}
              paperSize={config.paperSize}
              characterDescription={config.childName} // Just used for label
              isPurchasedExternal={isPurchased}
              onBack={() => setAppState(AppState.DASHBOARD)}
              onSave={(updatedStory, purchased) => handleSaveStory(updatedStory, purchased)}
            />
          )}

          {appState === AppState.PHOTOSHOOT_GALLERY && config && (
            <PhotoshootGallery
              config={config}
              onBack={() => setAppState(AppState.DASHBOARD)}
              onSavePhoto={handleSaveGalleryPhoto}
            />
          )}

          {appState === AppState.PRICING && (
            <Pricing onBack={() => setAppState(AppState.LANDING)} />
          )}

          {appState === AppState.INFO_PAGE && (
            <InfoPage
              pageKey={activeInfoPage}
              onBack={() => setAppState(AppState.LANDING)}
            />
          )}
        </Suspense>
      </main>

      <Footer onNavigate={handleFooterNavigation} setAppState={setAppState} />

      {isSaving && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl flex items-center space-x-4">
            <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
            <span className="font-bold text-slate-800">Saving to Cloud Library...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
