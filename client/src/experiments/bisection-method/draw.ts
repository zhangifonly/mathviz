/**
 * 二分法 Canvas 绘制：函数曲线 + 当前含根区间（竖线对）+ 中点标记
 */
import { bisection, type MathFunction } from './bisectionMethod'

/**
 * 绘制二分法某一步。
 * @param step 展示到第几步（从 0 开始，越大区间越窄）
 */
export function drawBisectionMethod(
  canvas: HTMLCanvasElement,
  func: MathFunction,
  step: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const pad = 40
  const x0 = func.a - (func.b - func.a) * 0.15
  const x1 = func.b + (func.b - func.a) * 0.15
  // 采样求 y 范围
  const N = 240
  let yMin = Infinity
  let yMax = -Infinity
  const pts: Array<[number, number]> = []
  for (let i = 0; i <= N; i++) {
    const x = x0 + ((x1 - x0) * i) / N
    const y = func.fn(x)
    pts.push([x, y])
    if (y < yMin) yMin = y
    if (y > yMax) yMax = y
  }
  const sx = (x: number) => pad + ((x - x0) / (x1 - x0)) * (W - 2 * pad)
  const sy = (y: number) => H - pad - ((y - yMin) / (yMax - yMin || 1)) * (H - 2 * pad)

  // 坐标轴（y=0）
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, sy(0))
  ctx.lineTo(W - pad, sy(0))
  ctx.stroke()

  const steps = bisection(func.fn, func.a, func.b, 1e-9, 40)
  const s = steps[Math.min(step, steps.length - 1)]

  // 含根区间底色
  ctx.fillStyle = 'rgba(99,102,241,0.10)'
  ctx.fillRect(sx(s.a), pad, sx(s.b) - sx(s.a), H - 2 * pad)

  // 曲线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(sx(x), sy(y)) : ctx.moveTo(sx(x), sy(y))))
  ctx.stroke()

  // 区间两端竖线
  ctx.strokeStyle = '#0ea5e9'
  ctx.lineWidth = 2
  for (const [x, label] of [[s.a, 'a'], [s.b, 'b']] as Array<[number, string]>) {
    ctx.beginPath()
    ctx.moveTo(sx(x), pad)
    ctx.lineTo(sx(x), H - pad)
    ctx.stroke()
    ctx.fillStyle = '#0369a1'
    ctx.font = '13px sans-serif'
    ctx.fillText(label + '=' + x.toFixed(3), sx(x) + 3, pad + 14)
  }

  // 中点标记
  ctx.fillStyle = '#ec4899'
  ctx.beginPath()
  ctx.arc(sx(s.mid), sy(s.fMid), 5, 0, 2 * Math.PI)
  ctx.fill()
  ctx.strokeStyle = '#ec4899'
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(sx(s.mid), sy(s.fMid))
  ctx.lineTo(sx(s.mid), sy(0))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#be185d'
  ctx.font = '13px sans-serif'
  ctx.fillText('mid=' + s.mid.toFixed(4), sx(s.mid) + 6, sy(0) - 6)
}
