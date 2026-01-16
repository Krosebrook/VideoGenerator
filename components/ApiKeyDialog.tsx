
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Key, Info } from 'lucide-react';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: () => void;
}

export const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-stone-100 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Key className="text-amber-600 dark:text-amber-500" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Cinematic Access</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6 px-4">
            Creating high-end AI video requires a key from a Google Cloud project with billing enabled.
          </p>

          <div className="bg-stone-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-stone-100 dark:border-zinc-800 mb-6 text-left">
            <div className="flex items-start gap-3">
              <Info className="shrink-0 text-stone-400 mt-0.5" size={16} />
              <div className="text-[12px] text-stone-500 dark:text-stone-400 space-y-1.5 leading-tight">
                <p>• Free-tier keys do not support the Veo video model.</p>
                <p>• Visit the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline font-bold text-stone-700 dark:text-stone-200">Billing Docs</a> to set up.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={onSelect}
              className="flex-1 py-3 px-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              Select Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
