import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Cloud, Sparkles } from 'lucide-react';
import { copyToClipboard } from '../utils/shareUrl';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  shareId: string | null;
  onDownloadHtml?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareUrl,
  shareId,
  onDownloadHtml,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Share with Stakeholders</h3>
              <p className="text-[11px] text-slate-500">Fast review link &amp; universal standalone presentation</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Option 1: Clean Short Cloud Review URL */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Option 1: Short Review URL</span>
                {shareId && <span className="font-mono text-[10px] bg-sky-100 text-sky-700 font-semibold px-1.5 py-0.5 rounded">ID: {shareId}</span>}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Short &amp; clean
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                onFocus={(e) => e.target.select()}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 select-all focus:outline-none focus:border-sky-500 shadow-xs"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1.5 transition shadow-xs shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold transition"
              >
                <span>Test open preview in new tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Option 2: 100% Universal HTML Presentation (Zero Login Required) */}
          {onDownloadHtml && (
            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Option 2: Universal HTML File (Zero Login Required)</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  100% Public
                </span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                If stakeholders or clients don't have access to your workspace login, send them this self-contained HTML file via email or Slack. It opens instantly in any browser with all 4 interactive tiles, single-fire corner pops, and falling confetti!
              </p>
              <button
                type="button"
                onClick={() => {
                  onDownloadHtml();
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>Download Interactive Presentation (.html)</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
