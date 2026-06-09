import { PatternRenderer } from '../types';

export const renderWaveGrid: PatternRenderer = ({ ctx, width, height, time, settings, mouse, theme }) => {
  const spacing = 30 - settings.density * 12;
  const amplitude = 18 + settings.size * 68;
  const columns = Math.ceil(width / spacing) + 2;
  const rows = Math.ceil(height / spacing) + 2;
  const mouseActive = mouse.active;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineWidth = 1.1;

  for (let yIndex = 0; yIndex < rows; yIndex += 1) {
    const y = yIndex * spacing - spacing;
    ctx.beginPath();
    for (let xIndex = 0; xIndex < columns; xIndex += 1) {
      const x = xIndex * spacing - spacing;
      let px = x;
      let lift = 0;
      if (mouseActive) {
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const influence = Math.max(0, 1 - Math.hypot(dx, dy) / 210);
        px += dx * influence * 0.035;
        lift = influence * 32;
      }
      const wave =
        Math.sin(x * 0.016 + time * settings.speed * 1.6 + yIndex * 0.24) * amplitude +
        Math.cos(y * 0.012 + time * settings.speed + xIndex * 0.18) * amplitude * 0.45;
      const py = y + wave + lift;
      if (xIndex === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    const color = theme.colors[yIndex % theme.colors.length];
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.18 + yIndex / rows * 0.22;
    ctx.stroke();
  }

  for (let xIndex = 0; xIndex < columns; xIndex += 3) {
    for (let yIndex = 0; yIndex < rows; yIndex += 3) {
      const x = xIndex * spacing - spacing;
      const y = yIndex * spacing - spacing;
      const pulse = Math.sin(time * settings.speed * 2 + xIndex * 0.4 + yIndex * 0.5) * 0.5 + 0.5;
      ctx.globalAlpha = 0.08 + pulse * 0.18;
      ctx.fillStyle = theme.colors[(xIndex + yIndex) % theme.colors.length];
      ctx.beginPath();
      ctx.arc(x, y, 1.2 + pulse * settings.size * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
};
