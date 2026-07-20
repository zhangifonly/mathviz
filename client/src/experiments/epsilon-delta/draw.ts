/**
 * ε-δ 极限定义 Canvas 绘制
 * 画函数曲线、L±ε 的水平带、a±δ 的竖直带，
 * 展示竖直带内的曲线段恰好落在水平带内。
 */
import { findDelta, type LimitFunction } from './epsilonDelta'

export function drawEpsilonDelta(
  canvas: HTMLCanvasElement,
  func: LimitFunction,
  eps: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const { fn, a, L } = func
  const delta = findDelta(fn, a, L, eps)
  // 视窗：以 (a, L) 为中心，横跨约 ±1.6
  const halfX = 1.6
  const xMin = a - halfX
  const xMax = a + halfX
  const yMin = L - halfX * 2.2
  const yMax = L + halfX * 2.2
  const toPx = (x: number) => ((x - xMin) / (xMax - xMin)) * W
  const toPy = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H

  // 水平 ε 带 (L-ε, L+ε)
  ctx.fillStyle = 'rgba(99, 102, 241, 0.12)'
  const yTop = toPy(L + eps)
  const yBot = toPy(L - eps)
  ctx.fillRect(0, yTop, W, yBot - yTop)
  // 竖直 δ 带 (a-δ, a+δ)
  ctx.fillStyle = 'rgba(236, 72, 153, 0.12)'
  const xL = toPx(a - delta)
  const xR = toPx(a + delta)
  ctx.fillRect(xL, 0, xR - xL, H)

  // 交界的安全矩形（曲线在此矩形内保证落在 ε 带）
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.9)'
  ctx.lineWidth = 1.5
  ctx.setLineDash([5, 4])
  ctx.strokeRect(xL, yTop, xR - xL, yBot - yTop)
  ctx.setLineDash([])

  // 函数曲线
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let px = 0; px <= W; px++) {
    const x = xMin + (px / W) * (xMax - xMin)
    const py = toPy(fn(x))
    if (px === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // 极限点标注 (a, L)
  ctx.fillStyle = '#dc2626'
  ctx.beginPath()
  ctx.arc(toPx(a), toPy(L), 4.5, 0, 2 * Math.PI)
  ctx.fill()

  // 坐标标签
  ctx.fillStyle = '#475569'
  ctx.font = '13px sans-serif'
  ctx.fillText(`L=${L}`, 6, toPy(L) - 6)
  ctx.fillText(`a=${a}`, toPx(a) + 6, H - 8)
  ctx.fillText(`ε=${eps}`, W - 92, yTop - 6)
  ctx.fillText(`δ≈${delta.toFixed(3)}`, xR + 6, 18)
}
