/** 曲线积分绘制：向量场箭头 + 路径 + F·切向投影，做功正负红/蓝着色 */
import {
  samplePath, workDensity, mag, dot,
  type Field, type Path, type Vec,
} from './lineIntegral'

const XR = 2.8 // 世界坐标半宽
const YR = 2.2 // 世界坐标半高

function makeToPx(W: number, H: number) {
  return (p: Vec): Vec => ({
    x: W / 2 + (p.x / XR) * (W / 2 - 20),
    y: H / 2 - (p.y / YR) * (H / 2 - 20),
  })
}

function drawArrow(ctx: CanvasRenderingContext2D, a: Vec, b: Vec, head = 5) {
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.stroke()
  const ang = Math.atan2(b.y - a.y, b.x - a.x)
  ctx.beginPath()
  ctx.moveTo(b.x, b.y)
  ctx.lineTo(b.x - head * Math.cos(ang - 0.4), b.y - head * Math.sin(ang - 0.4))
  ctx.lineTo(b.x - head * Math.cos(ang + 0.4), b.y - head * Math.sin(ang + 0.4))
  ctx.closePath()
  ctx.fill()
}

export function drawLineIntegral(
  canvas: HTMLCanvasElement,
  field: Field,
  path: Path,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const toPx = makeToPx(W, H)
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)
  // 背景向量场箭头网格
  ctx.strokeStyle = '#cbd5e1'
  ctx.fillStyle = '#cbd5e1'
  ctx.lineWidth = 1
  const gx = 9
  const gy = 7
  for (let i = 0; i <= gx; i++) {
    for (let j = 0; j <= gy; j++) {
      const wx = -XR + (2 * XR * i) / gx
      const wy = -YR + (2 * YR * j) / gy
      const v = field.f(wx, wy)
      const m = mag(v) || 1
      const scale = 0.22 / m
      const a = toPx({ x: wx, y: wy })
      const b = toPx({ x: wx + v.x * scale, y: wy + v.y * scale })
      drawArrow(ctx, a, b, 4)
    }
  }

  // 路径 + 做功投影着色
  const pts = samplePath(path, 80)
  for (let i = 0; i < pts.length - 1; i++) {
    const t = path.t0 + ((path.t1 - path.t0) * (i + 0.5)) / 80
    const w = workDensity(field, path, t)
    ctx.strokeStyle = w >= 0 ? '#ef4444' : '#3b82f6'
    ctx.lineWidth = Math.min(9, 2 + Math.abs(w) * 0.7)
    const a = toPx(pts[i])
    const b = toPx(pts[i + 1])
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  // 采样处画 F 切向投影短箭头
  ctx.fillStyle = '#0f172a'
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.4
  for (let k = 0; k <= 8; k++) {
    const t = path.t0 + ((path.t1 - path.t0) * k) / 8
    const p = path.r(t)
    const tan = path.dr(t)
    const tm = mag(tan) || 1
    const unit = { x: tan.x / tm, y: tan.y / tm }
    const proj = dot(field.f(p.x, p.y), unit)
    const a = toPx(p)
    const b = toPx({ x: p.x + unit.x * proj * 0.28, y: p.y + unit.y * proj * 0.28 })
    drawArrow(ctx, a, b, 4)
  }

  const s = toPx(path.r(path.t0))
  const e = toPx(path.r(path.t1))
  ctx.fillStyle = '#16a34a'
  ctx.beginPath(); ctx.arc(s.x, s.y, 5, 0, 2 * Math.PI); ctx.fill()
  ctx.fillStyle = '#9333ea'
  ctx.beginPath(); ctx.arc(e.x, e.y, 5, 0, 2 * Math.PI); ctx.fill()
}
