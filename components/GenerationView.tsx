
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Loader2, Download, FileType, ArrowLeft, Play, X, Activity, Box, Cpu, Zap, Film } from 'lucide-react';
import { AppState } from '../types';

interface GenerationViewProps {
  state: AppState;
  progress: number;
  loadingStepText: string;
  imageSrc: string | null;
  videoSrc: string | null;
  resolution: string;
  statusMessage: string;
  isGifGenerating: boolean;
  isWebMGenerating?: boolean;
  onReset: () => void;
  onDownloadVideo: (format: 'mp4' | 'webm') => void;
  onDownloadGif: () => void;
}

export const GenerationView: React.FC<GenerationViewProps> = ({
  state, progress, loadingStepText, imageSrc, videoSrc, resolution, statusMessage, isGifGenerating, isWebMGenerating,
  onReset, onDownloadVideo, onDownloadGif
}) => {
  if (state === AppState.ERROR) {
    return (
     <div className="flex flex-col items-center justify-center space-y-8 h-full p-8 text-center animate-in zoom-in-95">
       <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600">
          <X size={40} strokeWidth={3} />
       </div>
       <div className="space-y-2">
         <h3 className="text-2xl font-black text-stone-900 dark:text-white">Creation Failed</h3>
         <p className="text-sm text-red-500/80 max-w-xs mx-auto leading-relaxed">{statusMessage}</p>
       </div>
       <button onClick={onReset} className="px-10 py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-black rounded-2xl hover:bg-stone-800 dark:hover:bg-white transition-all shadow-2xl active:scale-95">
         Back to Studio
       </button>
     </div>
   );
 }

  const isGenerating = state === AppState.GENERATING_IMAGE || state === AppState.GENERATING_VIDEO;
      
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12 bg-white dark:bg-zinc-950 overflow-y-auto custom-scrollbar">
      {isGenerating && (
        <div className="flex flex-col items-center gap-6 mb-10 w-full animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4 bg-stone-900 dark:bg-zinc-900 px-6 py-3 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Activity size={18} className="text-amber-400 animate-pulse" />
              <span className="text-sm font-black text-white uppercase tracking-[0.2em]">
                {loadingStepText}
                {resolution === '1080p' && <span className="ml-2 text-[8px] border border-amber-400/30 text-amber-400 px-1 rounded">1080P</span>}
                {resolution === '4k' && <span className="ml-2 text-[8px] border border-amber-400/30 text-amber-400 px-1 rounded shadow-[0_0_10px_rgba(251,191,36,0.5)]">4K UHD</span>}
              </span>
              <div className="ml-2 px-2 py-0.5 bg-amber-400 text-black text-[10px] font-black rounded-md">{Math.round(progress)}%</div>
          </div>
          
          <div className="w-full max-w-md h-2 bg-stone-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative">
              <div 
                className="h-full bg-stone-900 dark:bg-amber-400 transition-all duration-700 ease-out relative" 
                style={{ width: `${progress}%` }}
              >
                <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent to-white/30 animate-shimmer" />
              </div>
          </div>

          <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 dark:text-zinc-600">
              <div className={`flex items-center gap-2 transition-colors ${state === AppState.GENERATING_IMAGE ? 'text-amber-500' : ''}`}>
                <Box size={10} /> Keyframe Synthesis
              </div>
              <div className={`flex items-center gap-2 transition-colors ${state === AppState.GENERATING_VIDEO ? 'text-amber-500' : ''}`}>
                <Cpu size={10} /> Cinematic Animation
              </div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-6xl aspect-video bg-black rounded-[32px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] dark:shadow-[0_40px_100px_-20px_rgba(255,255,255,0.1)] transition-all duration-1000 ring-1 ring-black/10 dark:ring-white/5">
        {isGenerating && (
          <div className="absolute inset-0 bg-computational-grid opacity-20 z-0"></div>
        )}

        <div className="absolute inset-0 opacity-40 blur-[100px] scale-150 animate-pulse transition-colors duration-[3000ms]" 
          style={{ background: imageSrc ? `url(${imageSrc}) center/cover no-repeat` : 'radial-gradient(circle, #333 0%, #000 100%)' }} 
        />
        
        {state === AppState.GENERATING_IMAGE && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-white/5 rounded-full animate-pulse-ring"></div>
                <div className="absolute inset-0 border-4 border-amber-400/20 rounded-full border-t-amber-400 animate-spin"></div>
                <Box size={32} className="text-white opacity-50 animate-pulse" />
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-scanline z-30"></div>
              </div>
          </div>
        )}
        
        {imageSrc && !videoSrc && <img src={imageSrc} alt="Text Visualized" className="relative z-10 w-full h-full object-cover animate-in fade-in duration-[2000ms]" />}
        
        {state === AppState.GENERATING_VIDEO && (
            <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center gap-6 overflow-hidden">
              <div className="bg-white/10 p-6 rounded-[32px] border border-white/10 relative group">
                  <div className="absolute inset-0 bg-amber-400/10 blur-xl rounded-full animate-pulse"></div>
                  <Zap size={40} className="text-amber-400 animate-bounce relative z-10" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-white font-black tracking-[0.4em] uppercase text-[10px]">Temporal Neural Processing</p>
                <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: `${i*200}ms` }} />)}
                </div>
              </div>
              
              <div className="absolute inset-0 pointer-events-none opacity-30">
                  {Array.from({length: 20}).map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute bg-white rounded-full animate-ping"
                      style={{
                        width: Math.random() * 4 + 'px',
                        height: Math.random() * 4 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        animationDuration: (Math.random() * 3 + 2) + 's',
                        animationDelay: (Math.random() * 5) + 's'
                      }}
                    />
                  ))}
              </div>
            </div>
          )}
          
        {videoSrc && (
          <div className="relative z-10 w-full h-full group">
            <video src={videoSrc} autoPlay loop playsInline className="w-full h-full object-cover animate-in zoom-in-105 duration-[1500ms]" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                  <Play size={32} className="text-white fill-white translate-x-1" />
                </div>
            </div>
          </div>
        )}
      </div>

      {state === AppState.PLAYING && (
        <div className="w-full max-w-6xl mt-12 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <button onClick={onReset} className="flex items-center gap-3 px-8 py-4 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-2xl transition-all font-black text-xs uppercase tracking-widest group border border-transparent hover:border-stone-200 dark:hover:border-zinc-700">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Studio
          </button>
          
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-center md:justify-end">
            <button onClick={onDownloadGif} disabled={isGifGenerating} className="px-6 py-4 bg-white dark:bg-zinc-900 text-stone-900 dark:text-stone-200 border border-stone-200 dark:border-zinc-700 font-black rounded-2xl hover:bg-stone-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-3 disabled:opacity-50 text-xs uppercase tracking-widest shadow-sm">
              {isGifGenerating ? <Loader2 size={16} className="animate-spin" /> : <FileType size={16} />} GIF
            </button>
            <button onClick={() => onDownloadVideo('webm')} disabled={isWebMGenerating} className="px-6 py-4 bg-white dark:bg-zinc-900 text-stone-900 dark:text-stone-200 border border-stone-200 dark:border-zinc-700 font-black rounded-2xl hover:bg-stone-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-3 disabled:opacity-50 text-xs uppercase tracking-widest shadow-sm">
              {isWebMGenerating ? <Loader2 size={16} className="animate-spin" /> : <Film size={16} />} WebM
            </button>
            <button onClick={() => onDownloadVideo('mp4')} className="px-8 py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-black rounded-2xl hover:bg-stone-800 dark:hover:bg-white transition-all flex items-center gap-3 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] active:scale-95 text-xs uppercase tracking-widest">
              <Download size={16} /> MP4
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
