import { useEffect, useRef } from 'react';
import { ArtSettings, ColorThemeDefinition, MouseState, PatternRenderer } from '../engine/types';
import { renderOrbitingCircles } from '../engine/patterns/orbitingCircles';
import { renderRotatingPolygons } from '../engine/patterns/rotatingPolygons';
import { renderParticleConstellation } from '../engine/patterns/particleConstellation';
import { renderWaveGrid } from '../engine/patterns/waveGrid';
import { renderFractalTree } from '../engine/patterns/fractalTree';

interface ArtCanvasProps {
  settings: ArtSettings;
  theme: ColorThemeDefinition;
  onCanvasReady: (canvas: HTMLCanvasElement | null) => void;
}

const renderers: Record<ArtSettings['mode'], PatternRenderer> = {
  orbitingCircles: renderOrbitingCircles,
  rotatingPolygons: renderRotatingPolygons,
  particleConstellation: renderParticleConstellation,
  waveGrid: renderWaveGrid,
  fractalTree: renderFractalTree,
};

const paintBackdrop = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: ColorThemeDefinition,
) => {
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);

  const glowA = ctx.createRadialGradient(width * 0.2, height * 0.24, 0, width * 0.2, height * 0.24, width * 0.55);
  glowA.addColorStop(0, `${theme.colors[0]}26`);
  glowA.addColorStop(1, 'transparent');
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, width, height);

  const glowB = ctx.createRadialGradient(width * 0.82, height * 0.72, 0, width * 0.82, height * 0.72, width * 0.45);
  glowB.addColorStop(0, `${theme.colors[1]}1f`);
  glowB.addColorStop(1, 'transparent');
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, width, height);
};

const createBackdrop = (width: number, height: number, theme: ColorThemeDefinition) => {
  const backdrop = document.createElement('canvas');
  backdrop.width = width;
  backdrop.height = height;
  const backdropContext = backdrop.getContext('2d');
  if (backdropContext) {
    paintBackdrop(backdropContext, width, height, theme);
  }
  return backdrop;
};

const drawBackdrop = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  alpha: number,
  backdrop: HTMLCanvasElement,
) => {
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = alpha;
  ctx.drawImage(backdrop, 0, 0, width, height);
  ctx.restore();
};

function ArtCanvas({ settings, theme, onCanvasReady }: ArtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const settingsRef = useRef(settings);
  const themeRef = useRef(theme);
  const mouseRef = useRef<MouseState>({
    x: 0,
    y: 0,
    active: false,
    velocityX: 0,
    velocityY: 0,
    pulseX: 0,
    pulseY: 0,
    pulse: 0,
  });

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    onCanvasReady(canvas);
    let frame = 0;
    let lastTime = performance.now();
    let logicalWidth = window.innerWidth;
    let logicalHeight = window.innerHeight;
    let backdrop = createBackdrop(logicalWidth, logicalHeight, themeRef.current);
    let backdropKey = `${logicalWidth}x${logicalHeight}:${themeRef.current.id}`;

    const getBackdrop = () => {
      const key = `${logicalWidth}x${logicalHeight}:${themeRef.current.id}`;
      if (key !== backdropKey) {
        backdrop = createBackdrop(logicalWidth, logicalHeight, themeRef.current);
        backdropKey = key;
      }
      return backdrop;
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2.5);
      logicalWidth = window.innerWidth;
      logicalHeight = window.innerHeight;
      canvas.width = Math.floor(logicalWidth * ratio);
      canvas.height = Math.floor(logicalHeight * ratio);
      canvas.style.width = `${logicalWidth}px`;
      canvas.style.height = `${logicalHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawBackdrop(ctx, logicalWidth, logicalHeight, 1, getBackdrop());
    };

    const setMouse = (event: PointerEvent) => {
      const previous = mouseRef.current;
      mouseRef.current = {
        ...previous,
        x: event.clientX,
        y: event.clientY,
        active: true,
        velocityX: previous.velocityX * 0.72 + (event.clientX - previous.x) * 0.28,
        velocityY: previous.velocityY * 0.72 + (event.clientY - previous.y) * 0.28,
      };
    };

    const triggerPulse = (event: PointerEvent) => {
      mouseRef.current = {
        ...mouseRef.current,
        x: event.clientX,
        y: event.clientY,
        active: true,
        pulseX: event.clientX,
        pulseY: event.clientY,
        pulse: 1,
      };
    };

    const leaveMouse = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };

    const animate = (now: number) => {
      const currentSettings = settingsRef.current;
      const currentTheme = themeRef.current;
      const deltaTime = Math.min(48, now - lastTime);
      lastTime = now;
      mouseRef.current = {
        ...mouseRef.current,
        velocityX: mouseRef.current.velocityX * 0.92,
        velocityY: mouseRef.current.velocityY * 0.92,
        pulse: Math.max(0, mouseRef.current.pulse - deltaTime * 0.0018),
      };

      if (!currentSettings.paused) {
        const fadeAlpha = Math.max(0.035, Math.min(0.42, currentSettings.trail));
        drawBackdrop(ctx, logicalWidth, logicalHeight, fadeAlpha, getBackdrop());
        const time = now / 1000;
        renderers[currentSettings.mode]({
          ctx,
          width: logicalWidth,
          height: logicalHeight,
          time,
          deltaTime,
          settings: currentSettings,
          mouse: mouseRef.current,
          theme: currentTheme,
        });
      }

      frame = requestAnimationFrame(animate);
    };

    resize();
    frame = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', setMouse);
    canvas.addEventListener('pointerdown', triggerPulse);
    window.addEventListener('pointerleave', leaveMouse);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', setMouse);
      canvas.removeEventListener('pointerdown', triggerPulse);
      window.removeEventListener('pointerleave', leaveMouse);
      onCanvasReady(null);
    };
  }, [onCanvasReady]);

  return <canvas ref={canvasRef} className="art-canvas" aria-label="Animated generative geometric art canvas" />;
}

export default ArtCanvas;
