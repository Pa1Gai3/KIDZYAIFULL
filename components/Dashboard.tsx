
import React, { useEffect, useState } from 'react';
import { User, AppState, SavedStory, SavedPhoto } from '../types';
import { getStories, getPhotos } from '../services/storageService';
import { BookOpen, Image as ImageIcon, Calendar, ArrowRight, RefreshCw } from 'lucide-react';

interface DashboardProps {
  user: User;
  setAppState: (state: AppState) => void;
  onSelectStory: (story: SavedStory) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setAppState, onSelectStory }) => {
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [photos, setPhotos] = useState<SavedPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedStories, fetchedPhotos] = await Promise.all([
          getStories(user.id),
          getPhotos(user.id)
        ]);
        setStories(fetchedStories);
        setPhotos(fetchedPhotos);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-12 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-brand-100" />
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-display font-bold text-slate-900">Hello, {user.name}!</h1>
          <p className="text-slate-500">Member since {new Date().getFullYear()}</p>
        </div>
        <button
          onClick={() => setAppState(AppState.CONFIG)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-200 transition flex items-center"
        >
          Create New Magic <ArrowRight size={18} className="ml-2" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Stories Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6 flex items-center">
              <BookOpen className="mr-2 text-brand-500" /> My Storybooks
            </h2>

            {stories.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-8 text-center border border-dashed border-slate-300">
                <p className="text-slate-500 mb-4">You haven't created any storybooks yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {stories.map(story => (
                  <div key={story.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border border-slate-100 group">
                    <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                      <img src={story.coverUrl} alt={story.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 truncate">{story.title}</h3>
                      <div className="flex items-center text-slate-500 text-xs mt-2">
                        <Calendar size={12} className="mr-1" />
                        {new Date(story.createdAt).toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => onSelectStory(story)}
                        className="w-full mt-4 bg-brand-50 text-brand-600 py-2 rounded-lg text-sm font-bold hover:bg-brand-100 transition"
                      >
                        Read & Color
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photos Section */}
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6 flex items-center">
              <ImageIcon className="mr-2 text-purple-500" /> My Photoshoot Gallery
            </h2>

            {photos.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-8 text-center border border-dashed border-slate-300">
                <p className="text-slate-500 mb-4">No photoshoot images saved yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {photos.map(photo => (
                  <div key={photo.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border border-slate-100 group">
                    <div className="aspect-square bg-slate-100 relative">
                      <img src={photo.url} alt={photo.theme} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition">
                        <a href={photo.url} download target="_blank" rel="noreferrer" className="text-white text-xs font-bold hover:underline">Download</a>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-slate-700 truncate">{photo.theme}</p>
                      <p className="text-[10px] text-slate-400 truncate">{photo.prompt.substring(0, 20)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
