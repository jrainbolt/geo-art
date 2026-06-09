import { PatternRenderer } from '../types';

export const renderOrbitingCircles: PatternRenderer = ({
  ctx,
  width,
  height,
  time,
  settings,
  mouse,
  theme,
}) => {
  const centerDriftX = mouse.active ? (mouse.x - width / 2) * 0.035 : 0;
  const centerDriftY = mouse.active ? (mouse.y - height / 2) * 0.035 : 0;
  const centerX = width / 2 + centerDriftX;
  const centerY = height / 2 + centerDriftY;
  const rings = Math.floor(4 + settings.density * 9);
  const maxRadius = Math.min(width, height) * (0.22 + settings.size * 0.42);
  const pointerSpeed = Math.min(1.4, Math.hypot(mouse.velocityX, mouse.velocityY) / 34);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (let ring = 0; ring < rings; ring += 1) {
    const ringRatio = (ring + 1) / rings;
    const radius = maxRadius * ringRatio;
    const count = Math.floor(5 + settings.density * 18 + ring * 1.6);
    const phase = time * settings.speed * (0.25 + ringRatio * 0.9) * (ring % 2 ? -1 : 1);

    ctx.strokeStyle = theme.colors[ring % theme.colors.length];
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + phase;
      const wobble = Math.sin(time * 1.5 + i * 0.8 + ring) * 10 * settings.size;
      let x = centerX + Math.cos(angle) * (radius + wobble);
      let y = centerY + Math.sin(angle) * (radius + wobble);
      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const dist = Math.hypot(dx, dy);
      const influence = mouse.active ? Math.max(0, 1 - dist / 180) : 0;
      const pulseDistance = Math.hypot(x - mouse.pulseX, y - mouse.pulseY);
      const pulseInfluence = mouse.pulse * Math.max(0, 1 - pulseDistance / 360);
      x += dx * influence * 0.08 + Math.cos(angle) * pulseInfluence * 18;
      y += dy * influence * 0.08 + Math.sin(angle) * pulseInfluence * 18;

      const dotSize = (5.6 + settings.size * 17) * (0.82 + influence * 0.9 + pulseInfluence * 0.56 + pointerSpeed * 0.05);
      const color = theme.colors[(i + ring) % theme.colors.length];
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, dotSize * 2.75);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.42;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, dotSize * 2.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (mouse.pulse > 0) {
    ctx.globalAlpha = mouse.pulse * 0.22;
    ctx.lineWidth = 2;
    ctx.strokeStyle = theme.glow;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(mouse.pulseX, mouse.pulseY, (1 - mouse.pulse) * 360, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
};
