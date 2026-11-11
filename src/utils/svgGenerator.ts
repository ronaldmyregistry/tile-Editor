import { ThemeTile, GlobalLayout, IconDefinition, TileFXBundle } from '../types/tilefx';
import { BUILTIN_ICONS } from '../data/presetIcons';

const THEME_PALETTES: Record<string, string[]> = {
  giftlist: ['#E53E3E', '#2E7D32', '#F6E05E', '#FFFFFF'],
  wedding: ['#F6AD55', '#F687B3', '#D69E2E', '#FED7E2'],
  baby: ['#90CDF4', '#FBB6CE', '#FEEBC8', '#C6F6D5'],
  nonprofit: ['#FB7185', '#2DD4BF', '#FCD34D', '#A78BFA'],
};

export function getIcon(
  key: string,
  customIcons: Record<string, IconDefinition> = {}
): IconDefinition {
  if (customIcons[key]) return customIcons[key];
  if (BUILTIN_ICONS[key]) return BUILTIN_ICONS[key];
  return BUILTIN_ICONS.gift_box;
}

export function escapeXml(str: string): string {
  if (!str) return '';
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export interface ParticleData {
  elements: string;
  css: string;
}

function pseudoRandom(seed: number): number {
  const s = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}

export function generateParticleElements(
  theme: ThemeTile,
  isHoveredOnly: boolean = false
): ParticleData {
  if (!theme.particlesEnabled) return { elements: '', css: '' };
  const count = theme.particleCount || 24;
  const speed = theme.particleSpeed || 2.8;
  const type = theme.particleType || 'confetti_pop';
  const sizeMultiplier = Math.max(0.3, theme.particleSize !== undefined ? theme.particleSize : 1.0);

  // Use custom user-configured colors if provided, else fallback to theme palette
  const palette =
    theme.particleColors && theme.particleColors.length > 0
      ? theme.particleColors
      : THEME_PALETTES[theme.id] || [theme.particleColor || '#ffffff'];

  const elements: string[] = [];
  const cssRules: string[] = [];

  if (type === 'confetti_pop') {
    // 1. ORGANIC DUAL CORNER EXPLOSION CANNONS (Fires once on hover with natural ballistic physics)
    const popPerCannon = 12; // 12 left + 12 right = 24 varied burst particles

    // Left Cannon Keyframes & Elements (Origin: x: 18, y: 190)
    for (let i = 0; i < popPerCannon; i++) {
      const angle = 0.42 + pseudoRandom(i * 7 + 1) * 0.82; // 24° to 71° fan burst toward top-center
      const vel = 125 + pseudoRandom(i * 11 + 3) * 90; // 125px to 215px explosive launch
      const apexX = Math.round(18 + Math.cos(angle) * vel * 0.95);
      const apexY = Math.round(190 - Math.sin(angle) * vel * 0.90);
      const sway = Math.round((pseudoRandom(i * 13 + 5) - 0.5) * 44);
      const rot = Math.round(420 + pseudoRandom(i * 17 + 2) * 720);
      const popDur = (1.25 + pseudoRandom(i * 19 + 4) * 0.35).toFixed(2);
      const popDelay = (pseudoRandom(i * 23 + 6) * 0.06).toFixed(3); // Fast explosive staccato burst
      const kfName = `kfPopL_${theme.id}_${i}`;

      cssRules.push(`
        @keyframes ${kfName} {
          0% { transform: translate(18px, 190px) scale(0.2) rotate(0deg); opacity: 0; }
          4% { opacity: 1; }
          32% { transform: translate(${apexX}px, ${apexY}px) scale(1.1) rotate(${Math.round(rot * 0.6)}deg); opacity: 1; }
          65% { transform: translate(${apexX + sway}px, ${apexY + 55}px) scale(1.0) rotate(${rot}deg); opacity: 0.9; }
          100% { transform: translate(${apexX + Math.round(sway * 1.8)}px, 218px) scale(0.8) rotate(${Math.round(rot * 1.3)}deg); opacity: 0; }
        }
      `);

      // Rich physical variety: wide streamers, square tickers, metallic sequins, and diamond stars
      const kind = i % 4;
      const color = palette[i % palette.length];
      let shapeSvg = '';

      if (kind === 0) {
        // Long streamer ribbon
        const rectW = (9.5 * sizeMultiplier * (0.85 + pseudoRandom(i * 3) * 0.3)).toFixed(1);
        const rectH = (3.8 * sizeMultiplier).toFixed(1);
        const halfW = (-parseFloat(rectW) / 2).toFixed(1);
        const halfH = (-parseFloat(rectH) / 2).toFixed(1);
        shapeSvg = `<rect x="${halfW}" y="${halfH}" width="${rectW}" height="${rectH}" rx="1.2" fill="${color}" />`;
      } else if (kind === 1) {
        // Metallic circular sequin
        const circleR = (3.4 * sizeMultiplier * (0.85 + pseudoRandom(i * 5) * 0.3)).toFixed(1);
        shapeSvg = `<circle cx="0" cy="0" r="${circleR}" fill="${color}" />`;
      } else if (kind === 2) {
        // Square ticker
        const side = (5.4 * sizeMultiplier).toFixed(1);
        const halfS = (-parseFloat(side) / 2).toFixed(1);
        shapeSvg = `<rect x="${halfS}" y="${halfS}" width="${side}" height="${side}" rx="0.8" fill="${color}" />`;
      } else {
        // Diamond sparkle star
        const d = (4.5 * sizeMultiplier).toFixed(1);
        const dMini = (1.4 * sizeMultiplier).toFixed(1);
        shapeSvg = `<polygon points="0,-${d} ${dMini},-${dMini} ${d},0 ${dMini},${dMini} 0,${d} -${dMini},${dMini} -${d},0 -${dMini},-${dMini}" fill="${color}"/>`;
      }

      elements.push(`<g class="pop-bl-l pop-bl-l-${i}">${shapeSvg}</g>`);
    }

    // Right Cannon Keyframes & Elements (Origin: x: 246, y: 190)
    for (let i = 0; i < popPerCannon; i++) {
      const angle = 0.42 + pseudoRandom(i * 7 + 2) * 0.82; // 24° to 71° fan burst toward top-center
      const vel = 125 + pseudoRandom(i * 11 + 4) * 90;
      const apexX = Math.round(246 - Math.cos(angle) * vel * 0.95);
      const apexY = Math.round(190 - Math.sin(angle) * vel * 0.90);
      const sway = Math.round((pseudoRandom(i * 13 + 6) - 0.5) * 44);
      const rot = -Math.round(420 + pseudoRandom(i * 17 + 3) * 720);
      const popDur = (1.25 + pseudoRandom(i * 19 + 5) * 0.35).toFixed(2);
      const popDelay = (pseudoRandom(i * 23 + 7) * 0.06).toFixed(3);
      const kfName = `kfPopR_${theme.id}_${i}`;

      cssRules.push(`
        @keyframes ${kfName} {
          0% { transform: translate(246px, 190px) scale(0.2) rotate(0deg); opacity: 0; }
          4% { opacity: 1; }
          32% { transform: translate(${apexX}px, ${apexY}px) scale(1.1) rotate(${Math.round(rot * 0.6)}deg); opacity: 1; }
          65% { transform: translate(${apexX + sway}px, ${apexY + 55}px) scale(1.0) rotate(${rot}deg); opacity: 0.9; }
          100% { transform: translate(${apexX + Math.round(sway * 1.8)}px, 218px) scale(0.8) rotate(${Math.round(rot * 1.3)}deg); opacity: 0; }
        }
      `);

      const kind = (i + 1) % 4;
      const color = palette[(i + 1) % palette.length];
      let shapeSvg = '';

      if (kind === 0) {
        const rectW = (9.5 * sizeMultiplier * (0.85 + pseudoRandom(i * 3 + 1) * 0.3)).toFixed(1);
        const rectH = (3.8 * sizeMultiplier).toFixed(1);
        const halfW = (-parseFloat(rectW) / 2).toFixed(1);
        const halfH = (-parseFloat(rectH) / 2).toFixed(1);
        shapeSvg = `<rect x="${halfW}" y="${halfH}" width="${rectW}" height="${rectH}" rx="1.2" fill="${color}" />`;
      } else if (kind === 1) {
        const circleR = (3.4 * sizeMultiplier * (0.85 + pseudoRandom(i * 5 + 1) * 0.3)).toFixed(1);
        shapeSvg = `<circle cx="0" cy="0" r="${circleR}" fill="${color}" />`;
      } else if (kind === 2) {
        const side = (5.4 * sizeMultiplier).toFixed(1);
        const halfS = (-parseFloat(side) / 2).toFixed(1);
        shapeSvg = `<rect x="${halfS}" y="${halfS}" width="${side}" height="${side}" rx="0.8" fill="${color}" />`;
      } else {
        const d = (4.5 * sizeMultiplier).toFixed(1);
        const dMini = (1.4 * sizeMultiplier).toFixed(1);
        shapeSvg = `<polygon points="0,-${d} ${dMini},-${dMini} ${d},0 ${dMini},${dMini} 0,${d} -${dMini},${dMini} -${d},0 -${dMini},-${dMini}" fill="${color}"/>`;
      }

      elements.push(`<g class="pop-bl-r pop-bl-r-${i}">${shapeSvg}</g>`);
    }

    // 2. CONTINUOUS ORGANIC FALLING CONFETTI FROM TOP (Cascades gently after the initial pop reaches apex)
    const fallCount = 16;
    for (let i = 0; i < fallCount; i++) {
      const topX = Math.round(14 + pseudoRandom(i * 29 + 1) * 236);
      const sway1 = Math.round((pseudoRandom(i * 31 + 2) - 0.5) * 32);
      const sway2 = Math.round((pseudoRandom(i * 37 + 4) - 0.5) * 44);
      const rotDir = pseudoRandom(i * 41 + 5) > 0.5 ? 1 : -1;
      const rotAmt = Math.round(360 + pseudoRandom(i * 43 + 6) * 360) * rotDir;
      const fallDur = (speed * (0.8 + pseudoRandom(i * 47 + 7) * 0.45)).toFixed(2);
      const kfName = `kfFallRain_${theme.id}_${i}`;

      cssRules.push(`
        @keyframes ${kfName} {
          0% { transform: translate(${topX}px, -14px) rotate(0deg); opacity: 0; }
          8% { opacity: 1; }
          50% { transform: translate(${topX + sway1}px, 98px) rotate(${Math.round(rotAmt * 0.5)}deg); opacity: 1; }
          85% { opacity: 0.9; }
          100% { transform: translate(${topX + sway2}px, 215px) rotate(${rotAmt}deg); opacity: 0; }
        }
      `);

      const rectW = (8.0 * sizeMultiplier * (0.85 + pseudoRandom(i * 7) * 0.3)).toFixed(1);
      const rectH = (4.2 * sizeMultiplier * (0.85 + pseudoRandom(i * 9) * 0.3)).toFixed(1);
      const halfW = (-parseFloat(rectW) / 2).toFixed(1);
      const halfH = (-parseFloat(rectH) / 2).toFixed(1);
      const circleR = (3.2 * sizeMultiplier).toFixed(1);
      const color = palette[(i + 2) % palette.length];
      const isRibbon = i % 3 !== 2;

      const shapeSvg = isRibbon
        ? `<rect x="${halfW}" y="${halfH}" width="${rectW}" height="${rectH}" rx="1" fill="${color}" />`
        : `<circle cx="0" cy="0" r="${circleR}" fill="${color}" />`;

      elements.push(`<g class="fall-rain fall-rain-${i}">${shapeSvg}</g>`);
    }

    // CSS Hover Activation & Hardware GPU Acceleration
    const popAnimTrigger = isHoveredOnly
      ? `
      ${Array.from({ length: popPerCannon }, (_, i) => {
        const delayL = (pseudoRandom(i * 23 + 6) * 0.06).toFixed(3);
        const durL = (1.25 + pseudoRandom(i * 19 + 4) * 0.35).toFixed(2);
        const delayR = (pseudoRandom(i * 23 + 7) * 0.06).toFixed(3);
        const durR = (1.25 + pseudoRandom(i * 19 + 5) * 0.35).toFixed(2);
        return `
        .card-group:hover .pop-bl-l-${i} {
          animation: kfPopL_${theme.id}_${i} ${durL}s cubic-bezier(0.12, 0.85, 0.25, 1) ${delayL}s 1 normal forwards;
        }
        .card-group:hover .pop-bl-r-${i} {
          animation: kfPopR_${theme.id}_${i} ${durR}s cubic-bezier(0.12, 0.85, 0.25, 1) ${delayR}s 1 normal forwards;
        }
        `;
      }).join('\n')}
      ${Array.from({ length: fallCount }, (_, i) => {
        const dur = (speed * (0.8 + pseudoRandom(i * 47 + 7) * 0.45)).toFixed(2);
        // Staggered positive delay so the dual cannon burst pops first, then falling rain cascades in
        const delay = (0.35 + ((i * 0.18) % 1.8)).toFixed(2);
        return `
        .card-group:hover .fall-rain-${i} {
          animation: kfFallRain_${theme.id}_${i} ${dur}s linear ${delay}s infinite;
        }
        `;
      }).join('\n')}
      `
      : `
      ${Array.from({ length: popPerCannon }, (_, i) => {
        const delayL = (pseudoRandom(i * 23 + 6) * 0.06).toFixed(3);
        const delayR = (pseudoRandom(i * 23 + 7) * 0.06).toFixed(3);
        return `
        .card-group .pop-bl-l-${i} {
          animation: kfPopL_${theme.id}_${i} 2.6s cubic-bezier(0.12, 0.85, 0.25, 1) ${delayL}s infinite;
        }
        .card-group .pop-bl-r-${i} {
          animation: kfPopR_${theme.id}_${i} 2.6s cubic-bezier(0.12, 0.85, 0.25, 1) ${delayR}s infinite;
        }
        `;
      }).join('\n')}
      ${Array.from({ length: fallCount }, (_, i) => {
        const dur = (speed * (0.8 + pseudoRandom(i * 47 + 7) * 0.45)).toFixed(2);
        const delay = (pseudoRandom(i * 53 + 8) * parseFloat(dur)).toFixed(2);
        return `
        .card-group .fall-rain-${i} {
          animation: kfFallRain_${theme.id}_${i} ${dur}s linear -${delay}s infinite;
        }
        `;
      }).join('\n')}
      `;

    const fullCss = `
      .card-group .pop-bl-l, .card-group .pop-bl-r, .card-group .fall-rain {
        opacity: 0;
      }
      ${cssRules.join('\n')}
      ${popAnimTrigger}
    `;

    return {
      elements: elements.join('\n'),
      css: fullCss,
    };
  }

  // 2. CONTINUOUS TUMBLING CONFETTI (GPU-accelerated CSS keyframes, zero SMIL lag)
  if (type === 'confetti') {
    const confettiCount = Math.max(16, count);
    for (let i = 0; i < confettiCount; i++) {
      const startX = Math.round(12 + pseudoRandom(i * 31 + 3) * 240);
      const sway1 = Math.round((pseudoRandom(i * 37 + 7) - 0.5) * 36);
      const sway2 = Math.round((pseudoRandom(i * 41 + 11) - 0.5) * 48);
      const rot = Math.round(360 + pseudoRandom(i * 43 + 13) * 540) * (i % 2 === 0 ? 1 : -1);
      const dur = (speed * (0.85 + pseudoRandom(i * 47 + 17) * 0.5)).toFixed(2);
      const delay = (pseudoRandom(i * 53 + 19) * parseFloat(dur)).toFixed(2);
      const kfName = `kfTumbleConfetti_${theme.id}_${i}`;

      cssRules.push(`
        @keyframes ${kfName} {
          0% { transform: translate(${startX}px, -15px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translate(${startX + sway1}px, 95px) rotate(${Math.round(rot * 0.5)}deg); opacity: 1; }
          90% { opacity: 0.9; }
          100% { transform: translate(${startX + sway2}px, 215px) rotate(${rot}deg); opacity: 0; }
        }
      `);

      const rectW = (8.5 * sizeMultiplier * (0.85 + pseudoRandom(i * 7) * 0.3)).toFixed(1);
      const rectH = (4.2 * sizeMultiplier * (0.85 + pseudoRandom(i * 9) * 0.3)).toFixed(1);
      const halfW = (-parseFloat(rectW) / 2).toFixed(1);
      const halfH = (-parseFloat(rectH) / 2).toFixed(1);
      const color = palette[i % palette.length];

      elements.push(
        `<g class="cont-confetti cont-confetti-${i}"><rect x="${halfW}" y="${halfH}" width="${rectW}" height="${rectH}" rx="1" fill="${color}" /></g>`
      );
    }

    const hoverTrigger = isHoveredOnly
      ? Array.from({ length: confettiCount }, (_, i) => {
          const dur = (speed * (0.85 + pseudoRandom(i * 47 + 17) * 0.5)).toFixed(2);
          const delay = (pseudoRandom(i * 53 + 19) * parseFloat(dur)).toFixed(2);
          return `.card-group:hover .cont-confetti-${i} { animation: kfTumbleConfetti_${theme.id}_${i} ${dur}s linear -${delay}s infinite; }`;
        }).join('\n')
      : Array.from({ length: confettiCount }, (_, i) => {
          const dur = (speed * (0.85 + pseudoRandom(i * 47 + 17) * 0.5)).toFixed(2);
          const delay = (pseudoRandom(i * 53 + 19) * parseFloat(dur)).toFixed(2);
          return `.card-group .cont-confetti-${i} { animation: kfTumbleConfetti_${theme.id}_${i} ${dur}s linear -${delay}s infinite; }`;
        }).join('\n');

    const fullCss = `
      .card-group .cont-confetti {
        opacity: 0;
      }
      ${cssRules.join('\n')}
      ${hoverTrigger}
    `;

    return {
      elements: elements.join('\n'),
      css: fullCss,
    };
  }

  // Other particle types with direct geometric scaling
  for (let i = 0; i < count; i++) {
    const seedX = ((i * 37 + 13) % 230) + 15;
    const seedY = ((i * 47 + 7) % 150) + 15;
    const duration = (speed * (0.8 + ((i % 5) * 0.15))).toFixed(2);
    const delay = ((i * 0.23) % 2.5).toFixed(2);
    const color = palette[i % palette.length];

    // Geometric dimensions based directly on sizeMultiplier
    const rectW = (7.5 * sizeMultiplier).toFixed(1);
    const rectH = (4.0 * sizeMultiplier).toFixed(1);
    const halfW = (-parseFloat(rectW) / 2).toFixed(1);
    const halfH = (-parseFloat(rectH) / 2).toFixed(1);
    const circleR = (3.0 * sizeMultiplier).toFixed(1);

    let shapeSvg = '';
    if (type === 'rose_petals') {
      const pScale = (0.95 * sizeMultiplier).toFixed(2);
      shapeSvg = `<path d="M0 -7 C-4 -7 -7 -3 -5 3 C-3 8 0 10 2 10 C5 10 8 7 7 2 C6 -4 3 -7 0 -7 Z" fill="${color}" fill-opacity="0.85" transform="scale(${pScale})"/>`;
    } else if (type === 'hearts') {
      const pScale = (0.95 * sizeMultiplier).toFixed(2);
      shapeSvg = `<path d="M0 2 C-2 -2 -5 -1 -5 2 C-5 4 -2 6 0 8 C2 6 5 4 5 2 C5 -1 2 -2 0 2 Z" fill="${color}" transform="scale(${pScale}) translate(0, -4)"/>`;
    } else if (type === 'sparkles') {
      const pScale = (0.95 * sizeMultiplier).toFixed(2);
      shapeSvg = `
        <g transform="scale(${pScale})">
          <polygon points="0,-4 1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1" fill="${color}"/>
          <circle cx="0" cy="0" r="1" fill="#ffffff"/>
        </g>`;
    } else if (type === 'snow_crystals') {
      const pScale = (0.95 * sizeMultiplier).toFixed(2);
      shapeSvg = `
        <g transform="scale(${pScale})" stroke="${color}" stroke-width="${Math.max(0.8, 0.9 * Math.min(sizeMultiplier, 1.6)).toFixed(1)}" fill="none">
          <line x1="-4" y1="0" x2="4" y2="0"/>
          <line x1="0" y1="-4" x2="0" y2="4"/>
          <line x1="-3" y1="-3" x2="3" y2="3"/>
          <line x1="-3" y1="3" x2="3" y2="-3"/>
          <circle cx="0" cy="0" r="0.9" fill="${color}"/>
        </g>`;
    } else if (type === 'bubbles') {
      const pScale = (0.95 * sizeMultiplier).toFixed(2);
      shapeSvg = `
        <g transform="scale(${pScale})">
          <circle cx="0" cy="0" r="4" fill="${color}" fill-opacity="0.35" stroke="${color}" stroke-width="0.8"/>
          <circle cx="-1.2" cy="-1.2" r="1.1" fill="#ffffff" fill-opacity="0.7"/>
        </g>`;
    } else if (type === 'snowflakes') {
      shapeSvg = `<circle cx="0" cy="0" r="${circleR}" fill="${color}" fill-opacity="0.85"/>`;
    } else {
      shapeSvg = `<circle cx="0" cy="0" r="${circleR}" fill="${color}"/>`;
    }

    elements.push(`
      <g transform="translate(${seedX}, ${seedY})">
        <animateTransform attributeName="transform" type="translate"
          values="${seedX} ${seedY - 14}; ${seedX + (i % 2 === 0 ? 8 : -8)} ${seedY + 12}; ${seedX} ${seedY + 30}"
          dur="${duration}s" begin="-${delay}s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15; 1; 0.15" dur="${duration}s" begin="-${delay}s" repeatCount="indefinite" />
        ${shapeSvg}
      </g>
    `);
  }

  return {
    elements: elements.join('\n'),
    css: '',
  };
}

export function buildStandaloneSvg(
  theme: ThemeTile,
  globalLayout: GlobalLayout,
  isHoveredOnly: boolean = false,
  customIcons: Record<string, IconDefinition> = {}
): string {
  const innerW = 260;
  const innerH = 190;
  const pad = 2;
  const w = innerW + pad * 2;
  const h = innerH + pad * 2;
  const r = theme.borderRadius || 20;
  const dur = theme.cycleDuration || 2.8;
  const strokeBorderW = Math.max(1.0, theme.borderWidth || 1.5);
  const strokeW = Math.max(0.75, theme.iconStroke !== undefined ? theme.iconStroke : 1.0);
  const iconCol = theme.iconColor || '#4A6572';
  const textCol = theme.textColor || '#1e293b';
  const gradSpeed = theme.beamSpeed || 3.0;

  const iconBoxSize = globalLayout.iconSize || 48;
  const iconBoxX = pad + (innerW - iconBoxSize) / 2;
  const hoverScale = globalLayout.iconHoverScale || 1.5;

  const gap = globalLayout.iconGap !== undefined ? globalLayout.iconGap : 16;
  const words = (theme.title || '').trim().split(' ');
  let line1 = theme.title;
  let line2 = '';
  if (words.length > 2) {
    const mid = Math.ceil(words.length / 2);
    line1 = words.slice(0, mid).join(' ');
    line2 = words.slice(mid).join(' ');
  }
  const lineHeight = globalLayout.fontSize * 1.3;
  const textBlockHeight = line2 ? lineHeight * 2 : lineHeight;
  const totalContentHeight = iconBoxSize + gap + textBlockHeight;

  const contentStartY = pad + Math.max(12, (innerH - totalContentHeight) / 2);
  const iconBoxY = contentStartY;
  const textLine1Y = iconBoxY + iconBoxSize + gap + globalLayout.fontSize * 0.85;
  const textLine2Y = textLine1Y + lineHeight;
  const iconCenterX = pad + innerW / 2;
  const iconCenterY = iconBoxY + iconBoxSize / 2;

  let anim1: string, anim2: string, anim3: string, anim4: string;
  if (theme.iconAnimType === 'bounce') {
    anim1 = `0%, 20% { opacity: 1; transform: translateY(0) scale(${hoverScale}); } 25%, 95% { opacity: 0; transform: translateY(-8px) scale(${hoverScale * 0.7}); } 100% { opacity: 1; transform: translateY(0) scale(${hoverScale}); }`;
    anim2 = `0%, 20% { opacity: 0; transform: translateY(8px) scale(${hoverScale * 0.7}); } 25%, 45% { opacity: 1; transform: translateY(0) scale(${hoverScale}); } 50%, 100% { opacity: 0; transform: translateY(-8px) scale(${hoverScale * 0.7}); }`;
    anim3 = `0%, 45% { opacity: 0; transform: translateY(8px) scale(${hoverScale * 0.7}); } 50%, 70% { opacity: 1; transform: translateY(0) scale(${hoverScale}); } 75%, 100% { opacity: 0; transform: translateY(-8px) scale(${hoverScale * 0.7}); }`;
    anim4 = `0%, 70% { opacity: 0; transform: translateY(8px) scale(${hoverScale * 0.7}); } 75%, 95% { opacity: 1; transform: translateY(0) scale(${hoverScale}); } 100% { opacity: 0; transform: translateY(-8px) scale(${hoverScale * 0.7}); }`;
  } else if (theme.iconAnimType === 'fade') {
    anim1 = `0%, 20% { opacity: 1; transform: scale(${hoverScale}); } 25%, 95% { opacity: 0; transform: scale(${hoverScale * 0.9}); } 100% { opacity: 1; transform: scale(${hoverScale}); }`;
    anim2 = `0%, 20% { opacity: 0; transform: scale(${hoverScale * 0.9}); } 25%, 45% { opacity: 1; transform: scale(${hoverScale}); } 50%, 100% { opacity: 0; transform: scale(${hoverScale * 0.9}); }`;
    anim3 = `0%, 45% { opacity: 0; transform: scale(${hoverScale * 0.9}); } 50%, 70% { opacity: 1; transform: scale(${hoverScale}); } 75%, 100% { opacity: 0; transform: scale(${hoverScale * 0.9}); }`;
    anim4 = `0%, 70% { opacity: 0; transform: scale(${hoverScale * 0.9}); } 75%, 95% { opacity: 1; transform: scale(${hoverScale}); } 100% { opacity: 0; transform: scale(${hoverScale * 0.9}); }`;
  } else if (theme.iconAnimType === 'slide') {
    anim1 = `0%, 20% { opacity: 1; transform: translateY(0) scale(${hoverScale}); } 25%, 95% { opacity: 0; transform: translateY(12px) scale(${hoverScale * 0.8}); } 100% { opacity: 1; transform: translateY(0) scale(${hoverScale}); }`;
    anim2 = `0%, 20% { opacity: 0; transform: translateY(-12px) scale(${hoverScale * 0.8}); } 25%, 45% { opacity: 1; transform: translateY(0) scale(${hoverScale}); } 50%, 100% { opacity: 0; transform: translateY(12px) scale(${hoverScale * 0.8}); }`;
    anim3 = `0%, 45% { opacity: 0; transform: translateY(-12px) scale(${hoverScale * 0.8}); } 50%, 70% { opacity: 1; transform: translateY(0) scale(${hoverScale}); } 75%, 100% { opacity: 0; transform: translateY(12px) scale(${hoverScale * 0.8}); }`;
    anim4 = `0%, 70% { opacity: 0; transform: translateY(-12px) scale(${hoverScale * 0.8}); } 75%, 95% { opacity: 1; transform: translateY(0) scale(${hoverScale}); } 100% { opacity: 0; transform: translateY(-12px) scale(${hoverScale * 0.8}); }`;
  } else {
    // 'pop' or default
    anim1 = `0%, 20% { opacity: 1; transform: scale(${hoverScale}); } 25%, 95% { opacity: 0; transform: scale(${hoverScale * 0.6}); } 100% { opacity: 1; transform: scale(${hoverScale}); }`;
    anim2 = `0%, 20% { opacity: 0; transform: scale(${hoverScale * 0.6}); } 25%, 45% { opacity: 1; transform: scale(${hoverScale}); } 50%, 100% { opacity: 0; transform: scale(${hoverScale * 0.6}); }`;
    anim3 = `0%, 45% { opacity: 0; transform: scale(${hoverScale * 0.6}); } 50%, 70% { opacity: 1; transform: scale(${hoverScale}); } 75%, 100% { opacity: 0; transform: scale(${hoverScale * 0.6}); }`;
    anim4 = `0%, 70% { opacity: 0; transform: scale(${hoverScale * 0.6}); } 75%, 95% { opacity: 1; transform: scale(${hoverScale}); } 100% { opacity: 0; transform: scale(${hoverScale * 0.6}); }`;
  }

  const iconEntries = theme.icons
    .map((id, index) => {
      const iconData = getIcon(id, customIcons);
      const animName = `iconCycle${index + 1}`;
      return `
        <g class="icon-stage" style="transform-origin: ${iconCenterX}px ${iconCenterY}px; animation: ${animName} ${dur}s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;">
          <svg x="${iconBoxX}" y="${iconBoxY}" width="${iconBoxSize}" height="${iconBoxSize}" viewBox="${iconData.viewBox || '0 0 64 64'}" preserveAspectRatio="xMidYMid meet" fill="none" stroke="${iconCol}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round">
            ${iconData.svg}
          </svg>
        </g>
      `;
    })
    .join('\n');

  const { elements: particlesHtml, css: particleCss } = generateParticleElements(theme, isHoveredOnly);

  const halfStroke = strokeBorderW / 2;
  const rectX = pad + halfStroke;
  const rectY = pad + halfStroke;
  const rectW = innerW - strokeBorderW;
  const rectH = innerH - strokeBorderW;
  const rectR = Math.max(0, r - halfStroke);

  const staticIconData = getIcon(theme.icons[0], customIcons);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="auto" style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; overflow: visible;">
  <defs>
    <filter id="softMatteGlass_${theme.id}" x="-10%" y="-10%" width="125%" height="125%">
      <feGaussianBlur stdDeviation="${theme.glassBlur / 4}" result="blur" />
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.05"/>
    </filter>

    <clipPath id="tileClip_${theme.id}">
      <rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" rx="${rectR}" />
    </clipPath>

    <linearGradient id="smoothGradientOutline_${theme.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.beamColor1}">
        <animate attributeName="stop-color" 
          values="${theme.beamColor1}; ${theme.beamColor2}; ${theme.beamColor3}; ${theme.beamColor1}" 
          dur="${gradSpeed}s" repeatCount="indefinite" />
      </stop>
      <stop offset="50%" stop-color="${theme.beamColor2}">
        <animate attributeName="stop-color" 
          values="${theme.beamColor2}; ${theme.beamColor3}; ${theme.beamColor1}; ${theme.beamColor2}" 
          dur="${gradSpeed}s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stop-color="${theme.beamColor3}">
        <animate attributeName="stop-color" 
          values="${theme.beamColor3}; ${theme.beamColor1}; ${theme.beamColor2}; ${theme.beamColor3}" 
          dur="${gradSpeed}s" repeatCount="indefinite" />
      </stop>
    </linearGradient>

    <style>
      @keyframes iconCycle1 { ${anim1} }
      @keyframes iconCycle2 { ${anim2} }
      @keyframes iconCycle3 { ${anim3} }
      @keyframes iconCycle4 { ${anim4} }

      .card-group {
        cursor: pointer;
        transition: transform 0.25s ease;
      }
      .card-group .gradient-outline {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .card-group .default-outline {
        opacity: 0.8;
        transition: opacity 0.3s ease;
      }
      .card-group .anim-fx {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .card-group .static-icon {
        opacity: 1;
        transform-origin: ${iconCenterX}px ${iconCenterY}px;
        transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      ${
        isHoveredOnly
          ? `
        .card-group:hover .gradient-outline { opacity: 1; }
        .card-group:hover .default-outline { opacity: 0; }
        .card-group:hover .anim-fx { opacity: 1; }
        .card-group:hover .static-icon { opacity: 0; transform: scale(${hoverScale}); }
        .card-group:hover { transform: translateY(-2px); }
      `
          : `
        .card-group .gradient-outline { opacity: 1; }
        .card-group .default-outline { opacity: 0; }
        .card-group .anim-fx { opacity: 1; }
        .card-group .static-icon { opacity: 0; transform: scale(${hoverScale}); }
      `
      }

      ${particleCss}
    </style>
  </defs>

  <g class="card-group" id="card-${theme.id}">
    <rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" rx="${rectR}" 
      fill="#ffffff" 
      fill-opacity="${theme.glassOpacity}" 
      filter="url(#softMatteGlass_${theme.id})" />

    <rect class="default-outline"
      x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" rx="${rectR}" 
      fill="none" 
      stroke="${theme.defaultBorderColor}" 
      stroke-width="1.0" />

    <g clip-path="url(#tileClip_${theme.id})" class="anim-fx">
      ${particlesHtml}
    </g>

    <rect class="gradient-outline" 
      x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" rx="${rectR}" 
      fill="none" 
      stroke="url(#smoothGradientOutline_${theme.id})" 
      stroke-width="${strokeBorderW}" />

    <svg x="${iconBoxX}" y="${iconBoxY}" width="${iconBoxSize}" height="${iconBoxSize}" viewBox="${staticIconData.viewBox || '0 0 64 64'}" preserveAspectRatio="xMidYMid meet" fill="none" stroke="${iconCol}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" class="static-icon">
      ${staticIconData.svg}
    </svg>

    <g class="anim-fx">
      ${iconEntries}
    </g>

    <text x="${iconCenterX}" y="${textLine1Y.toFixed(1)}" text-anchor="middle" font-size="${globalLayout.fontSize}" font-weight="${globalLayout.fontWeight}" fill="${textCol}" letter-spacing="-0.02em">
      ${escapeXml(line1)}
    </text>
    ${
      line2
        ? `
      <text x="${iconCenterX}" y="${textLine2Y.toFixed(1)}" text-anchor="middle" font-size="${globalLayout.fontSize}" font-weight="${globalLayout.fontWeight}" fill="${textCol}" letter-spacing="-0.02em">
        ${escapeXml(line2)}
      </text>
    `
        : ''
    }
  </g>
</svg>`;
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

export function downloadStandaloneSvg(
  theme: ThemeTile,
  globalLayout: GlobalLayout,
  customIcons: Record<string, IconDefinition>,
  isHoveredOnly: boolean = true
): void {
  const svg = buildStandaloneSvg(theme, globalLayout, isHoveredOnly, customIcons);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  triggerBlobDownload(blob, `${theme.id}-animated-tile.svg`);
}

export function downloadBundleJson(bundle: TileFXBundle): void {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  triggerBlobDownload(blob, 'tilefx-settings.json');
}
