
import React, { useState, useEffect, useCallback } from 'react';
import { Story, PaperSize } from '../types';
import { generatePageImage, generateColorizedImage } from '../services/geminiService';
import PaymentModal from './PaymentModal';
import { RefreshCw, Download, Edit2, ChevronLeft, ChevronRight, Sticker, ShoppingCart, Eye, Star, Save, Printer, Sparkles, Grid } from 'lucide-react';

interface StoryViewerProps {
  story: Story;
  paperSize: PaperSize;
  characterDescription: string;
  isPurchasedExternal: boolean;
  onBack: () => void;
  onSave: (story: Story, isPurchased: boolean) => Promise<void>;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story: initialStory, paperSize, characterDescription, isPurchasedExternal, onBack, onSave }) => {
  const [story, setStory] = useState<Story>(initialStory);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showPip, setShowPip] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [isPurchased, setIsPurchased] = useState(isPurchasedExternal);

  // New States for Color Guide Mode
  const [isGuideMode, setIsGuideMode] = useState(false);
  const [colorGrid, setColorGrid] = useState<string[]>([]);
  const [isGeneratingGrid, setIsGeneratingGrid] = useState(false);

  const currentPage = story.pages[currentPageIndex];

  const generationStarted = React.useRef(false);

  // Serial Background Generation of all pages
  useEffect(() => {
    const generateStoryImagesSequentially = async () => {
      // Prevent double-firing in Strict Mode
      if (generationStarted.current) return;
      generationStarted.current = true;

      const avatarUrl = initialStory.pages[0].imageUrl;

      for (let i = 1; i < initialStory.pages.length; i++) {
        // Resume Support: Skip if image already exists (e.g. loaded from Library)
        if (initialStory.pages[i].imageUrl) continue;

        // We set loading state for specific page
        setStory(prev => ({
          ...prev,
          pages: prev.pages.map((p, idx) => idx === i ? { ...p, isLoadingImage: true } : p)
        }));

        try {
          const page = initialStory.pages[i]; // Use initial config for prompts
          // 1. Generate Line Art
          const { lineArt } = await generatePageImage(page.imagePrompt, paperSize, characterDescription, avatarUrl);

          // 2. Update State
          setStory(prev => ({
            ...prev,
            pages: prev.pages.map((p, idx) => idx === i ? { ...p, imageUrl: lineArt, isLoadingImage: false } : p)
          }));

          // Short delay to be nice to API rate limits
          await new Promise(r => setTimeout(r, 1000));

        } catch (err) {
          console.error(`Failed to generate page ${i}`, err);
          setStory(prev => ({
            ...prev,
            pages: prev.pages.map((p, idx) => idx === i ? { ...p, isLoadingImage: false } : p)
          }));
        }
      }
    };

    generateStoryImagesSequentially();
  }, []); // Run once on mount

  const handleNext = () => {
    if (currentPageIndex < story.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    } else {
      setIsGuideMode(true);
    }
  };

  const handlePrev = () => {
    if (isGuideMode) {
      setIsGuideMode(false);
    } else if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const handleRegenerateImage = async () => {
    if (currentPage.isCover) return;
    setIsRegenerating(true);
    try {
      const referenceImage = story.pages[0].imageUrl;
      const { lineArt } = await generatePageImage(currentPage.imagePrompt, paperSize, characterDescription, referenceImage);
      setStory(prev => ({
        ...prev,
        pages: prev.pages.map((p, idx) =>
          idx === currentPageIndex ? { ...p, imageUrl: lineArt, referenceImageUrl: "" } : p
        )
      }));
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleGenerateColorGuide = async (): Promise<string[]> => {
    if (colorGrid.length > 0) return colorGrid;

    setIsGeneratingGrid(true);
    try {
      const avatarUrl = story.pages[0].imageUrl || ""; // consistency reference
      const newGrid: string[] = [];

      // Add Cover Image (Already Colored)
      if (avatarUrl) newGrid.push(avatarUrl);

      // Colorize Pages 1 to 5 (or however many)
      for (let i = 1; i < story.pages.length; i++) {
        const page = story.pages[i];
        if (page.imageUrl) {
          // Colorize using line art + avatar
          // We use the scene description for context
          const coloredUrl = await generateColorizedImage(page.imageUrl, avatarUrl || "", page.imagePrompt);
          newGrid.push(coloredUrl);
        }
      }
      setColorGrid(newGrid);
      return newGrid;
    } catch (error) {
      console.error("Failed to generate color grid", error);
      alert("Failed to generate the color guide. Please try again.");
      return [];
    } finally {
      setIsGeneratingGrid(false);
    }
  };

  const handleTextEdit = (newText: string) => {
    setStory(prev => ({
      ...prev,
      pages: prev.pages.map((p, idx) =>
        idx === currentPageIndex ? { ...p, text: newText } : p
      )
    }));
  };

  const handleDownloadPDF = async () => {
    if (!isPurchased) {
      setShowPayment(true);
      return;
    }

    if (colorGrid.length === 0) {
      await handleGenerateColorGuide();
      await new Promise(r => setTimeout(r, 1000));
    }
    window.print();
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    setIsPurchased(true);
    try {
      await onSave(story, true);
      alert("Payment Successful! Story saved to your Library.");
      onBack();
    } catch (e) {
      console.error("Auto-save failed", e);
      onBack();
    }
  };

  // --- Render Functions (Defined before usage) ---

  const renderCoverPage = () => (
    <div className="w-full h-full bg-gradient-to-br from-brand-600 to-purple-800 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden print:bg-white print:text-black">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 print:hidden"></div>
      <div className="z-10 text-center w-full max-w-2xl flex flex-col items-center h-full justify-between py-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-4 text-yellow-300 drop-shadow-lg print:text-black print:drop-shadow-none">
            {story.title}
          </h1>
          <p className="text-xl text-white/90 font-light tracking-widest uppercase print:text-black">A Personalized Coloring Adventure</p>
        </div>
        <div className="relative my-6 w-full flex-1 flex items-center justify-center min-h-0">
          <div className="relative p-2 bg-white/10 rounded-2xl backdrop-blur-sm shadow-2xl inline-block max-h-full print:shadow-none print:border-0">
            <img src={currentPage.imageUrl} alt="Cover" className="rounded-xl shadow-lg max-h-[50vh] md:max-h-[60vh] w-auto object-contain border-4 border-white/20 print:border-0 print:shadow-none" />
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-8 py-3 rounded-full mt-4 print:hidden">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="mr-2">⭐</span> {currentPage.text} <span className="ml-2">⭐</span>
          </h2>
        </div>
        <div className="hidden print:block text-xl font-bold mt-4">{currentPage.text}</div>
      </div>
    </div>
  );

  const renderColoringPage = () => (
    <div className="flex-1 flex flex-col h-full print:block print:h-screen print:w-screen print:overflow-hidden print-page-break relative bg-white">
      <div className="relative flex-1 flex items-center justify-center p-4 min-h-0 bg-slate-50 border-b border-slate-100 print:bg-white print:border-0 print:h-[75%]">
        {currentPage.isLoadingImage || isRegenerating ? (
          <div className="flex flex-col items-center text-slate-400 print:hidden">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mb-4"></div>
            <span className="text-sm font-medium">Drawing Line Art...</span>
          </div>
        ) : currentPage.imageUrl ? (
          <div className="relative h-full w-full flex items-center justify-center">
            <img src={currentPage.imageUrl} alt="Coloring Page" className="max-h-full max-w-full object-contain drop-shadow-sm print:drop-shadow-none" />
          </div>
        ) : (
          <div className="text-red-400 text-center p-4 print:hidden">
            <p>Failed to load image.</p>
            <button onClick={handleRegenerateImage} className="text-brand-500 underline mt-2">Retry</button>
          </div>
        )}
        <div className="absolute bottom-4 right-4 flex space-x-2 print:hidden z-20">
          <button onClick={handleRegenerateImage} className="bg-white p-2 rounded-full shadow-md border border-slate-200 text-slate-500 hover:text-brand-600 transition hover:scale-110" title="Regenerate Image"><RefreshCw size={18} className={isRegenerating ? 'animate-spin' : ''} /></button>
        </div>
      </div>
      <div className="bg-white p-6 md:p-8 flex flex-col justify-center items-center text-center shrink-0 print:h-[25%] print:p-4">
        <div className="mb-2 print:hidden w-full flex justify-between">
          <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">Page {currentPageIndex + 1}</span>
        </div>
        <textarea value={currentPage.text} onChange={(e) => handleTextEdit(e.target.value)} className="w-full text-2xl md:text-3xl font-display leading-snug text-slate-800 outline-none resize-none bg-transparent text-center border-none p-0 focus:ring-0 placeholder-slate-200 print:hidden" rows={3} />
        <div className="hidden print:block text-2xl font-display leading-relaxed text-slate-900 px-8">{currentPage.text}</div>
      </div>
    </div>
  );

  const renderColorGuide = () => (
    <div className="w-full h-full bg-slate-50 overflow-y-auto p-4 md:p-8 flex flex-col items-center print:h-screen print:w-screen print:p-0 print:bg-white">
      <div className="max-w-4xl w-full text-center mb-6 print:mb-4">
        <h2 className="text-3xl font-display font-bold text-slate-800 mb-2 print:text-2xl">Magic Color Guide</h2>
        <p className="text-slate-600 print:hidden">Here is your reference for coloring the story!</p>
      </div>
      {colorGrid.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md mx-auto print:hidden">
            <Sparkles className="w-16 h-16 text-brand-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold mb-4">Reveal the Colors!</h3>
            <p className="text-slate-500 mb-6">Create a magical color reference sheet based on your story's artwork.</p>
            <button onClick={handleGenerateColorGuide} disabled={isGeneratingGrid} className="w-full bg-brand-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-700 transition flex items-center justify-center">
              {isGeneratingGrid ? (<><div className="animate-spin rounded-full h-5 w-5 border-2 border-white/50 border-r-white mr-2"></div>Painting Magic...</>) : (<><Grid className="mr-2" />Generate Color Guide</>)}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl print:grid-cols-3 print:gap-2">
          {colorGrid.map((imgUrl, idx) => (
            <div key={idx} className="bg-white p-2 rounded-xl shadow-md border border-slate-100 print:shadow-none print:border-0 break-inside-avoid">
              <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 mb-2 relative">
                <img src={imgUrl} alt={`Scene ${idx}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 bg-black/60 text-white text-[10px] p-1 rounded-tr-lg font-bold">{idx === 0 ? "Cover" : `Page ${idx}`}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Dedicated Print Layout (Hidden on Screen, Visible on Print)
  const renderPrintLayout = () => (
    <div className="hidden print:block w-full h-auto bg-white text-black">

      {/* 1. Cover Page */}
      <div className="w-[297mm] h-[210mm] flex flex-col items-center justify-center p-12 text-center" style={{ pageBreakAfter: 'always' }}>
        <h1 className="text-6xl font-display font-bold text-slate-900 mb-8">{story.title}</h1>
        <div className="w-full max-w-lg aspect-square mb-8">
          <img src={story.pages[0].imageUrl} className="w-full h-full object-contain rounded-xl" />
        </div>
        <p className="text-2xl font-sans text-slate-500 uppercase tracking-widest">A Story for {characterDescription.split(' ')[0] || "You"}</p>
      </div>

      {/* 2. Story Pages (1-5) */}
      {story.pages.filter(p => !p.isCover).map((page, idx) => (
        <div key={idx} className="w-[297mm] h-[210mm] flex items-center justify-between p-16 gap-12" style={{ pageBreakAfter: 'always' }}>
          {/* Left: Image (50%) */}
          <div className="w-1/2 h-full flex items-center justify-center border-4 border-slate-900 rounded-2xl p-4 bg-white">
            <img src={page.imageUrl} className="max-w-full max-h-full object-contain" />
          </div>

          {/* Right: Text (50%) */}
          <div className="w-1/2 h-full flex flex-col justify-center">
            <div className="text-4xl font-display leading-relaxed text-slate-800">
              {page.text}
            </div>
            <div className="mt-8 text-slate-400 font-bold uppercase tracking-widest text-sm">
              Page {idx + 1}
            </div>
          </div>
        </div>
      ))}

      {/* 3. Color Guide (Final Page) */}
      <div className="w-[297mm] h-[210mm] flex flex-col items-center justify-center p-12" style={{ pageBreakAfter: 'auto' }}>
        <h2 className="text-4xl font-display font-bold mb-8">Color Guide</h2>
        <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
          {colorGrid.length > 0 ? colorGrid.map((img, idx) => (
            <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
              <img src={img} className="w-full h-full object-cover" />
            </div>
          )) : (
            <div className="col-span-3 text-center text-slate-400">Color guide not generated.</div>
          )}
        </div>
      </div>

    </div>
  );

  const renderContent = () => {
    if (isGuideMode) return renderColorGuide();
    if (currentPage.isCover) return renderCoverPage();
    return renderColoringPage();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col print:h-auto print:w-full print:p-0">

      {/* Print Layout (Visible only when printing) */}
      {renderPrintLayout()}

      {/* Interactive Layout (Hidden when printing) */}
      <div className="w-full h-full flex flex-col print:hidden">

        {showPayment && (
          <PaymentModal
            itemLabel="Digital Storybook PDF"
            price={99}
            onClose={() => setShowPayment(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 shrink-0 gap-4">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium">
              &larr; Library
            </button>
            <h1 className="text-xl md:text-2xl font-display font-bold text-brand-900 truncate max-w-md">
              {story.title}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSave(story, isPurchased)}
              className="bg-brand-100 hover:bg-brand-200 text-brand-700 px-4 py-2 rounded-xl font-bold flex items-center text-sm transition"
            >
              <Save size={16} className="mr-2" />
              Save to Library
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-brand-600 hover:bg-brand-700 text-white border border-transparent px-4 py-2 rounded-xl font-bold flex items-center text-sm shadow-lg shadow-brand-200 transition transform hover:scale-105"
            >
              {isPurchased ? <Printer size={16} className="mr-2" /> : <Download size={16} className="mr-2" />}
              {isPurchased ? "Print / Download PDF" : "Download PDF (₹99)"}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Main Book Container */}
          <div className="flex-1 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
            {renderContent()}

            {/* Navigation Controls */}
            <div className="bg-slate-50 p-4 flex items-center justify-between border-t border-slate-200 shrink-0 z-20">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition text-slate-700"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex space-x-2 overflow-x-auto px-2">
                {/* Progress Dots */}
                {story.pages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${!isGuideMode && idx === currentPageIndex ? 'w-8 bg-brand-500' : 'w-2 bg-slate-300'}`}
                  />
                ))}
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${isGuideMode ? 'w-8 bg-brand-500' : 'w-2 bg-slate-300'}`}
                  title="Color Guide"
                />
              </div>

              <button
                onClick={handleNext}
                disabled={isGuideMode}
                className="p-3 rounded-full hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition text-slate-700"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
