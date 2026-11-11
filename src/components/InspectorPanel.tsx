import React from 'react';
import {
  Sliders,
  Eye,
  Ruler,
  Type,
  Palette,
  Layers,
  Sparkles,
  Snowflake,
  Database,
  Send,
  Copy,
  Save,
  Download,
  DownloadCloud,
  RotateCcw,
  AlignCenter,
} from 'lucide-react';
import { ThemeTile, GlobalLayout, IconDefinition, ParticleType, IconAnimType } from '../types/tilefx';
import { getIcon } from '../utils/svgGenerator';

interface InspectorPanelProps {
  activeTheme: ThemeTile;
  globalLayout: GlobalLayout;
  customIcons: Record<string, IconDefinition>;
  lastSavedText: string;
  onUpdateTheme: (updates: Partial<ThemeTile>) => void;
  onUpdateGlobal: (updates: Partial<GlobalLayout>) => void;
  onOpenIconPicker: (slotIndex: number) => void;
  onSetAppMode: (mode: 'edit' | 'preview') => void;
  onSaveToBrowser: () => void;
  onCopyShareLink: () => void;
  onDownloadSvg: () => void;
  onDownloadHtml: () => void;
  onResetDefaults: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  activeTheme,
  globalLayout,
  customIcons,
  lastSavedText,
  onUpdateTheme,
  onUpdateGlobal,
  onOpenIconPicker,
  onSetAppMode,
  onSaveToBrowser,
  onCopyShareLink,
  onDownloadSvg,
  onDownloadHtml,
  onResetDefaults,
}) => {
  return (
    <aside className="w-96 border-l border-slate-200 bg-white flex flex-col h-full z-10 shadow-lg select-none">
      {/* Header */}
      <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            TileFX Inspector
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSetAppMode('preview')}
            className="px-2 py-1 rounded text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 flex items-center gap-1 transition"
            title="Enter clean presentation mode"
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
          <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-200 font-mono">
            {activeTheme.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-700">
        {/* GLOBAL TYPOGRAPHY & SPACING */}
        <section className="space-y-3 bg-sky-50/50 p-3 rounded-xl border border-sky-100">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-sky-600" />
              <span>Global Layout &amp; Sizing</span>
            </h3>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-mono font-bold px-1.5 py-0.5 rounded">
              All Tiles
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
              <span>Space Between Icon &amp; Title:</span>
              <span className="font-mono text-sky-700 font-bold">
                {globalLayout.iconGap}px
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="36"
              step="1"
              value={globalLayout.iconGap}
              onChange={(e) => onUpdateGlobal({ iconGap: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-sky-200 rounded accent-sky-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
              <span>Base Icon Box Size:</span>
              <span className="font-mono text-sky-700 font-bold">
                {globalLayout.iconSize}px
              </span>
            </div>
            <input
              type="range"
              min="24"
              max="72"
              step="2"
              value={globalLayout.iconSize}
              onChange={(e) => onUpdateGlobal({ iconSize: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-sky-200 rounded accent-sky-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
              <span>Icon Hover Scale Target:</span>
              <span className="font-mono text-sky-700 font-bold">
                {globalLayout.iconHoverScale.toFixed(2)}x (
                {Math.round(globalLayout.iconSize * globalLayout.iconHoverScale)}px)
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="1.8"
              step="0.05"
              value={globalLayout.iconHoverScale}
              onChange={(e) => onUpdateGlobal({ iconHoverScale: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-sky-200 rounded accent-sky-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
              <span>Title Font Size:</span>
              <span className="font-mono text-sky-700 font-bold">
                {globalLayout.fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="11"
              max="22"
              step="0.5"
              value={globalLayout.fontSize}
              onChange={(e) => onUpdateGlobal({ fontSize: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-sky-200 rounded accent-sky-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-600 font-medium">Font Weight</label>
              <select
                value={globalLayout.fontWeight}
                onChange={(e) => onUpdateGlobal({ fontWeight: parseInt(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-800 text-xs mt-1"
              >
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">SemiBold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-medium">Alignment</label>
              <div className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 text-xs mt-1 font-semibold flex items-center justify-center gap-1">
                <AlignCenter className="w-3.5 h-3.5" /> Center
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVE TILE TITLE */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Tile Title Text</span>
            <Type className="w-3.5 h-3.5 text-slate-400" />
          </h3>
          <div>
            <input
              type="text"
              value={activeTheme.title}
              onChange={(e) => onUpdateTheme({ title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs focus:border-sky-500 focus:bg-white focus:outline-none transition"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">Text Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activeTheme.textColor}
                onChange={(e) => onUpdateTheme({ textColor: e.target.value })}
                className="w-6 h-6 rounded border border-slate-300 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={activeTheme.textColor}
                onChange={(e) => onUpdateTheme({ textColor: e.target.value })}
                className="w-20 bg-slate-50 border border-slate-300 text-[10px] px-1.5 py-0.5 rounded text-slate-700 font-mono"
              />
            </div>
          </div>
        </section>

        {/* 3-COLOR ANIMATED OUTLINE */}
        <section className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span>3-Color Gradient Outline</span>
            </h3>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
              Continuous
            </span>
          </div>

          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">
              3 Gradient Color Stops
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1">
                <input
                  type="color"
                  value={activeTheme.beamColor1}
                  onChange={(e) => onUpdateTheme({ beamColor1: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 bg-white shadow-sm"
                />
                <span className="text-[9px] text-slate-500 font-mono">Color 1</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <input
                  type="color"
                  value={activeTheme.beamColor2}
                  onChange={(e) => onUpdateTheme({ beamColor2: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 bg-white shadow-sm"
                />
                <span className="text-[9px] text-slate-500 font-mono">Color 2</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <input
                  type="color"
                  value={activeTheme.beamColor3}
                  onChange={(e) => onUpdateTheme({ beamColor3: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 bg-white shadow-sm"
                />
                <span className="text-[9px] text-slate-500 font-mono">Color 3</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Outline Width</span>
                <span className="font-mono text-slate-700 font-semibold">
                  {activeTheme.borderWidth}px
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.25"
                value={activeTheme.borderWidth}
                onChange={(e) => onUpdateTheme({ borderWidth: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded accent-sky-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Animation Speed</span>
                <span className="font-mono text-slate-700 font-semibold">
                  {activeTheme.beamSpeed}s
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.2"
                value={activeTheme.beamSpeed}
                onChange={(e) => onUpdateTheme({ beamSpeed: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded accent-sky-600"
              />
            </div>
          </div>
        </section>

        {/* TRANSPARENT GLASS */}
        <section className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span>Semi-Transparent Glass</span>
            </h3>
            <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              Non-white
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Glass Tint Alpha</span>
                <span className="font-mono text-slate-700 font-semibold">
                  {Math.round(activeTheme.glassOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.65"
                step="0.05"
                value={activeTheme.glassOpacity}
                onChange={(e) => onUpdateTheme({ glassOpacity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded accent-sky-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Blur Strength</span>
                <span className="font-mono text-slate-700 font-semibold">
                  {activeTheme.glassBlur}px
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                step="2"
                value={activeTheme.glassBlur}
                onChange={(e) => onUpdateTheme({ glassBlur: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded accent-sky-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-500 font-medium">Corner Radius</label>
              <input
                type="number"
                min="12"
                max="32"
                value={activeTheme.borderRadius}
                onChange={(e) => onUpdateTheme({ borderRadius: parseInt(e.target.value) || 20 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium">Inactive Border</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={activeTheme.defaultBorderColor}
                  onChange={(e) => onUpdateTheme({ defaultBorderColor: e.target.value })}
                  className="w-6 h-6 rounded border border-slate-300 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-[10px] text-slate-500">
                  {activeTheme.defaultBorderColor}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4 CYCLING ICONS SETUP */}
        <section className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Vector Icons (4 Slots)</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Slot 1 = Resting</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {activeTheme.icons.map((iconKey, slotIdx) => {
              const iconData = getIcon(iconKey, customIcons);
              const isCustom = Boolean(customIcons[iconKey]);
              return (
                <div
                  key={slotIdx}
                  onClick={() => onOpenIconPicker(slotIdx)}
                  className={`group relative border ${
                    isCustom
                      ? 'border-sky-500 bg-sky-50/60 ring-1 ring-sky-500/30'
                      : 'border-slate-200 bg-slate-50/70'
                  } hover:border-sky-500 rounded-xl p-2 cursor-pointer flex flex-col items-center justify-center transition text-center`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[9px] font-mono text-slate-500 font-bold">
                      Slot {slotIdx + 1}
                    </span>
                    {isCustom && (
                      <span className="text-[8px] bg-sky-500 text-white font-bold px-1 rounded">
                        CUSTOM
                      </span>
                    )}
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform overflow-hidden p-0.5">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox={iconData.viewBox || '0 0 64 64'}
                      preserveAspectRatio="xMidYMid meet"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-full h-full max-h-8 max-w-8"
                      dangerouslySetInnerHTML={{ __html: iconData.svg }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-600 truncate w-full mt-1 font-medium">
                    {iconData.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Cycle Loop Speed</span>
                <span className="font-mono text-slate-700 font-semibold">
                  {activeTheme.cycleDuration}s
                </span>
              </div>
              <input
                type="range"
                min="1.2"
                max="6.0"
                step="0.2"
                value={activeTheme.cycleDuration}
                onChange={(e) => onUpdateTheme({ cycleDuration: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded accent-sky-600"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium">Transition FX</label>
              <select
                value={activeTheme.iconAnimType}
                onChange={(e) => onUpdateTheme({ iconAnimType: e.target.value as IconAnimType })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 text-xs mt-1"
              >
                <option value="pop">Pop &amp; Spring</option>
                <option value="bounce">Bouncy Jump</option>
                <option value="fade">Smooth Dissolve</option>
                <option value="slide">Slide In</option>
                <option value="scale">Smooth Scale</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-500 font-medium">Icon Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={activeTheme.iconColor}
                  onChange={(e) => onUpdateTheme({ iconColor: e.target.value })}
                  className="w-6 h-6 rounded border border-slate-300 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-[10px] text-slate-500">
                  {activeTheme.iconColor}
                </span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Icon Stroke</span>
                <span className="font-mono text-slate-700 font-semibold">
                  {activeTheme.iconStroke}px
                </span>
              </div>
              <input
                type="range"
                min="0.75"
                max="3.0"
                step="0.25"
                value={activeTheme.iconStroke}
                onChange={(e) => onUpdateTheme({ iconStroke: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded mt-1 accent-sky-600"
              />
            </div>
          </div>
        </section>

        {/* PARTICLE SHAPES */}
        <section className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Snowflake className="w-3.5 h-3.5 text-sky-600" />
              <span>Hover Particles</span>
            </h3>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activeTheme.particlesEnabled}
                onChange={(e) => onUpdateTheme({ particlesEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-sky-600 relative" />
            </label>
          </div>

          {activeTheme.particlesEnabled && (
            <>
              <div>
                <label className="text-[11px] text-slate-500 font-medium">Particle Animation &amp; Shape</label>
                <select
                  value={activeTheme.particleType}
                  onChange={(e) => onUpdateTheme({ particleType: e.target.value as ParticleType })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs mt-1 font-medium"
                >
                  <optgroup label="🎉 Confetti &amp; Burst Effects">
                    <option value="confetti_pop">🎉 Confetti Pop &amp; Cascade (Burst on hover, then falling)</option>
                    <option value="confetti">🎊 Continuous Tumbling Confetti</option>
                    <option value="rose_petals">🌸 Delicate Rose Petals</option>
                  </optgroup>
                  <optgroup label="❄️ Holiday / Winter">
                    <option value="snow_crystals">❄️ Snowflake Crystals</option>
                    <option value="snowflakes">🌨️ Soft Fluffy Snow</option>
                  </optgroup>
                  <optgroup label="✨ Celebration &amp; Romance">
                    <option value="sparkles">✨ Diamond Sparkles &amp; Shimmer</option>
                    <option value="hearts">🤍 Floating Hearts</option>
                    <option value="bubbles">🫧 Glass Bubbles</option>
                  </optgroup>
                </select>
              </div>

              {/* Particle Size, Speed & Count */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Size</span>
                    <span className="font-mono text-slate-700 font-semibold">
                      {(activeTheme.particleSize ?? 1.0).toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="3.0"
                    step="0.1"
                    value={activeTheme.particleSize ?? 1.0}
                    onChange={(e) => onUpdateTheme({ particleSize: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded accent-sky-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Speed</span>
                    <span className="font-mono text-slate-700 font-semibold">
                      {activeTheme.particleSpeed}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.2"
                    value={activeTheme.particleSpeed}
                    onChange={(e) => onUpdateTheme({ particleSpeed: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded accent-sky-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Count</span>
                    <span className="font-mono text-slate-700 font-semibold">
                      {activeTheme.particleCount}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="48"
                    step="2"
                    value={activeTheme.particleCount}
                    onChange={(e) => onUpdateTheme({ particleCount: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded accent-sky-600"
                  />
                </div>
              </div>

              {/* Particle Multi-Color Palette */}
              <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">
                    Particle Color Palette (4 Colors)
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">Multi-color</span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[0, 1, 2, 3].map((colorIdx) => {
                    const currentPalette =
                      activeTheme.particleColors && activeTheme.particleColors.length > 0
                        ? activeTheme.particleColors
                        : ['#ffffff', '#E53E3E', '#2E7D32', '#F6E05E'];
                    const colorVal = currentPalette[colorIdx] || '#ffffff';

                    return (
                      <div key={colorIdx} className="flex flex-col items-center gap-1">
                        <input
                          type="color"
                          value={colorVal}
                          onChange={(e) => {
                            const updated = [...currentPalette];
                            updated[colorIdx] = e.target.value;
                            onUpdateTheme({
                              particleColors: updated,
                              particleColor: updated[0],
                            });
                          }}
                          className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 bg-white shadow-xs"
                        />
                        <span className="text-[9px] text-slate-500 font-mono">
                          Color {colorIdx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>

        {/* STORAGE & ACTIONS */}
        <section className="space-y-2 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-600" />
              <span>Saved Settings</span>
            </h3>
            <span className="text-[10px] text-emerald-700 font-mono font-bold">
              {lastSavedText}
            </span>
          </div>

          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 space-y-2">
            <div className="text-[11px] font-semibold text-sky-900 flex items-center gap-1">
              <Send className="w-3.5 h-3.5 text-sky-600" /> Share with Stakeholders:
            </div>
            <p className="text-[10px] text-sky-700 leading-tight">
              Generates a review link preserving all your customized icons and interactions in clean presentation mode.
            </p>
            <button
              type="button"
              onClick={onCopyShareLink}
              className="w-full py-2 rounded-lg text-xs bg-sky-600 hover:bg-sky-700 text-white font-bold shadow flex items-center justify-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Stakeholder Review Link</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onSaveToBrowser}
              className="flex-1 py-1.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm flex items-center justify-center gap-1 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save in Browser</span>
            </button>
            <button
              type="button"
              onClick={onDownloadHtml}
              className="flex-1 py-1.5 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm flex items-center justify-center gap-1 transition"
              title="Download standalone HTML with embedded settings"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download HTML</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onResetDefaults}
            className="w-full py-1.5 rounded-lg text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200 flex items-center justify-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Factory Defaults</span>
          </button>
        </section>
      </div>

      {/* Quick Export Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex flex-col gap-2 pb-6">
        <button
          type="button"
          onClick={onDownloadSvg}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow transition"
        >
          <DownloadCloud className="w-4 h-4 text-emerald-400" />
          <span>Download Animated SVG ({activeTheme.id})</span>
        </button>
      </div>
    </aside>
  );
};
