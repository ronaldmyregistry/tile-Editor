import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, CheckCircle2, Maximize } from 'lucide-react';
import { ThemeTile, GlobalLayout, IconDefinition, TileFXBundle } from './types/tilefx';
import { DEFAULT_GLOBAL_LAYOUT, INITIAL_THEMES, INITIAL_CUSTOM_ICONS } from './data/presetIcons';
import {
  STORAGE_KEY,
  decodeBundle,
  buildShareUrl,
  copyToClipboard,
  saveBundleToServer,
  loadBundleFromServer,
} from './utils/shareUrl';
import {
  buildStandaloneSvg,
  escapeXml,
  downloadStandaloneSvg,
  downloadBundleJson,
  triggerBlobDownload,
} from './utils/svgGenerator';
import { Header } from './components/Header';
import { TileCard } from './components/TileCard';
import { InspectorPanel } from './components/InspectorPanel';
import { IconPickerModal } from './components/IconPickerModal';
import { FloatingPreviewBar } from './components/FloatingPreviewBar';
import { ShareModal } from './components/ShareModal';

export default function App() {
  const [themes, setThemes] = useState<ThemeTile[]>(INITIAL_THEMES);
  const [globalLayout, setGlobalLayout] = useState<GlobalLayout>(DEFAULT_GLOBAL_LAYOUT);
  const [customIcons, setCustomIcons] = useState<Record<string, IconDefinition>>(INITIAL_CUSTOM_ICONS);
  const [activeTileIndex, setActiveTileIndex] = useState<number>(0);
  const [appMode, setAppMode] = useState<'edit' | 'preview'>('edit');
  const [forceHoverLoop, setForceHoverLoop] = useState<boolean>(false);
  const [lastSavedText, setLastSavedText] = useState<string>('Ready');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [iconPickerSlot, setIconPickerSlot] = useState<number | null>(null);
  const [shareModalData, setShareModalData] = useState<{ url: string; id: string | null } | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  // Initialize from Server, URL params, or LocalStorage
  useEffect(() => {
    const initApp = async () => {
      try {
        const hash = window.location.hash || '';
        const search = window.location.search || '';
        const params = new URLSearchParams(search);
        const serverShareId = params.get('share') || params.get('preview');

        // Check preview mode requested in URL
        if (hash.includes('mode=preview') || search.includes('mode=preview')) {
          setAppMode('preview');
        }

        // 1. Try instant synchronous decoding from URL hash or preset param
        let encodedData: string | null = null;
        if (hash.includes('#preset=')) {
          encodedData = hash.split('#preset=')[1]?.split('&')[0] || null;
        } else if (hash.includes('#bundle=')) {
          encodedData = hash.split('#bundle=')[1]?.split('&')[0] || null;
        } else if (params.get('preset')) {
          encodedData = params.get('preset');
        }

        let loadedFromPreset = false;
        if (encodedData) {
          const bundle = decodeBundle(encodedData);
          if (bundle && bundle.themes) {
            if (bundle.global) setGlobalLayout(bundle.global);
            if (bundle.customIcons) {
              setCustomIcons((prev) => ({ ...prev, ...bundle.customIcons }));
            }
            if (Array.isArray(bundle.themes)) setThemes(bundle.themes);
            if (typeof bundle.activeTileIndex === 'number') {
              setActiveTileIndex(bundle.activeTileIndex);
            }
            loadedFromPreset = true;
            showToast('Loaded shared configuration!');
          }
        }

        // 2. Also try loading latest from Cloud Server by Share ID
        if (serverShareId) {
          const serverBundle = await loadBundleFromServer(serverShareId);
          if (serverBundle && serverBundle.themes) {
            if (serverBundle.global) setGlobalLayout(serverBundle.global);
            if (serverBundle.customIcons) {
              setCustomIcons((prev) => ({ ...prev, ...serverBundle.customIcons }));
            }
            if (Array.isArray(serverBundle.themes)) setThemes(serverBundle.themes);
            if (typeof serverBundle.activeTileIndex === 'number') {
              setActiveTileIndex(serverBundle.activeTileIndex);
            }
            if (!loadedFromPreset) {
              showToast('Loaded shared preset from cloud!');
            }
            return;
          }
        }

        if (loadedFromPreset) {
          return;
        }

        // 3. Fallback: Read from LocalStorage
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const bundle: TileFXBundle = JSON.parse(stored);
          if (bundle.global) setGlobalLayout(bundle.global);
          if (bundle.customIcons) {
            setCustomIcons((prev) => ({ ...prev, ...bundle.customIcons }));
          }
          if (bundle.themes && Array.isArray(bundle.themes)) setThemes(bundle.themes);
          if (typeof bundle.activeTileIndex === 'number') {
            setActiveTileIndex(bundle.activeTileIndex);
          }
          setLastSavedText(
            'Saved ' +
              new Date(bundle.timestamp || Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
          );
        }
      } catch (err) {
        console.warn('Initial load error:', err);
      }
    };

    initApp();
  }, [showToast]);

  // Current bundle snapshot
  const currentBundle: TileFXBundle = useMemo(() => {
    return {
      version: 4,
      timestamp: Date.now(),
      activeTileIndex,
      global: globalLayout,
      themes,
      customIcons,
    };
  }, [activeTileIndex, globalLayout, themes, customIcons]);

  // Save to LocalStorage
  const saveToLocalStorage = useCallback(
    (manualAlert = false) => {
      try {
        const json = JSON.stringify(currentBundle);
        window.localStorage.setItem(STORAGE_KEY, json);
        const timeStr = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setLastSavedText(`Saved ${timeStr}`);
        if (manualAlert) {
          showToast('Settings saved to browser!');
        }
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
    },
    [currentBundle, showToast]
  );

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [themes, globalLayout, customIcons, saveToLocalStorage]);

  // Keyboard shortcut listener (ESC or 'P' to toggle preview)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'Escape' && appMode === 'preview') {
        setAppMode('edit');
      } else if (e.key === 'p' || e.key === 'P') {
        setAppMode((prev) => (prev === 'preview' ? 'edit' : 'preview'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appMode]);

  // Update URL hash when mode changes
  const handleSetAppMode = (mode: 'edit' | 'preview') => {
    setAppMode(mode);
    try {
      let hash = window.location.hash || '';
      if (hash.includes('&mode=')) {
        hash = hash.replace(/&mode=(edit|preview)/, `&mode=${mode}`);
      } else if (hash.includes('#preset=')) {
        hash = `${hash}&mode=${mode}`;
      } else {
        hash = `#mode=${mode}`;
      }
      window.history.replaceState(null, '', hash);
    } catch {
      // Ignore URL update failures
    }
  };

  // Theme updates
  const handleUpdateActiveTheme = (updates: Partial<ThemeTile>) => {
    setThemes((prev) => {
      const copy = [...prev];
      copy[activeTileIndex] = { ...copy[activeTileIndex], ...updates };
      return copy;
    });
  };

  // Global layout updates
  const handleUpdateGlobal = (updates: Partial<GlobalLayout>) => {
    setGlobalLayout((prev) => ({ ...prev, ...updates }));
  };

  // Custom icon addition
  const handleAddCustomIcon = (icon: IconDefinition): string => {
    const key = `custom_${Date.now()}_slot${iconPickerSlot ?? 0}`;
    setCustomIcons((prev) => ({ ...prev, [key]: icon }));
    return key;
  };

  const handleDeleteCustomIcon = (key: string) => {
    setCustomIcons((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSelectIconForSlot = (iconKey: string) => {
    if (iconPickerSlot === null) return;
    const currentTheme = themes[activeTileIndex];
    const newIcons = [...currentTheme.icons] as [string, string, string, string];
    newIcons[iconPickerSlot] = iconKey;
    handleUpdateActiveTheme({ icons: newIcons });
    showToast(`Assigned icon to Slot ${iconPickerSlot + 1}`);
  };

  // Server-saved Share Link Generator
  const handleCopyShareLink = async () => {
    showToast('Saving settings to cloud...');
    const serverShareId = await saveBundleToServer(currentBundle);
    const shareUrl = buildShareUrl(currentBundle, serverShareId, true);

    await copyToClipboard(shareUrl);
    setShareModalData({ url: shareUrl, id: serverShareId });
    showToast('Review link saved & copied!');
  };

  // Export standalone HTML with fully interactive tiles
  const handleDownloadHtml = () => {
    try {
      const renderedCards = themes
        .map((theme) => {
          const svgCode = buildStandaloneSvg(theme, globalLayout, true, customIcons);
          return `
          <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <div style="width: 100%; transition: transform 0.2s ease;" class="tile-card">
              ${svgCode}
            </div>
          </div>`;
        })
        .join('\n');

      const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TileFX Presentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 2rem 1.5rem;
      background-color: ${globalLayout.pageBgColor};
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap: 1.5rem;
      width: 100%;
    }
    @media (min-width: 640px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (min-width: 1024px) {
      .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    .card-group { cursor: pointer; }
    .tile-card {
      transition: transform 0.2s ease;
    }
    .tile-card:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="container">
    <div class="grid">
      ${renderedCards}
    </div>
  </div>
</body>
</html>`;
      const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' });
      triggerBlobDownload(blob, 'tilefx-interactive-presentation.html');
      showToast('Downloaded interactive HTML presentation!');
    } catch (err) {
      console.error(err);
      showToast('Error exporting HTML');
    }
  };

  // Import JSON
  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const bundle = JSON.parse(e.target?.result as string);
        if (bundle.global) setGlobalLayout(bundle.global);
        if (bundle.customIcons) setCustomIcons((prev) => ({ ...prev, ...bundle.customIcons }));
        if (bundle.themes && Array.isArray(bundle.themes)) setThemes(bundle.themes);
        showToast('Configuration imported successfully!');
      } catch {
        showToast('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all tile customizations and layouts to factory defaults?')) {
      window.localStorage.removeItem(STORAGE_KEY);
      setThemes(INITIAL_THEMES);
      setGlobalLayout(DEFAULT_GLOBAL_LAYOUT);
      setCustomIcons(INITIAL_CUSTOM_ICONS);
      setActiveTileIndex(0);
      showToast('Reset to factory defaults');
    }
  };

  const activeTheme = themes[activeTileIndex] || themes[0];

  return (
    <div className="h-screen w-screen flex flex-col font-sans select-none overflow-hidden">
      {/* Top Header (Hidden in Preview Mode) */}
      {appMode !== 'preview' && (
        <Header
          themes={themes}
          activeTileIndex={activeTileIndex}
          onSelectTile={setActiveTileIndex}
          onSetAppMode={handleSetAppMode}
          onCopyShareLink={handleCopyShareLink}
          onSaveToBrowser={() => saveToLocalStorage(true)}
          onDownloadHtml={handleDownloadHtml}
          onExportJson={() => {
            downloadBundleJson(currentBundle);
            showToast('Exported settings JSON!');
          }}
          onImportJson={handleImportJson}
        />
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Stage Canvas */}
        <main
          style={{ backgroundColor: globalLayout.pageBgColor }}
          className="flex-1 relative flex flex-col justify-between overflow-y-auto overflow-x-hidden p-6 sm:p-10 transition-colors duration-200"
        >
          {/* Stage Toolbar (Hidden in Preview Mode) */}
          {appMode !== 'preview' && (
            <div className="w-full max-w-6xl mx-auto flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-xs text-xs text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Hover tiles to view{' '}
                  <strong className="text-slate-800">
                    4-icon loop + smooth 3-color gradient outline
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-300 shadow-xs text-xs">
                  <span className="text-slate-500 font-medium">Page BG:</span>
                  <input
                    type="color"
                    value={globalLayout.pageBgColor}
                    onChange={(e) => handleUpdateGlobal({ pageBgColor: e.target.value })}
                    className="w-5 h-5 rounded cursor-pointer border border-slate-300 bg-transparent"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setForceHoverLoop((prev) => !prev)}
                  className={`px-3 py-1.5 text-xs rounded-full shadow-xs transition font-medium flex items-center gap-1.5 ${
                    forceHoverLoop
                      ? 'bg-sky-600 text-white hover:bg-sky-700'
                      : 'bg-white/90 backdrop-blur border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {forceHoverLoop ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Hover Loop</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-sky-600" />
                      <span>Preview Hover Loop</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Tiles Grid */}
          <div className="w-full max-w-6xl mx-auto my-auto flex flex-col items-center py-4">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
              {themes.map((theme, idx) => (
                <TileCard
                  key={theme.id}
                  theme={theme}
                  index={idx}
                  isActive={idx === activeTileIndex}
                  isSelected={idx === activeTileIndex}
                  isPreviewMode={appMode === 'preview'}
                  forceHoverLoop={forceHoverLoop}
                  globalLayout={globalLayout}
                  customIcons={customIcons}
                  onSelect={() => {
                    setActiveTileIndex(idx);
                  }}
                />
              ))}
            </div>

            {/* Stage Legend */}
            {appMode !== 'preview' && (
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs text-slate-600 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-300/60 shadow-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-300 to-emerald-500" />
                  3-color animated gradient outline
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  Transparent matte glass
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Strict 16px icon-title spacing
                </span>
              </div>
            )}
          </div>

          {/* Status Bar */}
          {appMode !== 'preview' && (
            <div className="w-full max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-300/40">
              <span>
                Selected: <strong>{activeTheme.title}</strong> ({activeTheme.id})
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                <Maximize className="w-3 h-3 text-sky-600" /> Spacing:{' '}
                <strong>{globalLayout.iconGap}px</strong> • Size:{' '}
                <strong>{globalLayout.fontSize}px</strong>
              </span>
            </div>
          )}
        </main>

        {/* Right Inspector Panel */}
        {appMode !== 'preview' && (
          <InspectorPanel
            activeTheme={activeTheme}
            globalLayout={globalLayout}
            customIcons={customIcons}
            lastSavedText={lastSavedText}
            onUpdateTheme={handleUpdateActiveTheme}
            onUpdateGlobal={handleUpdateGlobal}
            onOpenIconPicker={(slot) => setIconPickerSlot(slot)}
            onSetAppMode={handleSetAppMode}
            onSaveToBrowser={() => saveToLocalStorage(true)}
            onCopyShareLink={handleCopyShareLink}
            onDownloadSvg={() => {
              downloadStandaloneSvg(activeTheme, globalLayout, customIcons);
              showToast(`Exported ${activeTheme.id}-animated-tile.svg!`);
            }}
            onDownloadHtml={handleDownloadHtml}
            onResetDefaults={handleResetDefaults}
          />
        )}
      </div>

      {/* Floating Preview Mode Switcher */}
      {appMode === 'preview' && (
        <FloatingPreviewBar
          onCopyShareLink={handleCopyShareLink}
          onExitPreview={() => handleSetAppMode('edit')}
        />
      )}

      {/* Icon Picker Modal */}
      {iconPickerSlot !== null && (
        <IconPickerModal
          isOpen={iconPickerSlot !== null}
          onClose={() => setIconPickerSlot(null)}
          targetSlot={iconPickerSlot}
          currentIconKey={activeTheme.icons[iconPickerSlot]}
          onSelectIcon={handleSelectIconForSlot}
          customIcons={customIcons}
          onAddCustomIcon={handleAddCustomIcon}
          onDeleteCustomIcon={handleDeleteCustomIcon}
        />
      )}

      {/* Cloud Share Modal */}
      {shareModalData && (
        <ShareModal
          isOpen={shareModalData !== null}
          onClose={() => setShareModalData(null)}
          shareUrl={shareModalData.url}
          shareId={shareModalData.id}
          onDownloadHtml={handleDownloadHtml}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
