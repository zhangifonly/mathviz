/**
 * 帐篷映射 Canvas 绘制：左侧蛛网图(cobweb)，右侧时间序列。
 */
import { tent, cobwebPath, iterate } from './tentMap'

/** 在给定矩形区域内画蛛网图：帐篷曲线 + 对角线 + 迭代弹跳折线 */
function drawCobweb(
  ctx: CanvasRenderingContext2D,
  x0: number, y0: number, size: number,
  mu: number, start: number, steps: number,
) {
  const px = (v: number) => x0 + v * size
  const py = (v: number) => y0 + size - v * size
  // 坐标框
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.strokeRect(x0, y0, size, size)
  // 对角线 y=x
  ctx.strokeStyle = '#94a3b8'
  ctx.beginPath()
  ctx.moveTo(px(0), py(0))
  ctx.lineTo(px(1), py(1))
  ctx.stroke()
  // 帐篷曲线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(px(0), py(tent(0, mu)))
  ctx.lineTo(px(0.5), py(tent(0.5, mu)))
  ctx.lineTo(px(1), py(tent(1, mu)))
  ctx.stroke()
  // 蛛网折线
  const pts = cobwebPath(start, mu, steps)
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(px(pts[0][0]), py(pts[0][1]))
  for (const [x, y] of pts) ctx.lineTo(px(x), py(y))
  ctx.stroke()
}

/** 时间序列折线：x_n 随 n 变化 */
function drawSeries(
  ctx: CanvasRenderingContext2D,
  x0: number, y0: number, w: number, h: number,
  seq: number[],
) {
  ctx.strokeStyle = '#cbd5e1'
  ctx.strokeRect(x0, y0, w, h)
  ctx.strokeStyle = '#0ea5e9'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  const n = seq.length
  for (let i = 0; i < n; i++) {
    const px = x0 + (i / (n - 1)) * w
    const py = y0 + h - seq[i] * h
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.fillStyle = '#0ea5e9'
  for (let i = 0; i < n; i++) {
    const px = x0 + (i / (n - 1)) * w
    const py = y0 + h - seq[i] * h
    ctx.beginPath()
    ctx.arc(px, py, 1.8, 0, 2 * Math.PI)
    ctx.fill()
  }
}

/** 绘制整幅图：mu 越接近 2 越混沌，start 为起点，steps 为迭代步数 */
export function drawTentMap(
  canvas: HTMLCanvasElement,
  mu: number, start = 0.2, steps = 40,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)
  const pad = 24
  const size = Math.min(H - pad * 2, W * 0.5 - pad * 2)
  drawCobweb(ctx, pad, pad, size, mu, start, steps)
  const sx = pad + size + pad * 2
  const sw = W - sx - pad
  drawSeries(ctx, sx, pad, sw, H - pad * 2, iterate(start, mu, steps))
}
