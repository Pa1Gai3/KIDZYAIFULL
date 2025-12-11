
import React, { useEffect, useState } from 'react';
import { StoryConfig, GalleryItem } from '../types';
import { generateImageVariation } from '../services/geminiService';
import PaymentModal from './PaymentModal';
import { Download, RefreshCw, ArrowLeft, Image as ImageIcon, Lock } from 'lucide-react';

interface PhotoshootGalleryProps {
  config: StoryConfig;
  onBack: () => void;
  onSavePhoto: (url: string, prompt: string) => void;
}

const SCENARIOS = [
  { label: "Wide Angle Scene", prompt: "Wide angle full body shot, standing confidently in the environment, epic background" },
  { label: "Close-up Portrait", prompt: "Extreme close up portrait, smiling happily, looking at camera, shallow depth of field" },
  { label: "Action Shot", prompt: "Dynamic action pose, running or flying or jumping, high energy, motion blur" },
  { label: "With Companion", prompt: "Interacting with a friendly magical creature or robot or animal relevant to the theme" },
];

const PhotoshootGallery: React.FC<PhotoshootGalleryProps> = ({ config, onBack, onSavePhoto }) => {
  const [items, setItems] = useState<GalleryItem[]>(
    SCENARIOS.map((s, i) => ({
      id: i.toString(),
      label: s.label,
      prompt: s.prompt,
      isLoading: true,
      url: undefined
    }))
  );
  const [showPayment, setShowPayment] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const generateAll = async () => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        // Skip if already generated (prevents regen on re-render if we had persistence here)
        if (item.url) continue;

        try {
          const url = await generateImageVariation(config, item.prompt);
          setItems(prev => prev.map(p => p.id === item.id ? { ...p, url, isLoading: false } : p));
          // Auto save to library
          onSavePhoto(url, item.prompt);
        } catch (e) {
          console.error(`Failed to generate ${item.label}`, e);
          setItems(prev => prev.map(p => p.id === item.id ? { ...p, isLoading: false } : p));
        }
      }
    };
    generateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = (url: string, label: string) => {
    if (!isUnlocked) {
      setShowPayment(true);
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = `kidzy-gallery-${label.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsUnlocked(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {showPayment && (
        <PaymentModal 
          itemLabel="Unlock High-Res Gallery Pack"
          price={99}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
            <button onClick={onBack} className="mr-4 p-2 hover:bg-slate-100 rounded-full transition">
            <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Magic Photoshoot Gallery</h1>
            <p className="text-slate-600">Exclusive AI studio shots of {config.childName} as a {config.theme}</p>
            </div>
        </div>
        {!isUnlocked && (
             <button 
               onClick={() => setShowPayment(true)}
               className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-full font-bold shadow-xl shadow-brand-200 animate-pulse"
             >
                 Unlock All Downloads (₹99)
             </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 flex flex-col">
            <div className="relative aspect-[4/3] bg-slate-100 group">
              {item.isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <RefreshCw className="animate-spin mb-2" size={32} />
                  <span>Developing photo...</span>
                </div>
              ) : item.url ? (
                <img src={item.url} alt={item.label} className={`w-full h-full object-cover ${!isUnlocked ? 'blur-[2px] transition duration-700' : ''}`} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-red-400">
                  <ImageIcon size={32} />
                  <span className="ml-2">Generation Failed</span>
                </div>
              )}

              {/* Overlay */}
              {!item.isLoading && item.url && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDownload(item.url!, item.label)}
                    className={`${isUnlocked ? 'bg-white text-slate-900' : 'bg-brand-600 text-white'} px-6 py-3 rounded-full font-bold flex items-center shadow-xl hover:scale-105 transition`}
                  >
                    {isUnlocked ? <Download size={20} className="mr-2" /> : <Lock size={20} className="mr-2" />}
                    {isUnlocked ? "Download" : "Unlock High-Res"}
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="font-bold text-slate-700">{item.label}</span>
              {!item.isLoading && item.url && (
                <button 
                   onClick={() => handleDownload(item.url!, item.label)}
                   className="text-brand-600 text-sm font-medium hover:underline flex items-center"
                >
                  {isUnlocked ? <Download size={16} className="mr-1" /> : <Lock size={16} className="mr-1" />}
                  High-Res
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoshootGallery;
