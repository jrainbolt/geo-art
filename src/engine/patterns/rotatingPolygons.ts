import { PatternRenderer } from '../types';

const polygon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  sides: number,
  rotation: number,
) => {
  ctx.beginPath();
  for (let i = 0; i <= sides; i += 1) {
    const angle = rotation + (i / sides) * Math.PI * 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
};

export const renderRotatingPolygons: PatternRenderer = ({
  ctx,
  width,
  height,
  time,
  settings,
  mouse,
  theme,
}) => {
  const columns = Math.floor(5 + settings.density * 9);
  const rows = Math.floor(columns * (height / width)) + 2;
  const gapX = width / columns;
  const gapY = height / rows;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (let yIndex = 0; yIndex <= rows; yIndex += 1) {
    for (let xIndex = 0; xIndex <= columns; xIndex += 1) {
      const x = xIndex * gapX + Math.sin(yIndex * 1.7) * 16;
      const y = yIndex * gapY;
      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const dist = Math.hypot(dx, dy);
      const influence = mouse.active ? Math.max(0, 1 - dist / 220) : 0;
      const sides = 3 + ((xIndex + yIndex) % 5);
      const radius = (gapX * 0.15 + settings.size * 34) * (1 + influence * 0.75);
      const rotation = time * settings.speed * (0.45 + sides * 0.08) + xIndex * 0.4 + yIndex * 0.32;
      const color = theme.colors[(xIndex + yIndex) % theme.colors.length];

      ctx.lineWidth = 1.2 + influence * 2.4;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18 + influence * 28;
      ctx.globalAlpha = 0.22 + influence * 0.55;
      polygon(ctx, x + dx * influence * 0.04, y + dy * influence * 0.04, radius, sides, rotation);
      ctx.stroke();

      if ((xIndex + yIndex) % 3 === 0) {
        ctx.globalAlpha = 0.05 + influence * 0.08;
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
  }

  ctx.restore();
};
