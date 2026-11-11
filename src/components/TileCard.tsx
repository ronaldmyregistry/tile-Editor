import React, { useMemo } from 'react';
import { ThemeTile, GlobalLayout, IconDefinition } from '../types/tilefx';
import { buildStandaloneSvg, escapeXml } from '../utils/svgGenerator';

interface TileCardProps {
  theme: ThemeTile;
  index: number;
  isActive?: boolean;
  isSelected: boolean;
  isPreviewMode: boolean;
  forceHoverLoop: boolean;
  globalLayout: GlobalLayout;
  customIcons: Record<string, IconDefinition>;
  onSelect: () => void;
}

export const TileCard: React.FC<TileCardProps> = ({
  theme,
  isSelected,
  isPreviewMode,
  forceHoverLoop,
  globalLayout,
  customIcons,
  onSelect,
}) => {
  const svgHtml = useMemo(() => {
    return buildStandaloneSvg(theme, globalLayout, !forceHoverLoop, customIcons);
  }, [theme, globalLayout, forceHoverLoop, customIcons]);

  return (
    <div className="relative flex flex-col items-center transition-all group">
      <div
        onClick={onSelect}
        className={`w-full cursor-pointer rounded-2xl transition-all duration-200 ${
          isSelected && !isPreviewMode
            ? 'ring-2 ring-sky-500 shadow-lg scale-[1.01]'
            : 'hover:scale-[1.01]'
        }`}
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />

      {!isPreviewMode && (
        <div className="flex items-center justify-between w-full px-2 mt-2">
          <span className="text-[11px] font-semibold text-slate-600 font-sans truncate max-w-[160px]">
            {escapeXml(theme.title || '')}
          </span>
          <button
            type="button"
            onClick={onSelect}
            className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
              isSelected
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {isSelected ? 'EDITING' : 'SELECT'}
          </button>
        </div>
      )}
    </div>
  );
};
