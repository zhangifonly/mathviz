/**
 * 欧几里得算法几何可视化：a×b 矩形切正方形（辗转相除的图形版）
 */
import { squareTiling, gcd } from './euclideanAlgorithm'

/**
 * 绘制正方形切割图。矩形按比例缩放居中铺满画布。
 * @param maxStep 只画到第 maxStep 层（含），用于分步展示；<0 表示全部
 */
export function drawEuclideanAlgorithm(
  canvas: HTMLCanvasElement,
  a: number,
  b: number,
  maxStep = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const A = Math.abs(Math.trunc(a))
  const B = Math.abs(Math.trunc(b))
  if (A === 0 || B === 0) return

  const pad = 24
  const scale = Math.min((W - pad * 2) / A, (H - pad * 2) / B)
  const offX = (W - A * scale) / 2
  const offY = (H - B * scale) / 2

  const squares = squareTiling(A, B)
  const g = gcd(A, B)
  for (const sq of squares) {
    if (maxStep >= 0 && sq.step > maxStep) continue
    const px = offX + sq.x * scale
    const py = offY + sq.y * scale
    const side = sq.size * scale
    ctx.fillStyle = sq.color + 'cc'
    ctx.fillRect(px, py, side, side)
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 1.2
    ctx.strokeRect(px, py, side, side)
    // 最小正方形（=gcd）标注边长
    if (sq.size === g) {
      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(String(g), px + side / 2, py + side / 2 + 4)
    }
  }

  // 外框
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 2
  ctx.strokeRect(offX, offY, A * scale, B * scale)
}
