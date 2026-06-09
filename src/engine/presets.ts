import { ArtSettings, ColorThemeDefinition, ColorTheme, PatternMode } from './types';

export const colorThemes: Record<ColorTheme, ColorThemeDefinition> = {
  neon: {
    id: 'neon',
    label: 'Neon Grid',
    background: '#050816',
    surface: 'rgba(11, 18, 35, 0.68)',
    colors: ['#00f5ff', '#ff2bd6', '#faff00', '#7c3cff', '#22ff88'],
    glow: '#00f5ff',
  },
  cosmic: {
    id: 'cosmic',
    label: 'Cosmic Bloom',
    background: '#090412',
    surface: 'rgba(21, 10, 35, 0.7)',
    colors: ['#f069ff', '#ffb86b', '#65d6ff', '#a78bfa', '#ffffff'],
    glow: '#f069ff',
  },
  matrix: {
    id: 'matrix',
    label: 'Matrix Rings',
    background: '#020806',
    surface: 'rgba(2, 18, 13, 0.72)',
    colors: ['#00ff84', '#7dffb2', '#0fdc74', '#d5ffe7', '#02b86c'],
    glow: '#00ff84',
  },
  calm: {
    id: 'calm',
    label: 'Calm Waves',
    background: '#061520',
    surface: 'rgba(7, 28, 42, 0.7)',
    colors: ['#80d8ff', '#9fffea', '#d9f99d', '#7dd3fc', '#c4b5fd'],
    glow: '#80d8ff',
  },
  solar: {
    id: 'solar',
    label: 'Solar Pulse',
    background: '#120706',
    surface: 'rgba(33, 15, 8, 0.7)',
    colors: ['#ffde59', '#ff7a18', '#ff375f', '#fff3b0', '#ffb703'],
    glow: '#ffb703',
  },
};

export const patternLabels: Record<PatternMode, string> = {
  orbitingCircles: 'Orbiting Circles',
  rotatingPolygons: 'Rotating Polygons',
  particleConstellation: 'Particle Constellation',
  waveGrid: 'Wave Grid',
  fractalTree: 'Fractal Tree',
};

export const defaultSettings: ArtSettings = {
  mode: 'orbitingCircles',
  speed: 0.7,
  density: 0.58,
  size: 0.55,
  trail: 0.22,
  theme: 'neon',
  paused: false,
};

export const presets: Record<string, ArtSettings> = {
  'Neon Grid': {
    mode: 'waveGrid',
    speed: 0.78,
    density: 0.7,
    size: 0.45,
    trail: 0.16,
    theme: 'neon',
    paused: false,
  },
  'Cosmic Bloom': {
    mode: 'orbitingCircles',
    speed: 0.52,
    density: 0.82,
    size: 0.72,
    trail: 0.12,
    theme: 'cosmic',
    paused: false,
  },
  'Matrix Rings': {
    mode: 'rotatingPolygons',
    speed: 0.9,
    density: 0.76,
    size: 0.5,
    trail: 0.2,
    theme: 'matrix',
    paused: false,
  },
  'Calm Waves': {
    mode: 'waveGrid',
    speed: 0.32,
    density: 0.46,
    size: 0.55,
    trail: 0.08,
    theme: 'calm',
    paused: false,
  },
  'Solar Pulse': {
    mode: 'fractalTree',
    speed: 0.6,
    density: 0.62,
    size: 0.7,
    trail: 0.18,
    theme: 'solar',
    paused: false,
  },
};
