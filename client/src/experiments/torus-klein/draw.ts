/**
 * 环面 / 克莱因瓶 3D 线框正交投影绘制
 */
import { gridCurve, project, type Surface, type Vec3 } from './torusKlein'

const TWO = Math.PI * 2

function mapPt(
  p: Vec3,
  angle: number,
  tilt: number,
  cx: number,
  cy: number,
  scale: number,
): { x: number; y: number; depth: number } {
  const q = project(p, angle, tilt)
  return { x: cx + q.x * scale, y: cy - q.y * scale, depth: q.depth }
}

/** 画一条参数曲线，颜色随深度变化实现前后遮挡感 */
function strokeCurve(
  ctx: CanvasRenderingContext2D,
  pts: Vec3[],
  angle: number,
  tilt: number,
  cx: number,
  cy: number,
  scale: number,
  hue: number,
) {
  for (let i = 1; i < pts.length; i++) {
    const a = mapPt(pts[i - 1], angle, tilt, cx, cy, scale)
    const b = mapPt(pts[i], angle, tilt, cx, cy, scale)
    const d = (a.depth + b.depth) / 2
    const light = 45 + (d + 3) * 8
    ctx.strokeStyle = `hsl(${hue}, 70%, ${Math.max(25, Math.min(80, light))}%)`
    ctx.lineWidth = d > 0 ? 1.6 : 0.9
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }
}

export function drawTorusKlein(
  canvas: HTMLCanvasElement,
  kind: Surface,
  angle = 0.6,
  tilt = 0.5,
  meridians = 24,
  parallels = 16,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const scale = kind === 'torus' ? Math.min(W, H) / 7 : Math.min(W, H) / 8.5
  const hue = kind === 'torus' ? 205 : 320

  for (let i = 0; i < meridians; i++) {
    const u = (i / meridians) * TWO
    strokeCurve(ctx, gridCurve(kind, 'u', u, 40), angle, tilt, cx, cy, scale, hue)
  }
  for (let j = 0; j < parallels; j++) {
    const v = (j / parallels) * TWO
    strokeCurve(ctx, gridCurve(kind, 'v', v, 60), angle, tilt, cx, cy, scale, hue + 40)
  }
}
