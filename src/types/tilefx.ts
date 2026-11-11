export interface IconDefinition {
  name: string;
  category: string;
  viewBox: string;
  svg: string;
}

export type ParticleType = 
  | 'confetti_pop'
  | 'confetti'
  | 'snow_crystals'
  | 'snowflakes'
  | 'rose_petals'
  | 'bubbles'
  | 'hearts'
  | 'sparkles';

export type IconAnimType = 'pop' | 'bounce' | 'fade' | 'slide' | 'scale';

export interface ThemeTile {
  id: string;
  title: string;
  icons: [string, string, string, string]; // 4 slots
  cycleDuration: number;
  iconAnimType: IconAnimType;
  iconColor: string;
  iconStroke: number;
  textColor: string;
  glassOpacity: number;
  glassBlur: number;
  defaultBorderColor: string;
  borderRadius: number;
  borderWidth: number;
  beamColor1: string;
  beamColor2: string;
  beamColor3: string;
  beamSpeed: number;
  particlesEnabled: boolean;
  particleType: ParticleType;
  particleCount: number;
  particleColor: string;
  particleColors?: string[]; // Array of 3-5 custom colors
  particleSize?: number; // Scale multiplier (0.4x - 3.0x)
  particleSpeed: number;
}

export interface GlobalLayout {
  iconGap: number;
  iconSize: number;
  iconHoverScale: number;
  fontSize: number;
  fontWeight: number;
  pageBgColor: string;
}

export interface TileFXBundle {
  version: number;
  timestamp: number;
  activeTileIndex: number;
  global: GlobalLayout;
  themes: ThemeTile[];
  customIcons: Record<string, IconDefinition>;
}
