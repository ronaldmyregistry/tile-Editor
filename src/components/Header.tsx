import React, { useRef } from 'react';
import {
  Eye,
  Share2,
  Save,
  DownloadCloud,
  FileJson,
  FolderOpen,
} from 'lucide-react';
import { ThemeTile } from '../types/tilefx';

interface HeaderProps {
  themes: ThemeTile[];
  activeTileIndex: number;
  onSelectTile: (index: number) => void;
  onSetAppMode: (mode: 'edit' | 'preview') => void;
  onCopyShareLink: () => void;
  onSaveToBrowser: () => void;
  onDownloadHtml: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}

const TILE_ICONS = ['🎁', '🥂', '🍼', '🤍'];

export const Header: React.FC<HeaderProps> = ({
  themes,
  activeTileIndex,
  onSelectTile,
  onSetAppMode,
  onCopyShareLink,
  onSaveToBrowser,
  onDownloadHtml,
  onExportJson,
  onImportJson,
}) => {
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      e.target.value = '';
    }
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white/95 px-4 sm:px-6 flex items-center justify-between z-20 backdrop-blur-md shadow-xs select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-500 to-rose-500 flex items-center justify-center shadow-md shrink-0">
          <svg
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            TileFX Studio{' '}
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            16px Spacing • Semi-transparent Glass • 3-Color Outline
          </p>
        </div>
      </div>

      {/* Active Tile Quick Switcher */}
      <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        {themes.map((theme, idx) => {
          const isSelected = idx === activeTileIndex;
          const shortName = theme.title.replace('Create a ', '');
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTile(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                isSelected
                  ? 'text-slate-800 bg-white shadow-xs border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <span className="mr-1">{TILE_ICONS[idx] || '✨'}</span>
              <span>{shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSetAppMode('preview')}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs flex items-center gap-1.5 transition"
          title="Switch to full stakeholder presentation mode (press 'P' or ESC)"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Present</span>
        </button>

        <button
          type="button"
          onClick={onDownloadHtml}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition"
          title="Download 100% offline HTML presentation file (zero login required)"
        >
          <DownloadCloud className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download Review File (.html)</span>
        </button>

        <button
          type="button"
          onClick={onCopyShareLink}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1.5 shadow-xs transition"
          title="Share review options with stakeholders"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>

        <button
          type="button"
          onClick={onExportJson}
          className="px-2 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition"
          title="Export Settings JSON"
        >
          <FileJson className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => jsonFileInputRef.current?.click()}
          className="px-2 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition"
          title="Import Settings JSON"
        >
          <FolderOpen className="w-3.5 h-3.5" />
        </button>

        <input
          type="file"
          ref={jsonFileInputRef}
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </header>
  );
};
