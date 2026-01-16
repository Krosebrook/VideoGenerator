
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { Loader2, Paintbrush, Play, Type, Sparkles, Image as ImageIcon, X, Upload, Wand2, Monitor, Layers } from 'lucide-react';
import { STYLE_PRESETS, STYLE_CATEGORIES, TYPOGRAPHY_SUGGESTIONS } from '../utils';

interface CreativeStudioProps {
  inputText: string;
  setInputText: (val: string) => void;
  inputStyle: string;
  setInputStyle: (val: string) => void;
  typographyPrompt: string;
  setTypographyPrompt: (val: string) => void;
  resolution: '720p' | '1080p' | '4k';
  setResolution: (val: '720p' | '1080p' | '4k') => void;
  referenceImage: string | null;
  setReferenceImage: (val: string | null) => void;
  selectedStyleCategory: string;
  setSelectedStyleCategory: (val: string) => void;
  isSuggestingStyle: boolean;
  handleStyleSuggestion: () => void;
  handleFileChange: (file: File) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreativeStudio: React.FC<CreativeStudioProps> = ({
  inputText, setInputText,
  inputStyle, setInputStyle,
  typographyPrompt, setTypographyPrompt,
  resolution, setResolution,
  referenceImage, setReferenceImage,
  selectedStyleCategory, setSelectedStyleCategory,
  isSuggestingStyle, handleStyleSuggestion,
  handleFileChange,
  onSubmit
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Core Input */}
        <div className="space-y-8">
          <div className="space-y-3 group" data-tour="message-input">
            <label className="text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors">
              <Type size={12} strokeWidth={3} /> Message
            </label>
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder="e.g. AURORA" 
              maxLength={40} 
              className="w-full bg-stone-50 dark:bg-zinc-900 border-2 border-transparent focus:border-stone-900 dark:focus:border-stone-100 rounded-2xl px-6 py-5 text-2xl font-black focus:outline-none transition-all placeholder-stone-200 dark:placeholder-zinc-800 text-stone-900 dark:text-white shadow-sm" 
              required 
            />
          </div>

          <div className="space-y-3 group" data-tour="style-input">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors">
                <Wand2 size={12} strokeWidth={3} /> Visual Environment
              </label>
              <button 
                type="button" 
                onClick={handleStyleSuggestion} 
                disabled={!inputText.trim() || isSuggestingStyle} 
                className="text-[10px] font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-2 transition-all disabled:opacity-30 border border-stone-200 dark:border-zinc-800 px-3 py-1.5 rounded-full hover:bg-stone-50"
              >
                  {isSuggestingStyle ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />} {isSuggestingStyle ? 'THINKING...' : 'AI SUGGEST'}
              </button>
            </div>
            
            {/* Categorized Preset Selector */}
            <div className="space-y-4">
              <div className="flex gap-2 border-b border-stone-100 dark:border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
                {STYLE_CATEGORIES.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedStyleCategory(category)}
                    className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap px-3 py-1 rounded-lg transition-all ${selectedStyleCategory === category ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                {STYLE_PRESETS.filter(p => p.category === selectedStyleCategory).map((preset) => (
                  <button 
                    key={preset.id} 
                    type="button" 
                    onClick={() => setInputStyle(preset.prompt)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${inputStyle === preset.prompt ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100' : 'bg-white dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 text-stone-500 hover:border-stone-400'}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-4">
              <textarea 
                value={inputStyle} 
                onChange={(e) => setInputStyle(e.target.value)} 
                placeholder="Describe the world around the text... (e.g. Made of glass shards floating in a sunset desert)" 
                className="w-full bg-stone-50 dark:bg-zinc-900 border-2 border-transparent focus:border-stone-900 dark:focus:border-stone-100 rounded-2xl p-5 text-sm font-medium focus:outline-none transition-all placeholder-stone-300 dark:placeholder-zinc-800 text-stone-900 dark:text-white resize-none h-24 leading-relaxed" 
              />
            </div>
          </div>
        </div>

        {/* Right Column: Advanced Options */}
        <div className="space-y-8">
          <div className="space-y-3 group" data-tour="typo-input">
            <label className="text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors">
              <Paintbrush size={12} strokeWidth={3} /> Typography Mood
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {TYPOGRAPHY_SUGGESTIONS.map((opt) => (
                <button 
                  key={opt.id} 
                  type="button" 
                  onClick={() => setTypographyPrompt(opt.prompt)} 
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${typographyPrompt === opt.prompt ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-500 hover:border-stone-400'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <textarea 
              value={typographyPrompt} 
              onChange={(e) => setTypographyPrompt(e.target.value)} 
              placeholder="Custom font instructions..." 
              className="w-full bg-stone-50 dark:bg-zinc-900 border-2 border-transparent focus:border-stone-900 dark:focus:border-stone-100 rounded-2xl p-4 text-xs font-medium focus:outline-none transition-all placeholder-stone-300 dark:placeholder-zinc-800 text-stone-900 dark:text-white resize-none h-16" 
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-3 group" data-tour="resolution-selector">
              <label className="text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors">
                <Monitor size={12} strokeWidth={3} /> Cinematic Quality
              </label>
              <div className="flex bg-stone-100 dark:bg-zinc-900 p-1 rounded-2xl border border-stone-200 dark:border-zinc-800 w-full">
                <button 
                  type="button"
                  onClick={() => setResolution('720p')}
                  className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${resolution === '720p' ? 'bg-white dark:bg-zinc-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">720p</span>
                  <span className="text-[8px] font-bold opacity-60">Fast Preview</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setResolution('1080p')}
                  className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${resolution === '1080p' ? 'bg-white dark:bg-zinc-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">1080p</span>
                  <span className="text-[8px] font-bold opacity-60">HQ Master</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setResolution('4k')}
                  className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${resolution === '4k' ? 'bg-gradient-to-br from-amber-100 to-white dark:from-zinc-800 dark:to-zinc-700 shadow-sm text-amber-600 dark:text-amber-400' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50 dark:hover:bg-zinc-800/50'}`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">4K</span>
                  <span className="text-[8px] font-bold opacity-60">Ultra HD</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 group" data-tour="reference-input">
              <label className="text-[10px] font-black text-stone-400 dark:text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors">
                <Layers size={12} strokeWidth={3} /> Environment Reference
              </label>
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-2 border-dashed border-stone-200 dark:border-zinc-800 rounded-2xl h-24 flex flex-col items-center justify-center gap-2 text-stone-400 dark:text-zinc-600 hover:bg-stone-50 dark:hover:bg-zinc-900 hover:border-stone-400 transition-all cursor-pointer"
                >
                  <Upload size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Upload Keyframe</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(file);
                  }} 
                  accept="image/*" 
                  className="sr-only" 
                />
                {referenceImage && (
                  <div className="h-24 w-24 relative rounded-2xl overflow-hidden border-2 border-stone-900 dark:border-white shadow-xl group">
                    <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setReferenceImage(null)} 
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={20} className="text-white" strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[9px] text-stone-400 italic">Background image will be used for colors and textures.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-stone-100 dark:border-zinc-900" data-tour="generate-btn">
        <button 
          type="submit" 
          disabled={!inputText.trim()} 
          className="w-full py-6 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-black rounded-[24px] hover:bg-stone-800 dark:hover:bg-white transition-all disabled:opacity-30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] active:scale-[0.98] flex items-center justify-center gap-3 text-lg uppercase tracking-widest overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-all"></div>
          <Play size={20} className="fill-current" /> 
          Generate Cinematic
        </button>
      </div>
    </form>
  );
};
