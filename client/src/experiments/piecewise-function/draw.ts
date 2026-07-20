/**
 * 分段函数 Canvas 绘制
 * 画坐标轴 + 分段曲线，连续点画实心，跳跃间断的两端画空心圈并标注跳跃。
 */
import { type PiecewiseDef, evalPiecewise, checkContinuity, leftLimit, rightLimit } from './piecewiseFunction'

const YRANGE: [number, number] = [-4, 6]

function mapper(canvas: HTMLCanvasElement, def: PiecewiseDef) {
  const W = canvas.width
  const H = canvas.height
  const [xa, xb] = def.domain
  const [ya, yb] = YRANGE
  const sx = (x: number) => ((x - xa) / (xb - xa)) * W
  const sy = (y: number) => H - ((y - ya) / (yb - ya)) * H
  return { W, H, sx, sy }
}

function drawAxes(ctx: CanvasRenderingContext2D, m: ReturnType<typeof mapper>) {
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, m.sy(0)); ctx.lineTo(m.W, m.sy(0))
  ctx.moveTo(m.sx(0), 0); ctx.lineTo(m.sx(0), m.H)
  ctx.stroke()
}

export function drawPiecewiseFunction(canvas: HTMLCanvasElement, def: PiecewiseDef) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const m = mapper(canvas, def)
  ctx.clearRect(0, 0, m.W, m.H)
  drawAxes(ctx, m)

  // 逐段画曲线，段与段之间断开
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  for (const p of def.pieces) {
    ctx.beginPath()
    let started = false
    const steps = 120
    for (let i = 0; i <= steps; i++) {
      const x = p.lo + ((p.hi - p.lo) * i) / steps
      const y = p.fn(x)
      const px = m.sx(x)
      const py = m.sy(y)
      if (!started) { ctx.moveTo(px, py); started = true } else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }

  // 分段点：判断连续/跳跃，画端点标记
  for (const b of def.breakpoints) {
    const r = checkContinuity(def, b)
    const l = leftLimit(def, b)
    const rr = rightLimit(def, b)
    const val = evalPiecewise(def, b)
    if (r.kind === 'continuous') {
      dot(ctx, m.sx(b), m.sy(val), '#10b981', true)
    } else {
      // 左端点空心圈（不含），右端点按闭合与否
      openCircle(ctx, m.sx(b), m.sy(l))
      dot(ctx, m.sx(b), m.sy(Number.isFinite(val) ? val : rr), '#f97316', Number.isFinite(val))
      if (!Number.isFinite(val)) openCircle(ctx, m.sx(b), m.sy(rr))
      // 标注跳跃量
      ctx.fillStyle = '#ef4444'
      ctx.font = '12px sans-serif'
      ctx.fillText(`跳跃 ${r.jump.toFixed(1)}`, m.sx(b) + 6, m.sy((l + rr) / 2))
    }
  }
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, fill: boolean) {
  ctx.beginPath()
  ctx.arc(x, y, 4.5, 0, 2 * Math.PI)
  if (fill) { ctx.fillStyle = color; ctx.fill() } else { ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke() }
}

function openCircle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath()
  ctx.arc(x, y, 4.5, 0, 2 * Math.PI)
  ctx.fillStyle = '#ffffff'; ctx.fill()
  ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2; ctx.stroke()
}
