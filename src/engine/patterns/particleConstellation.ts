import { PatternRenderer } from '../types';

export const renderParticleConstellation: PatternRenderer = ({
  ctx,
  width,
  height,
  time,
  settings,
  mouse,
  theme,
}) => {
  const count = Math.floor(70 + settings.density * 230);
  const connectionDistance = 95 + settings.size * 105;
  const points = Array.from({ length: count }, (_, i) => {
    const seed = i * 999;
    const x = ((Math.sin(seed * 12.9898) * 43758.5453) % 1) * width;
    const y = ((Math.sin(seed * 78.233) * 24634.6345) % 1) * height;
    const driftX = Math.sin(time * settings.speed * 0.55 + i * 1.9) * 28;
    const driftY = Math.cos(time * settings.speed * 0.42 + i * 1.3) * 28;
    const px = (x + width + driftX) % width;
    const py = (y + height + driftY) % height;
    const dx = px - mouse.x;
    const dy = py - mouse.y;
    const influence = mouse.active ? Math.max(0, 1 - Math.hypot(dx, dy) / 190) : 0;
    return {
      x: px + dx * influence * 0.09,
      y: py + dy * influence * 0.09,
      influence,
      color: theme.colors[i % theme.colors.length],
    };
  });

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < connectionDistance) {
        ctx.globalAlpha = (1 - dist / connectionDistance) * 0.22;
        ctx.strokeStyle = a.color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  for (const point of points) {
    const radius = 1.4 + settings.size * 3.8 + point.influence * 5;
    ctx.globalAlpha = 0.9;
    ctx.shadowColor = point.color;
    ctx.shadowBlur = 18 + point.influence * 24;
    ctx.fillStyle = point.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};
