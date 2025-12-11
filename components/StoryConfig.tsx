

import React, { useState, ChangeEvent, useRef } from 'react';
import { StoryConfig, THEME_CATEGORIES, PaperSize } from '../types';
import { Camera, Sparkles, ArrowRight, RefreshCw, Palette, Download, BookOpen, Grid, UploadCloud, User as UserIcon } from 'lucide-react';
import { generateRealisticAvatar } from '../services/geminiService';

interface StoryConfigProps {
  onSubmit: (config: StoryConfig) => void;
  onPhotoshootMode: (config: StoryConfig) => void;
  isGenerating: boolean;
}

const StoryConfigForm: React.FC<StoryConfigProps> = ({ onSubmit, onPhotoshootMode, isGenerating }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [config, setConfig] = useState<StoryConfig>({
    childName: '',
    age: 5,
    gender: 'Boy',
    theme: '',
    paperSize: PaperSize.SQUARE,
    buddyName: '',
    buddyType: '',
    description: '',
    photoBase64: undefined,
    avatarUrl: undefined
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, photoBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePhotoshoot = async () => {
    if (!config.photoBase64 || !config.theme) return;
    setIsAvatarLoading(true);
    try {
      const { imageUrl, description } = await generateRealisticAvatar(config);
      setConfig(prev => ({ 
        ...prev, 
        avatarUrl: imageUrl,
        description: description 
      }));
      setStep(2);
    } catch (error) {
      console.error("Photoshoot generation error details:", error);
      alert("Failed to create magic photoshoot. Please ensure the photo is clear.");
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const handleDownloadAvatar = () => {
    if (config.avatarUrl) {
      const link = document.createElement('a');
      link.href = config.avatarUrl;
      link.download = `${config.childName}-${config.theme}-photoshoot.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-16 animate-fade-in-up">
        {/* Main Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-brand-900/5 border border-slate-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 via-purple-600 to-magic-500 p-6 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                 <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                   <Camera size={24} className="text-white md:w-7 md:h-7" />
                 </div>
                 <h2 className="text-xl md:text-3xl font-display font-bold">Step 1: The Magic Photoshoot</h2>
              </div>
              <p className="opacity-90 text-sm md:text-lg font-medium pl-12 md:pl-14">Let's turn your child into their dream character.</p>
            </div>
          </div>

          <div className="p-4 md:p-10 space-y-6 md:space-y-12">
            
            {/* Top Section: Photo + Details (Horizontal Layout on Mobile) */}
            <div className="flex flex-row md:grid md:grid-cols-12 gap-4 md:gap-12 items-start">
              
              {/* Photo Upload - Compact Left Side on Mobile */}
              <div className="w-[35%] md:w-auto md:col-span-4 shrink-0 space-y-2 md:space-y-3">
                <label className="text-[10px] md:text-sm font-bold text-slate-700 ml-1 flex items-center whitespace-nowrap">
                  <UploadCloud size={12} className="mr-1 md:mr-2 text-brand-500 md:w-4 md:h-4" />
                  <span className="md:hidden">Photo</span>
                  <span className="hidden md:inline">Upload Photo</span>
                </label>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-square rounded-2xl md:rounded-3xl border-2 border-dashed transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    config.photoBase64 
                      ? 'border-brand-500 p-0.5 md:p-1 bg-white shadow-lg shadow-brand-100' 
                      : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'
                  }`}
                >
                    {config.photoBase64 ? (
                      <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden group-hover:opacity-90 transition">
                         <img src={config.photoBase64} alt="Upload" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                            <span className="text-white font-bold text-[10px] md:text-sm bg-black/20 backdrop-blur px-2 py-1 rounded-full">Change</span>
                         </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-brand-500 transition">
                        <div className="bg-slate-100 group-hover:bg-brand-50 p-3 md:p-5 rounded-full mb-2 md:mb-3 transition">
                            <Camera size={20} className="md:w-8 md:h-8" />
                        </div>
                        <span className="text-[10px] md:text-sm font-bold text-center leading-tight">Click to<br className="md:hidden"/> Upload</span>
                      </div>
                    )}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                </div>
                <p className="hidden md:block text-xs text-center text-slate-400 font-medium">Use a clear, front-facing photo.</p>
              </div>

              {/* Right Column: Details Form (Dense Grid on Mobile) */}
              <div className="flex-1 md:col-span-8 space-y-3 md:space-y-6">
                
                {/* Name Row */}
                <div className="space-y-1 md:space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-slate-700 ml-1">Name</label>
                    <input 
                      type="text" 
                      value={config.childName}
                      onChange={e => setConfig({...config, childName: e.target.value})}
                      className="w-full px-3 py-2 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white focus:ring-2 md:focus:ring-4 focus:ring-brand-500/10 outline-none transition font-medium text-sm md:text-base"
                      placeholder="e.g. Aarav"
                    />
                </div>

                {/* Age & Gender Row */}
                <div className="grid grid-cols-2 gap-3 md:gap-5">
                  <div className="space-y-1 md:space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-slate-700 ml-1">Age</label>
                    <input 
                      type="number" 
                      value={config.age}
                      onChange={e => setConfig({...config, age: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white focus:ring-2 md:focus:ring-4 focus:ring-brand-500/10 outline-none transition font-medium text-sm md:text-base"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <label className="text-[10px] md:text-sm font-bold text-slate-700 ml-1">Gender</label>
                    <div className="relative">
                      <select 
                        value={config.gender}
                        onChange={e => setConfig({...config, gender: e.target.value})}
                        className="w-full px-3 py-2 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white focus:ring-2 md:focus:ring-4 focus:ring-brand-500/10 outline-none transition appearance-none font-medium cursor-pointer text-sm md:text-base"
                      >
                        <option value="Boy">Boy</option>
                        <option value="Girl">Girl</option>
                      </select>
                      <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                </div>

                {/* Book Size Row */}
                <div className="space-y-1 md:space-y-2">
                     <label className="text-[10px] md:text-sm font-bold text-slate-700 ml-1">Book Size</label>
                     <div className="relative">
                        <select 
                            value={config.paperSize}
                            onChange={e => setConfig({...config, paperSize: e.target.value as PaperSize})}
                            className="w-full px-3 py-2 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white focus:ring-2 md:focus:ring-4 focus:ring-brand-500/10 outline-none transition appearance-none font-medium cursor-pointer text-sm md:text-base"
                          >
                            {Object.values(PaperSize).map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-3 h-3 md:w-4 md:h-4" />
                     </div>
                </div>
                
                {/* AI Tip Box (Hidden on mobile to save space) */}
                <div className="hidden md:flex bg-sky-50 border border-sky-100 p-5 rounded-2xl items-start gap-4">
                  <div className="bg-sky-100 p-2 rounded-lg text-sky-600 shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <p className="text-sm text-sky-900 leading-relaxed pt-1">
                    <span className="font-bold">Magic Analysis:</span> Our AI will automatically analyze your photo to capture facial features like hair color, eye shape, and smile to keep the character consistent!
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 my-6 md:my-8"></div>

            {/* Theme Selection */}
            <div className="space-y-4 md:space-y-6">
              <label className="text-lg md:text-xl font-display font-bold text-slate-900 flex items-center">
                <Palette className="mr-2 text-magic-500 w-5 h-5 md:w-6 md:h-6" /> 
                Choose a Theme
              </label>
              
              <div className="h-80 md:h-96 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-6 md:space-y-8">
                  {Object.entries(THEME_CATEGORIES).map(([category, themes]) => (
                    <div key={category}>
                      <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 md:mb-4 flex items-center">
                        <span className="w-1 h-1 bg-slate-400 rounded-full mr-2"></span>
                        {category}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                        {themes.map(theme => (
                          <button
                            key={theme}
                            onClick={() => setConfig({...config, theme})}
                            className={`px-3 py-2 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-medium text-left transition-all duration-200 relative overflow-hidden group ${
                              config.theme === theme 
                                ? 'bg-gradient-to-br from-brand-500 to-magic-500 text-white shadow-lg shadow-brand-500/30 scale-105 ring-offset-2 ring-offset-white' 
                                : 'bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100'
                            }`}
                          >
                            <span className="relative z-10">{theme}</span>
                            {config.theme === theme && <Sparkles className="absolute top-1 right-1 opacity-20 text-white w-6 h-6 md:w-8 md:h-8" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="pt-4 md:pt-6">
              <button 
                onClick={handleGeneratePhotoshoot}
                disabled={isAvatarLoading || !config.photoBase64 || !config.theme || !config.childName}
                className="w-full bg-slate-900 hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-base md:text-xl font-bold py-4 md:py-5 rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-brand-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3 group"
              >
                {isAvatarLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-white/50 border-r-2 border-r-white"></div>
                    <span>Casting Magic Spell...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="text-yellow-300 group-hover:animate-pulse md:w-6 md:h-6" />
                    <span>Generate Magic Photoshoot</span>
                  </>
                )}
              </button>
              {!config.photoBase64 && (
                <p className="text-center text-red-400/80 text-xs md:text-sm mt-3 md:mt-4 font-medium animate-pulse">
                  * Please upload a photo to start the magic
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // STEP 2: The Reveal (Updated Design)
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/50 overflow-hidden relative">
         
         {/* Decorative Background */}
         <div className="absolute top-0 inset-x-0 h-48 md:h-64 bg-slate-900"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>

         <div className="relative z-10 px-6 md:px-12 pt-8 md:pt-12 pb-12 md:pb-16">
           
           {/* Header */}
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 text-white">
              <div>
                <div className="flex items-center space-x-2 mb-2 text-brand-300 font-bold uppercase tracking-wider text-xs md:text-sm">
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
                  <span>Photoshoot Complete</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold">The Reveal</h2>
                <p className="opacity-80 text-base md:text-lg mt-2 font-light">Here is {config.childName} transformed into a {config.theme}!</p>
              </div>
              <button 
                onClick={() => setStep(1)} 
                className="mt-6 md:mt-0 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-xs md:text-sm font-bold transition border border-white/10 w-fit"
              >
                Change Settings
              </button>
           </div>

           <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
               
                {/* Left: Avatar Card */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative group perspective-1000 mb-6 md:mb-8 w-full max-w-[320px] md:max-w-[400px]">
                     <div className="aspect-square bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border-4 md:border-8 border-white ring-1 ring-slate-100 relative transform transition duration-500 group-hover:scale-[1.02]">
                        {config.avatarUrl ? (
                          <img src={config.avatarUrl} alt="Generated Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">No Image</div>
                        )}
                        
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-24">
                          <p className="text-white font-bold text-xl md:text-2xl font-display tracking-wide">{config.theme}</p>
                        </div>
                     </div>
                     
                     {/* Sticker Badge */}
                     <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-yellow-400 text-yellow-950 font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-xl rotate-12 border-2 border-white z-20 flex items-center gap-1 text-xs md:text-sm">
                       <Sparkles size={14} fill="currentColor" className="md:w-4 md:h-4" /> Real AI Magic
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full max-w-[320px] md:max-w-[400px]">
                     <button 
                       onClick={handleDownloadAvatar}
                       className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 md:py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm md:text-base"
                     >
                        <Download size={16} className="md:w-[18px]" />
                        Download
                     </button>
                     <button 
                       onClick={handleGeneratePhotoshoot}
                       disabled={isAvatarLoading}
                       className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 md:py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm md:text-base"
                       title="Regenerate"
                     >
                        <RefreshCw size={16} className={isAvatarLoading ? 'animate-spin md:w-[18px]' : 'md:w-[18px]'} />
                        Retake
                     </button>
                  </div>
                </div>

                {/* Right: Path Selection */}
                <div className="lg:col-span-7 flex flex-col justify-center space-y-4 md:space-y-6 pt-4">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Choose Your Adventure</h3>
                    
                    {/* Path 1: Storybook */}
                    <div 
                      onClick={() => !isGenerating && onSubmit(config)}
                      className={`group relative bg-white border-2 border-slate-100 hover:border-brand-500 rounded-2xl md:rounded-[2rem] p-6 md:p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-brand-900/10 flex items-center gap-4 md:gap-6 overflow-hidden ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                       <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-brand-100 transition-colors"></div>
                       
                       <div className="bg-brand-50 group-hover:bg-brand-500 group-hover:text-white p-4 md:p-5 rounded-2xl text-brand-600 transition-colors duration-300 relative z-10 shrink-0">
                          <BookOpen size={28} className="md:w-9 md:h-9" />
                       </div>
                       
                       <div className="flex-1 relative z-10">
                          <h4 className="text-lg md:text-2xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">Create Color Storybook</h4>
                          <p className="text-slate-500 mt-1 md:mt-2 font-medium text-xs md:text-base">Generate a 5-page adventure story with custom coloring pages featuring this character.</p>
                       </div>
                       
                       <div className="bg-slate-100 text-slate-400 group-hover:bg-brand-500 group-hover:text-white p-2 md:p-3 rounded-full transition-all duration-300 transform group-hover:translate-x-1 relative z-10 shrink-0">
                          {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <ArrowRight size={20} className="md:w-6 md:h-6" />}
                       </div>
                    </div>

                    {/* Path 2: Photoshoot Gallery */}
                    <div 
                      onClick={() => onPhotoshootMode(config)}
                      className="group relative bg-white border-2 border-slate-100 hover:border-magic-500 rounded-2xl md:rounded-[2rem] p-6 md:p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-magic-900/10 flex items-center gap-4 md:gap-6 overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 w-32 h-32 bg-magic-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-magic-100 transition-colors"></div>

                       <div className="bg-magic-50 group-hover:bg-magic-500 group-hover:text-white p-4 md:p-5 rounded-2xl text-magic-600 transition-colors duration-300 relative z-10 shrink-0">
                          <Grid size={28} className="md:w-9 md:h-9" />
                       </div>
                       
                       <div className="flex-1 relative z-10">
                          <h4 className="text-lg md:text-2xl font-bold text-slate-900 group-hover:text-magic-600 transition-colors">Enter Magic Gallery</h4>
                          <p className="text-slate-500 mt-1 md:mt-2 font-medium text-xs md:text-base">Generate 4 more studio portraits: Action shots, close-ups, and playful scenes.</p>
                       </div>
                       
                       <div className="bg-slate-100 text-slate-400 group-hover:bg-magic-500 group-hover:text-white p-2 md:p-3 rounded-full transition-all duration-300 transform group-hover:translate-x-1 relative z-10 shrink-0">
                          <ArrowRight size={20} className="md:w-6 md:h-6" />
                       </div>
                    </div>

                </div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default StoryConfigForm;
