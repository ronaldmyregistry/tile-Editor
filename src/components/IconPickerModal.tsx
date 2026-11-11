import React, { useState, useRef } from 'react';
import { X, Upload, Code, Sparkles, Check, Trash2 } from 'lucide-react';
import { IconDefinition } from '../types/tilefx';
import { BUILTIN_ICONS } from '../data/presetIcons';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSlot: number;
  currentIconKey: string;
  onSelectIcon: (key: string) => void;
  customIcons: Record<string, IconDefinition>;
  onAddCustomIcon: (icon: IconDefinition) => string;
  onDeleteCustomIcon?: (key: string) => void;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  targetSlot,
  currentIconKey,
  onSelectIcon,
  customIcons,
  onAddCustomIcon,
  onDeleteCustomIcon,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'paste'>('presets');
  const [rawSvgText, setRawSvgText] = useState('');
  const [svgName, setSvgName] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      let content = event.target?.result as string;
      if (!content) return;

      let detectedViewBox = '0 0 64 64';
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        if (svgEl) {
          if (svgEl.hasAttribute('viewBox')) {
            detectedViewBox = svgEl.getAttribute('viewBox') || '0 0 64 64';
          } else {
            const w = parseFloat(svgEl.getAttribute('width') || '64');
            const h = parseFloat(svgEl.getAttribute('height') || '64');
            detectedViewBox = `0 0 ${w} ${h}`;
          }
          content = svgEl.innerHTML;
        }
      } catch (err) {
        console.warn('SVG parse error:', err);
      }

      const name = file.name.replace(/\.[^/.]+$/, '') || `Custom Icon ${targetSlot + 1}`;
      const newKey = onAddCustomIcon({
        name,
        category: 'Custom',
        viewBox: detectedViewBox,
        svg: content,
      });

      onSelectIcon(newKey);
      onClose();
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePasteSubmit = () => {
    if (!rawSvgText.trim()) {
      setParseError('Please paste some SVG code first.');
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawSvgText.trim(), 'image/svg+xml');
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        setParseError('Invalid SVG XML syntax. Please check your code.');
        return;
      }

      const svgEl = doc.querySelector('svg');
      let detectedViewBox = '0 0 64 64';
      let content = rawSvgText;

      if (svgEl) {
        detectedViewBox = svgEl.getAttribute('viewBox') || '0 0 64 64';
        content = svgEl.innerHTML;
      }

      const name = svgName.trim() || `Custom Vector ${targetSlot + 1}`;
      const newKey = onAddCustomIcon({
        name,
        category: 'Custom',
        viewBox: detectedViewBox,
        svg: content,
      });

      onSelectIcon(newKey);
      setRawSvgText('');
      setSvgName('');
      setParseError(null);
      onClose();
    } catch (err: any) {
      setParseError(err.message || 'Error parsing SVG');
    }
  };

  const customEntries = Object.entries(customIcons);
  const builtinEntries = Object.entries(BUILTIN_ICONS);

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Select or Upload Icon</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-bold">
                Slot {targetSlot + 1}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose from standard presets or upload your own SVG graphic
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50/40">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'presets'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Icon Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'upload'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload File (.svg)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'paste'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Paste Raw SVG
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 flex-1 overflow-y-auto">
          {activeTab === 'presets' && (
            <div className="space-y-4">
              {/* Custom Icons */}
              {customEntries.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-sky-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-sky-600" />
                    <span>Your Uploaded Icons</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {customEntries.map(([key, item]) => {
                      const isSelected = key === currentIconKey;
                      return (
                        <div
                          key={key}
                          onClick={() => {
                            onSelectIcon(key);
                            onClose();
                          }}
                          className={`relative border-2 ${
                            isSelected
                              ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/20'
                              : 'border-slate-200 hover:border-sky-400 bg-white'
                          } rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer transition text-center group`}
                        >
                          <div className="w-8 h-8 text-sky-700 flex items-center justify-center overflow-hidden">
                            <svg
                              width="28"
                              height="28"
                              viewBox={item.viewBox || '0 0 64 64'}
                              preserveAspectRatio="xMidYMid meet"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-full h-full"
                              dangerouslySetInnerHTML={{ __html: item.svg }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-800 mt-1 font-semibold truncate w-full">
                            {item.name}
                          </span>
                          {onDeleteCustomIcon && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCustomIcon(key);
                              }}
                              className="absolute top-1 right-1 p-0.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition"
                              title="Delete icon"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Built-in Presets */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Built-in Vector Library
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {builtinEntries.map(([key, item]) => {
                    const isSelected = key === currentIconKey;
                    return (
                      <div
                        key={key}
                        onClick={() => {
                          onSelectIcon(key);
                          onClose();
                        }}
                        className={`border ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/20'
                            : 'border-slate-200 hover:border-sky-400 hover:bg-slate-50/70 bg-white'
                        } rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer transition text-center`}
                      >
                        <div className="w-8 h-8 text-slate-700 flex items-center justify-center overflow-hidden">
                          <svg
                            width="28"
                            height="28"
                            viewBox={item.viewBox || '0 0 64 64'}
                            preserveAspectRatio="xMidYMid meet"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ __html: item.svg }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-700 mt-1 font-medium truncate w-full">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                accept=".svg,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50/50 hover:bg-sky-50/40"
              >
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Click to Browse SVG file
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supports standard vector SVGs (paths, polygons, rects, circles)
                </span>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Icon Label / Name
                </label>
                <input
                  type="text"
                  value={svgName}
                  onChange={(e) => setSvgName(e.target.value)}
                  placeholder="e.g. Shopping Bag, Ribbon, Custom Star..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Raw SVG Code or Paths
                </label>
                <textarea
                  value={rawSvgText}
                  onChange={(e) => {
                    setRawSvgText(e.target.value);
                    setParseError(null);
                  }}
                  placeholder='<svg viewBox="0 0 24 24"><path d="..." fill="none" stroke="currentColor"/></svg>'
                  rows={6}
                  className="w-full font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white resize-none"
                />
              </div>

              {parseError && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                  {parseError}
                </div>
              )}

              <button
                type="button"
                onClick={handlePasteSubmit}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow flex items-center justify-center gap-1.5 transition"
              >
                <Check className="w-4 h-4" />
                <span>Save and Assign to Slot {targetSlot + 1}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
