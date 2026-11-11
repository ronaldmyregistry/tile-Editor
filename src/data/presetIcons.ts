import { IconDefinition, ThemeTile, GlobalLayout } from '../types/tilefx';

export const DEFAULT_GLOBAL_LAYOUT: GlobalLayout = {
  iconGap: 16,
  iconSize: 48,
  iconHoverScale: 1.5,
  fontSize: 15,
  fontWeight: 600,
  pageBgColor: '#e2e8f0',
};

export const BUILTIN_ICONS: Record<string, IconDefinition> = {
  // Gift List Presets
  gift_box: {
    name: '1. Gift Box',
    category: 'Gift List',
    viewBox: '0 0 64 64',
    svg: `
      <rect x="14" y="28" width="36" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="11" y="20" width="42" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="32" y1="20" x2="32" y2="52" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M32 20 C27 12 17 11 18 17 C19 21 27 20 32 20 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 20 C37 12 47 11 46 17 C45 21 37 20 32 20 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
  candycane: {
    name: '2. Candy Cane',
    category: 'Gift List',
    viewBox: '0 0 64 64',
    svg: `
      <path d="M22 50 L40 24 C45 17 38 9 30 11 C24 12 21 18 24 23 C26 25 30 24 30 21" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26 53 L44 27 C50 18 43 6 31 8 C21 10 18 19 22 25 L24 28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="24" y1="21" x2="31" y2="16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="33" y1="11" x2="39" y2="16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="39" y1="21" x2="45" y2="26" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="34" y1="30" x2="41" y2="35" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    `,
  },
  gingerbread: {
    name: '3. Gingerbread Man',
    category: 'Gift List',
    viewBox: '0 0 64 64',
    svg: `
      <path d="M32 10 C27 10 24 14 24 19 C24 22 25 24 27 25 C22 27 16 31 15 34 C14 38 17 40 21 38 C23 37 26 35 27 34 L27 41 C24 45 20 50 20 53 C20 56 23 57 26 55 C29 53 30 48 32 45 C34 48 35 53 38 55 C41 57 44 56 44 53 C44 50 40 45 37 41 L37 34 C38 35 41 37 43 38 C47 40 50 38 49 34 C48 31 42 27 37 25 C39 24 40 22 40 19 C40 14 37 10 32 10 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="29" cy="17" r="1.5" fill="currentColor"/>
      <circle cx="35" cy="17" r="1.5" fill="currentColor"/>
      <path d="M30 21 Q32 23 34 21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    `,
  },
  tree: {
    name: '4. Christmas Tree',
    category: 'Gift List',
    viewBox: '0 0 64 64',
    svg: `
      <polygon points="32,9 34,14 39,14 35,17 37,22 32,19 27,22 29,17 25,14 30,14" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M29 20 L24 28 C27 29 29 29 32 28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M35 20 L40 28 C37 29 35 29 32 28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M26 28 L19 38 C23 39 27 39 32 37" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M38 28 L45 38 C41 39 37 39 32 37" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M22 38 L14 49 C25 51 39 51 50 49 L42 38" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M29 50 L29 55 L35 55 L35 50" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    `,
  },

  // Wedding Presets
  wedding_glasses: {
    name: '1. Cheers Flutes',
    category: 'Wedding',
    viewBox: '0 0 64 64',
    svg: `
      <line x1="32" y1="8" x2="32" y2="13" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="25" y1="10" x2="28" y2="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="39" y1="10" x2="36" y2="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M14 17 L28 19 L26 36 C25 41 21 44 17 43 C13 42 11 38 12 33 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13 28 C18 29 23 30 27 29" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M18 44 L14 56 L10 57 L18 57" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M50 17 L36 19 L38 36 C39 41 43 44 47 43 C51 42 53 38 52 33 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M51 28 C46 29 41 30 37 29" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M46 44 L50 56 L54 57 L46 57" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
  wedding_bells: {
    name: '2. Wedding Bells',
    category: 'Wedding',
    viewBox: '0 0 64 64',
    svg: `
      <rect x="29" y="18" width="6" height="5" rx="1.5" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <path d="M29 20 C23 15 17 18 18 23 C20 27 25 25 29 23 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M35 20 C41 15 47 18 46 23 C44 27 39 25 35 23 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M27 25 L24 29 C23 31 22 36 19 43 C16 48 12 50 10 51 L29 51 C27 49 26 44 26 38 L28 25" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="17" cy="53" r="2.5" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <path d="M37 25 L40 29 C41 31 42 36 45 43 C48 48 52 50 54 51 L35 51 C37 49 38 44 38 38 L36 25" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="47" cy="53" r="2.5" fill="none" stroke="currentColor" stroke-width="2.5"/>
    `,
  },
  rings: {
    name: '3. Interlinked Rings',
    category: 'Wedding',
    viewBox: '0 0 64 64',
    svg: `
      <circle cx="26" cy="37" r="12" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="39" cy="31" r="12" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <path d="M36 19 L38 14 L44 17 L41 21" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
  cake: {
    name: '4. Wedding Cake',
    category: 'Wedding',
    viewBox: '0 0 64 64',
    svg: `
      <rect x="14" y="44" width="36" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <rect x="19" y="30" width="26" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <rect x="25" y="19" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <line x1="32" y1="10" x2="32" y2="19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    `,
  },

  // Baby Presets
  baby_rattle: {
    name: '1. Baby Rattle',
    category: 'Baby',
    viewBox: '0 0 64 64',
    svg: `
      <circle cx="45" cy="18" r="3.5" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <path d="M42 20 C49 27 49 37 42 44 C35 51 25 51 18 44 C22 36 30 28 42 20 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M35 24 C26 31 23 40 21 44" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M41 29 C33 37 30 43 28 47" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M20 46 L12 54 C10 56 10 59 12 61 C14 63 17 63 19 61 L27 53" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
  baby_stroller: {
    name: '2. Baby Carriage',
    category: 'Baby',
    viewBox: '0 0 64 64',
    svg: `
      <path d="M8 18 C13 19 16 22 17 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M17 25 L49 25 C50 33 47 38 43 39 L21 39 C18 39 17 37 17 32 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M31 25 C31 16 36 12 45 13 L49 25 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="38" y1="13" x2="41" y2="25" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="43" y1="13" x2="45" y2="25" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="23" cy="52" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="43" cy="52" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/>
    `,
  },
  baby_blocks: {
    name: '3. ABC Blocks',
    category: 'Baby',
    viewBox: '0 0 64 64',
    svg: `
      <polygon points="20,15 38,15 47,11 29,11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <polygon points="38,15 47,11 47,28 38,32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="20" y="15" width="18" height="17" rx="1" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <rect x="11" y="32" width="19" height="21" rx="1" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <rect x="30" y="32" width="19" height="21" rx="1" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <polygon points="49,32 56,28 56,48 49,53" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    `,
  },
  baby_mobile: {
    name: '4. Hanging Mobile',
    category: 'Baby',
    viewBox: '0 0 64 64',
    svg: `
      <path d="M30 11 C30 9 34 9 34 11 L32 15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M12 23 C23 16 43 16 54 23" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="19" y1="22" x2="19" y2="30" stroke="currentColor" stroke-width="2.5"/>
      <path d="M25 32 C21 32 15 35 15 41 C15 47 20 50 25 50 C21 48 20 40 25 32 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="32" y1="19" x2="32" y2="40" stroke="currentColor" stroke-width="2.5"/>
      <polygon points="32,41 35,46 40,47 36,50 37,55 32,52 27,55 28,50 24,47 29,46" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <line x1="47" y1="22" x2="47" y2="30" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="47" cy="37" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/>
    `,
  },

  // Nonprofit Presets
  nonprofit_heart: {
    name: '1. Heart Outline',
    category: 'Nonprofit',
    viewBox: '0 0 64 64',
    svg: `
      <path d="M32 52 L29 49 C18 39 11 32 11 24 C11 18 16 13 22 13 C26 13 29 15 32 18 C35 15 38 13 42 13 C48 13 53 18 53 24 C53 32 46 39 35 49 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
  nonprofit_medical: {
    name: '2. Medical Kit',
    category: 'Nonprofit',
    viewBox: '0 0 64 64',
    svg: `
      <path d="M24 15 C24 12 27 10 32 10 C37 10 40 12 40 15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="16" y="14" width="5" height="3" rx="1" fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="43" y="14" width="5" height="3" rx="1" fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="11" y="17" width="42" height="34" rx="5" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="32" cy="34" r="11" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <path d="M30 27 H34 V32 H39 V36 H34 V41 H30 V36 H25 V32 H30 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    `,
  },
  nonprofit_scholar: {
    name: '3. Education Hat',
    category: 'Nonprofit',
    viewBox: '0 0 64 64',
    svg: `
      <polygon points="32,9 56,21 32,33 8,21" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M18 27 V38 C18 44 24 49 32 49 C40 49 46 44 46 38 V27" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M51 24 V35" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="49" y="35" width="4" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M32 50 C32 50 23 43 23 38 C23 35 25 33 27.5 33 C29.5 33 31 34.5 32 36 C33 34.5 34.5 33 36.5 33 C39 33 41 35 41 38 C41 43 32 50 32 50 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    `,
  },
  nonprofit_ribbon: {
    name: '4. Charity Ribbon',
    category: 'Nonprofit',
    viewBox: '0 0 64 64',
    svg: `
      <path d="M32 9 C25 9 20 15 20 23 C20 30 26 38 32 46 L44 57 L47 54 L40 43 L32 33" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 9 C39 9 44 15 44 23 C44 30 38 38 32 46 L20 57 L17 54 L24 43 L32 33" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
  sparkles_icon: {
    name: '5. Sparkles & Glow',
    category: 'General',
    viewBox: '0 0 24 24',
    svg: `
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5 3v4" stroke-width="2" stroke-linecap="round"/>
      <path d="M19 17v4" stroke-width="2" stroke-linecap="round"/>
      <path d="M3 5h4" stroke-width="2" stroke-linecap="round"/>
      <path d="M17 19h4" stroke-width="2" stroke-linecap="round"/>
    `,
  },
};

// The user's uploaded custom icon preserved from the index.html attachment
export const INITIAL_CUSTOM_ICONS: Record<string, IconDefinition> = {
  custom_1794429637592_slot0: {
    name: 'box',
    category: 'Custom',
    viewBox: '0 0 43 43',
    svg: `
      <path xmlns="http://www.w3.org/2000/svg" d="M6.01174 19.9673V38.6309C6.01174 39.5436 6.46473 40 7.3707 40H35.6293C36.5353 40 36.9883 39.5436 36.9883 38.6309V19.9673M17.9361 11.3596V19.9673M25.0639 11.3596V19.9673M18.8426 19.9673V40M24.1567 19.9673V40M19.4906 11.3596V7.96862C19.4906 7.1551 19.8944 6.74833 20.7019 6.74833H22.2981C23.1056 6.74833 23.5094 7.1551 23.5094 7.96862V11.3596M19.4906 7.24531C17.1238 5.21071 14.8301 3.59078 12.629 3.08668C11.0972 2.73452 10.1986 3.47841 9.83805 4.90049C9.40051 6.38193 9.10358 8.02877 9.16485 9.27121C9.20151 10.4899 9.7011 11.1861 10.6636 11.3596M23.5094 7.24531C25.8762 5.21071 28.1699 3.59078 30.371 3.08668C31.9028 2.73452 32.8014 3.47841 33.162 4.90049C33.5995 6.38193 33.8964 8.02877 33.8351 9.27121C33.7985 10.4899 33.2989 11.1861 32.3364 11.3596M10.0132 7.14481C12.7469 7.52229 17.1222 8.64049 19.4906 10.4741M32.9868 7.14481C30.2531 7.52229 25.8777 8.64049 23.5094 10.4741M5.35896 11.3596H37.641C38.547 11.3596 39 11.816 39 12.7287V19.9673H4V12.7287C4 11.816 4.45299 11.3596 5.35896 11.3596Z" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"/>
    `,
  },
};

export const INITIAL_THEMES: ThemeTile[] = [
  {
    id: 'giftlist',
    title: 'Create a Gift List',
    icons: [
      'custom_1794429637592_slot0',
      'candycane',
      'gingerbread',
      'tree',
    ],
    cycleDuration: 2.8,
    iconAnimType: 'pop',
    iconColor: '#4A6572',
    iconStroke: 1,
    textColor: '#1e293b',
    glassOpacity: 0.25,
    glassBlur: 12,
    defaultBorderColor: '#cbd5e1',
    borderRadius: 20,
    borderWidth: 1.5,
    beamColor1: '#E53E3E',
    beamColor2: '#FFFFFF',
    beamColor3: '#2E7D32',
    beamSpeed: 3,
    particlesEnabled: true,
    particleType: 'snow_crystals',
    particleCount: 18,
    particleColor: '#ffffff',
    particleColors: ['#ffffff', '#E53E3E', '#2E7D32', '#F6E05E'],
    particleSize: 1.0,
    particleSpeed: 2.6,
  },
  {
    id: 'wedding',
    title: 'Create a Wedding Registry',
    icons: [
      'wedding_glasses',
      'wedding_bells',
      'rings',
      'cake',
    ],
    cycleDuration: 3,
    iconAnimType: 'bounce',
    iconColor: '#4A6572',
    iconStroke: 1,
    textColor: '#1e293b',
    glassOpacity: 0.25,
    glassBlur: 12,
    defaultBorderColor: '#cbd5e1',
    borderRadius: 20,
    borderWidth: 1.5,
    beamColor1: '#f59e0b',
    beamColor2: '#ffffff',
    beamColor3: '#ec4899',
    beamSpeed: 3.2,
    particlesEnabled: true,
    particleType: 'confetti_pop',
    particleCount: 22,
    particleColor: '#f59e0b',
    particleColors: ['#f59e0b', '#ec4899', '#6366f1', '#10b981'],
    particleSize: 1.1,
    particleSpeed: 2.8,
  },
  {
    id: 'baby',
    title: 'Create a Baby Registry',
    icons: [
      'baby_rattle',
      'baby_stroller',
      'baby_blocks',
      'baby_mobile',
    ],
    cycleDuration: 2.6,
    iconAnimType: 'pop',
    iconColor: '#4A6572',
    iconStroke: 1,
    textColor: '#1e293b',
    glassOpacity: 0.25,
    glassBlur: 12,
    defaultBorderColor: '#cbd5e1',
    borderRadius: 20,
    borderWidth: 1.5,
    beamColor1: '#0284c7',
    beamColor2: '#ffffff',
    beamColor3: '#f472b6',
    beamSpeed: 2.8,
    particlesEnabled: true,
    particleType: 'rose_petals',
    particleCount: 16,
    particleColor: '#f472b6',
    particleColors: ['#f472b6', '#90CDF4', '#FBB6CE', '#FEEBC8'],
    particleSize: 1.0,
    particleSpeed: 2.5,
  },
  {
    id: 'nonprofit',
    title: 'Create a Nonprofit Giving List',
    icons: [
      'nonprofit_heart',
      'nonprofit_medical',
      'nonprofit_scholar',
      'nonprofit_ribbon',
    ],
    cycleDuration: 2.8,
    iconAnimType: 'fade',
    iconColor: '#4A6572',
    iconStroke: 1,
    textColor: '#1e293b',
    glassOpacity: 0.25,
    glassBlur: 12,
    defaultBorderColor: '#cbd5e1',
    borderRadius: 20,
    borderWidth: 1.5,
    beamColor1: '#e11d48',
    beamColor2: '#ffffff',
    beamColor3: '#0d9488',
    beamSpeed: 3,
    particlesEnabled: true,
    particleType: 'hearts',
    particleCount: 14,
    particleColor: '#fb7185',
    particleColors: ['#fb7185', '#2DD4BF', '#FCD34D', '#A78BFA'],
    particleSize: 1.0,
    particleSpeed: 2.9,
  },
];
