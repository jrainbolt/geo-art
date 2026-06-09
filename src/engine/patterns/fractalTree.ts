import { PatternRenderer } from '../types';

interface Segment {
  x: number;
  y: number;
  endX: number;
  endY: number;
  depth: number;
}

const branch = (
  segments: Segment[],
  x: number,
  y: number,
  length: number,
  angle: number,
  depth: number,
  maxDepth: number,
  sway: number,
) => {
  if (depth <= 0 || length < 2) return;

  const endX = x + Math.cos(angle) * length;
  const endY = y + Math.sin(angle) * length;
  segments.push({ x, y, endX, endY, depth });

  const split = 0.38 + Math.sin(sway + depth) * 0.08;
  branch(segments, endX, endY, length * 0.72, angle - split, depth - 1, maxDepth, sway);
  branch(segments, endX, endY, length * 0.72, angle + split, depth - 1, maxDepth, sway);
  if (depth === maxDepth || depth === maxDepth - 2) {
    branch(segments, endX, endY, length * 0.5, angle + Math.sin(sway) * 0.5, depth - 2, maxDepth, sway);
  }
};

export const renderFractalTree: PatternRenderer = ({
  ctx,
  width,
  height,
  time,
  settings,
  mouse,
  theme,
}) => {
  const treeCount = Math.floor(2 + settings.density * 4);
  const maxDepth = Math.floor(6 + settings.density * 2);
  const baseLength = height * (0.12 + settings.size * 0.12);
  const mouseSway = mouse.active ? (mouse.x / width - 0.5) * 0.8 : 0;
  const segmentsByDepth = new Map<number, Segment[]>();

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';

  for (let i = 0; i < treeCount; i += 1) {
    const x = width * ((i + 0.5) / treeCount);
    const y = height * (0.88 + Math.sin(i) * 0.04);
    const sway = time * settings.speed * 0.7 + i * 1.2 + mouseSway;
    const angle = -Math.PI / 2 + Math.sin(sway) * 0.18;
    const segments: Segment[] = [];
    branch(segments, x, y, baseLength * (0.76 + (i % 3) * 0.12), angle, maxDepth, maxDepth, sway);
    for (const segment of segments) {
      const bucket = segmentsByDepth.get(segment.depth) ?? [];
      bucket.push(segment);
      segmentsByDepth.set(segment.depth, bucket);
    }
  }

  for (const [depth, segments] of segmentsByDepth) {
    const color = theme.colors[(maxDepth - depth) % theme.colors.length];
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = depth > maxDepth - 3 ? 10 : 5;
    ctx.globalAlpha = 0.16 + depth / maxDepth * 0.5;
    ctx.lineWidth = Math.max(1, depth * 0.66);
    ctx.beginPath();
    for (const segment of segments) {
      ctx.moveTo(segment.x, segment.y);
      ctx.lineTo(segment.endX, segment.endY);
    }
    ctx.stroke();
  }

  const centerPulse = Math.sin(time * settings.speed * 1.8) * 0.5 + 0.5;
  const gradient = ctx.createRadialGradient(width / 2, height * 0.8, 0, width / 2, height * 0.8, width * 0.45);
  gradient.addColorStop(0, `${theme.glow}55`);
  gradient.addColorStop(1, 'transparent');
  ctx.globalAlpha = 0.22 + centerPulse * 0.12;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
};
