/**
 * 不动点迭代蛛网图 Canvas 绘制
 * 画 y=g(x) 曲线 + y=x 直线 + 迭代阶梯蛛网轨迹。
 */
import { iterate, type IterFunc } from './fixedPointIteration'

const PAD = 44

/** 绘制蛛网图。steps 控制展示到第几步迭代轨迹。 */
export function drawFixedPointIteration(
  canvas: HTMLCanvasElement,
  fn: IterFunc,
  steps: number,
  domain: [number, number] = [-0.5, 5.5],
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const [lo, hi] = domain
  const span = hi - lo
  const sx = (x: number) => PAD + ((x - lo) / span) * (W - 2 * PAD)
  const sy = (y: number) => H - PAD - ((y - lo) / span) * (H - 2 * PAD)

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, sy(lo)); ctx.lineTo(W - PAD, sy(lo))
  ctx.moveTo(sx(lo), PAD); ctx.lineTo(sx(lo), H - PAD)
  ctx.stroke()

  // y = x 直线
  ctx.strokeStyle = '#94a3b8'
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  ctx.moveTo(sx(lo), sy(lo)); ctx.lineTo(sx(hi), sy(hi))
  ctx.stroke()
  ctx.setLineDash([])

  // y = g(x) 曲线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  let started = false
  for (let px = 0; px <= W - 2 * PAD; px++) {
    const x = lo + (px / (W - 2 * PAD)) * span
    const y = fn.g(x)
    if (!Number.isFinite(y)) { started = false; continue }
    const cy = sy(y)
    if (!started) { ctx.moveTo(sx(x), cy); started = true }
    else ctx.lineTo(sx(x), cy)
  }
  ctx.stroke()

  // 蛛网轨迹
  const seq = iterate(fn.g, fn.x0, steps)
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(sx(fn.x0), sy(lo))
  for (let i = 0; i < seq.length - 1; i++) {
    const x = seq[i]
    const gx = seq[i + 1]
    if (!Number.isFinite(gx)) break
    ctx.lineTo(sx(x), sy(gx))   // 竖直到曲线
    ctx.lineTo(sx(gx), sy(gx))  // 水平到对角线
  }
  ctx.stroke()

  // 不动点标记
  ctx.fillStyle = '#059669'
  ctx.beginPath()
  ctx.arc(sx(fn.fixed), sy(fn.fixed), 5, 0, 2 * Math.PI)
  ctx.fill()

  // 当前迭代点
  const cur = seq[Math.min(steps, seq.length - 1)]
  if (Number.isFinite(cur)) {
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(sx(cur), sy(cur), 4, 0, 2 * Math.PI)
    ctx.fill()
  }
}
