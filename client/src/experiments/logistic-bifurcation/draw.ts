/**
 * Logistic 分岔图 Canvas 绘制
 * 横轴 r（rMin..rMax），纵轴稳态 x 值（0..1）。
 * 每个 r 迭代出的稳态值集合画成竖直方向上的散点。
 */
import { bifurcationData } from './logisticBifurcation'

/**
 * 绘制分岔图。
 * @param rMin,rMax 横轴 r 范围
 * @param steps     沿横轴采样的 r 列数
 */
export function drawLogisticBifurcation(
  canvas: HTMLCanvasElement,
  rMin: number,
  rMax: number,
  steps = 480,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cols = bifurcationData(rMin, rMax, steps, 400, 260)
  const span = rMax - rMin

  // 散点：稳态值用低透明度青色，叠加出密度
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)'
  for (const col of cols) {
    const px = ((col.r - rMin) / span) * W
    for (const v of col.values) {
      const py = H - v * H
      ctx.fillRect(px, py, 1, 1)
    }
  }

  drawAxes(ctx, W, H, rMin, rMax)
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  rMin: number,
  rMax: number,
) {
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'
  ctx.fillStyle = '#94a3b8'
  ctx.font = '12px sans-serif'
  ctx.lineWidth = 1
  const span = rMax - rMin
  const ticks = 5
  for (let i = 0; i <= ticks; i++) {
    const r = rMin + (span * i) / ticks
    const px = ((r - rMin) / span) * W
    ctx.beginPath()
    ctx.moveTo(px, H)
    ctx.lineTo(px, H - 6)
    ctx.stroke()
    ctx.fillText(r.toFixed(2), Math.min(px, W - 28), H - 10)
  }
  ctx.fillText('r →', W - 34, 16)
  ctx.fillText('x', 6, 16)
}
