
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Video as VideoIcon, HelpCircle, X } from 'lucide-react';
import { AppState } from './types';
import { TUTORIAL_STEPS } from './constants';
import { STYLE_CATEGORIES } from './utils';
import { useTypeMotion } from './hooks/useTypeMotion';
import { ApiKeyDialog } from './components/ApiKeyDialog';
import { TutorialOverlay } from './components/TutorialOverlay';
import { HeroCarousel } from './components/HeroCarousel';
import { CreativeStudio } from './components/CreativeStudio';
import { GenerationView } from './components/GenerationView';

const App: React.FC = () => {
  const {
    state,
    progress,
    loadingStepText,
    statusMessage,
    isGifGenerating,
    isWebMGenerating,
    isSuggestingStyle,
    inputText, setInputText,
    inputStyle, setInputStyle,
    typographyPrompt, setTypographyPrompt,
    resolution, setResolution,
    referenceImage, setReferenceImage,
    selectedStyleCategory, setSelectedStyleCategory,
    imageSrc,
    videoSrc,
    startProcess,
    handleStyleSuggestion,
    reset,
    handleDownloadVideo,
    handleDownloadGif,
    handleFileChange
  } = useTypeMotion();

  const [viewMode, setViewMode] = useState<'gallery' | 'create'>('gallery');
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [tutorialStep, setTutorialStep] = useState<number | null>(null);

  // Initialize tutorial on first load
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('typemotion_onboarded');
    if (!hasSeenTutorial) {
      setTimeout(() => setTutorialStep(0), 2000);
    }
    // Set default category
    setSelectedStyleCategory(STYLE_CATEGORIES[0]);
  }, [setSelectedStyleCategory]);

  const handleSelectKey = async () => {
    setShowKeyDialog(false);
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      if (state === AppState.IDLE && viewMode === 'gallery') {
         setViewMode('create');
      }
    }
  };

  const checkKeyAndGetKey = async (): Promise<boolean> => {
    return await window.aistudio?.hasSelectedApiKey();
  }

  const handleMainCta = async () => {
    const isKeySelected = await checkKeyAndGetKey();
    if (!isKeySelected) {
      setShowKeyDialog(true);
    } else {
      setViewMode('create');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startProcess(checkKeyAndGetKey, () => setShowKeyDialog(true));
  };

  const isFlip = viewMode === 'create';

  const handleNextTutorial = () => {
    if (tutorialStep === null) return;
    if (tutorialStep === 0 && !isFlip) {
      setViewMode('create');
      setTimeout(() => setTutorialStep(1), 1000);
    } else if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      localStorage.setItem('typemotion_onboarded', 'true');
      setTutorialStep(null);
    }
  };

  const renderAppContent = () => {
    if (state === AppState.GENERATING_IMAGE || state === AppState.GENERATING_VIDEO || state === AppState.PLAYING || state === AppState.ERROR) {
      return (
        <GenerationView
          state={state}
          progress={progress}
          loadingStepText={loadingStepText}
          imageSrc={imageSrc}
          videoSrc={videoSrc}
          resolution={resolution}
          statusMessage={statusMessage}
          isGifGenerating={isGifGenerating}
          isWebMGenerating={isWebMGenerating}
          onReset={reset}
          onDownloadVideo={handleDownloadVideo}
          onDownloadGif={handleDownloadGif}
        />
      );
    }

    return (
      <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-12 bg-white dark:bg-zinc-950">
        <div className="flex flex-col gap-1 mb-10">
          <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">Creative Studio</h2>
          <p className="text-stone-500 text-sm font-medium">Define your vision and let AI craft the cinematic reveal.</p>
        </div>

        <CreativeStudio 
          inputText={inputText}
          setInputText={setInputText}
          inputStyle={inputStyle}
          setInputStyle={setInputStyle}
          typographyPrompt={typographyPrompt}
          setTypographyPrompt={setTypographyPrompt}
          resolution={resolution}
          setResolution={setResolution}
          referenceImage={referenceImage}
          setReferenceImage={setReferenceImage}
          selectedStyleCategory={selectedStyleCategory}
          setSelectedStyleCategory={setSelectedStyleCategory}
          isSuggestingStyle={isSuggestingStyle}
          handleStyleSuggestion={handleStyleSuggestion}
          handleFileChange={handleFileChange}
          onSubmit={handleFormSubmit}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-700 overflow-x-hidden selection:bg-stone-900 selection:text-white">
      <ApiKeyDialog isOpen={showKeyDialog} onClose={() => setShowKeyDialog(false)} onSelect={handleSelectKey} />
      
      {tutorialStep !== null && (
        <TutorialOverlay 
          step={tutorialStep} 
          onNext={handleNextTutorial} 
          onPrev={() => setTutorialStep(Math.max(0, tutorialStep - 1))} 
          onClose={() => {
            localStorage.setItem('typemotion_onboarded', 'true');
            setTutorialStep(null);
          }} 
        />
      )}

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
        <div className={`transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] w-full flex flex-col lg:flex-row items-center justify-center ${isFlip ? 'max-w-7xl gap-0' : 'max-w-7xl gap-12 lg:gap-24'}`}>
          
          {/* Landing Text Section */}
          <div className={`flex flex-col justify-center space-y-8 z-10 text-center lg:text-left transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] origin-center flex-shrink-0 ${isFlip ? 'max-h-0 opacity-0 -translate-y-20 lg:max-h-[900px] lg:w-0 lg:translate-y-0 lg:-translate-x-40 invisible' : 'max-h-[1000px] opacity-100 translate-y-0 lg:w-5/12 lg:translate-x-0'}`}>
             <div className="min-w-[320px] lg:w-[500px]">
                <div className="space-y-6">
                  <div className="font-black text-2xl tracking-tighter text-stone-900 dark:text-white flex items-center justify-center lg:justify-start gap-3">
                      <div className="w-10 h-10 bg-stone-900 dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white dark:text-stone-900 text-lg font-serif italic">T</span>
                      </div>
                      <span className="uppercase tracking-[0.2em] text-sm font-black">TypeMotion</span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-black text-stone-900 dark:text-white tracking-tighter leading-[0.9]">Beyond <br/> <span className="text-stone-300 dark:text-zinc-800">Static.</span></h1>
                  <p className="text-xl text-stone-500 dark:text-stone-400 font-medium leading-relaxed max-w-sm mx-auto lg:mx-0">High-fidelity 3D text animations generated from pure thought. Cinematic motion at your fingertips.</p>
               </div>
               <div className="pt-12 flex flex-col items-center lg:items-start gap-4">
                  <button onClick={handleMainCta} className="group px-10 py-5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xl font-black rounded-2xl hover:bg-stone-800 dark:hover:bg-white transition-all shadow-[0_25px_60px_-10px_rgba(0,0,0,0.3)] active:scale-95 flex items-center gap-4 uppercase tracking-widest">
                    <VideoIcon size={22} className="group-hover:text-amber-400 transition-colors" /> Enter Studio
                  </button>
                  <button onClick={() => setTutorialStep(0)} className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-2 py-2">
                    <HelpCircle size={14} /> How it works
                  </button>
               </div>
             </div>
          </div>

          {/* Studio Container with Flip Effect */}
          <div className={`relative z-20 [perspective:3000px] transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isFlip ? 'w-full h-[85vh]' : 'w-full lg:w-7/12 h-[500px] lg:h-[650px]'}`}>
             <div className={`relative w-full h-full transition-all duration-1000 [transform-style:preserve-3d] shadow-[0_60px_150px_-30px_rgba(0,0,0,0.5)] rounded-[40px] ${isFlip ? '[transform:rotateY(180deg)]' : ''}`}>
                
                {/* Front Side: Gallery/Showcase */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-black rounded-[40px] overflow-hidden border border-white/5">
                   <HeroCarousel forceMute={isFlip} />
                </div>
                
                {/* Back Side: Creation Studio */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white dark:bg-zinc-950 rounded-[40px] overflow-hidden border border-stone-100 dark:border-zinc-800">
                   <div className="absolute top-6 right-6 z-[60] flex gap-2">
                    <button 
                      onClick={() => setTutorialStep(0)} 
                      className="p-3 bg-stone-50 dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-400 dark:text-stone-500 rounded-2xl transition-all shadow-sm border border-stone-100 dark:border-zinc-800 active:scale-90" 
                      title="Tutorial"
                    >
                      <HelpCircle size={20} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => setViewMode('gallery')} 
                      className="p-3 bg-stone-50 dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-400 dark:text-stone-500 rounded-2xl transition-all shadow-sm border border-stone-100 dark:border-zinc-800 active:scale-90" 
                      title="Exit Studio"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                   </div>
                   {renderAppContent()}
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <footer className="w-full py-8 text-center text-[10px] text-stone-400 dark:text-zinc-600 font-bold tracking-[0.3em] uppercase z-10">
        <a href="https://x.com/GeokenAI" target="_blank" rel="noopener noreferrer" className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Digital Craft by @GeokenAI</a>
      </footer>
    </div>
  );
};

export default App;
