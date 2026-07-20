/**
 * 黎曼和 Canvas 绘制：曲线 + n 个逼近矩形 + 和值/误差
 */
import { riemannSum, trueIntegral, type FnDef, type RiemannMode } from './riemannSum'

const MODE_COLOR: Record<RiemannMode, string> = {
  left: '#6366f1',
  right: '#ec4899',
  mid: '#22c55e',
}

export function drawRiemannSum(
  canvas: HTMLCanvasElement,
  def: FnDef,
  n: number,
  mode: RiemannMode,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const a = def.a
  const b = def.b
  const pad = 44
  // 采样求最大值确定纵向比例
  let ymax = 1e-6
  for (let i = 0; i <= 200; i++) {
    ymax = Math.max(ymax, def.fn(a + ((b - a) * i) / 200))
  }
  ymax *= 1.15
  const sx = (x: number) => pad + ((x - a) / (b - a)) * (W - pad * 2)
  const sy = (y: number) => H - pad - (y / ymax) * (H - pad * 2)

  // 坐标轴
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, sy(0))
  ctx.lineTo(W - pad, sy(0))
  ctx.moveTo(pad, sy(0))
  ctx.lineTo(pad, pad)
  ctx.stroke()

  // 逼近矩形
  const { sum, rects } = riemannSum(def.fn, a, b, n, mode)
  const color = MODE_COLOR[mode]
  for (const r of rects) {
    const px = sx(r.x)
    const pw = ((r.w) / (b - a)) * (W - pad * 2)
    const py = sy(r.h)
    ctx.fillStyle = color + '33'
    ctx.fillRect(px, py, pw, sy(0) - py)
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.strokeRect(px, py, pw, sy(0) - py)
  }

  // 曲线
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let i = 0; i <= 300; i++) {
    const x = a + ((b - a) * i) / 300
    const px = sx(x)
    const py = sy(def.fn(x))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // 和值与误差
  const truth = trueIntegral(def, a, b)
  const err = Math.abs(sum - truth)
  ctx.fillStyle = '#0f172a'
  ctx.font = '15px system-ui, sans-serif'
  ctx.fillText(`黎曼和 ≈ ${sum.toFixed(4)}`, pad + 4, pad - 20)
  ctx.fillStyle = '#64748b'
  ctx.font = '13px system-ui, sans-serif'
  ctx.fillText(`真实积分 = ${truth.toFixed(4)}   误差 = ${err.toFixed(4)}`, pad + 4, pad - 4)
}
