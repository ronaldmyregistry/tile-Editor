import React from 'react';
import { Share2, Edit3 } from 'lucide-react';

interface FloatingPreviewBarProps {
  onCopyShareLink: () => void;
  onExitPreview: () => void;
}

export const FloatingPreviewBar: React.FC<FloatingPreviewBarProps> = ({
  onCopyShareLink,
  onExitPreview,
}) => {
  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <span className="text-[11px] text-slate-300 font-medium px-1 flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Preview Mode
      </span>
      <button
        type="button"
        onClick={onCopyShareLink}
        className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1 shadow-xs transition"
      >
        <Share2 className="w-3 h-3" />
        <span>Copy Review Link</span>
      </button>
      <button
        type="button"
        onClick={onExitPreview}
        className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white text-slate-900 hover:bg-slate-100 flex items-center gap-1 transition shadow-xs"
      >
        <Edit3 className="w-3 h-3" />
        <span>Edit Mode</span>
      </button>
    </div>
  );
};
