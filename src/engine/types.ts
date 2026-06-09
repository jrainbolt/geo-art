export type PatternMode =
  | 'orbitingCircles'
  | 'rotatingPolygons'
  | 'particleConstellation'
  | 'waveGrid'
  | 'fractalTree';

export type ColorTheme = 'neon' | 'cosmic' | 'matrix' | 'calm' | 'solar';

export interface MouseState {
  x: number;
  y: number;
  active: boolean;
  velocityX: number;
  velocityY: number;
  pulseX: number;
  pulseY: number;
  pulse: number;
}

export interface ArtSettings {
  mode: PatternMode;
  speed: number;
  density: number;
  size: number;
  trail: number;
  theme: ColorTheme;
  paused: boolean;
}

export interface ColorThemeDefinition {
  id: ColorTheme;
  label: string;
  background: string;
  surface: string;
  colors: string[];
  glow: string;
}

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  deltaTime: number;
  settings: ArtSettings;
  mouse: MouseState;
  theme: ColorThemeDefinition;
}

export type PatternRenderer = (context: RenderContext) => void;
