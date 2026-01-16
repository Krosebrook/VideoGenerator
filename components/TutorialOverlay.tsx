
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TUTORIAL_STEPS } from '../constants';

interface TutorialOverlayProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ step, onNext, onPrev, onClose }) => {
  const currentStep = TUTORIAL_STEPS[step];
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (currentStep.selector) {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setCoords(null);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto" onClick={onClose} />
      
      {coords && (
        <div 
          className="absolute border-2 border-amber-400 rounded-2xl shadow-[0_0_50px_rgba(251,191,36,0.3)] transition-all duration-500 ease-out z-[201]"
          style={{ 
            top: coords.top - 8, 
            left: coords.left - 8, 
            width: coords.width + 16, 
            height: coords.height + 16 
          }}
        />
      )}

      <div 
        className={`absolute z-[202] w-full max-w-sm pointer-events-auto transition-all duration-500 ease-out ${!coords ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}`}
        style={coords ? { 
          top: coords.top + coords.height + 32 > window.innerHeight - 300 ? coords.top - 240 : coords.top + coords.height + 32,
          left: Math.max(20, Math.min(window.innerWidth - 400, coords.left + coords.width / 2 - 200))
        } : {}}
      >
        <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-8 shadow-2xl border border-stone-100 dark:border-zinc-800 animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Step {step + 1} of {TUTORIAL_STEPS.length}</span>
            <button onClick={onClose} className="text-stone-300 hover:text-stone-600 transition-colors">
              <X size={16} />
            </button>
          </div>
          <h3 className="text-xl font-black text-stone-900 dark:text-white mb-2">{currentStep.title}</h3>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-8">{currentStep.content}</p>
          
          <div className="flex gap-3">
            {step > 0 && (
              <button 
                onClick={onPrev}
                className="flex-1 py-3 text-stone-400 font-bold text-xs uppercase tracking-widest hover:text-stone-900 transition-colors"
              >
                Back
              </button>
            )}
            <button 
              onClick={onNext}
              className="flex-[2] py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {step === TUTORIAL_STEPS.length - 1 ? 'Start Creating' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
