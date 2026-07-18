/**
 * 佩尔方程 Canvas 绘制
 * 画双曲线 x^2 - N*y^2 = 1 与其上的整数解点。
 */
import { generateSolutions } from './pellEquation'

/**
 * 绘制双曲线与整数解。以第一个可见解确定坐标缩放，
 * 让基本解落在画面内，并标出前几个解的点。
 * @param maxPoints 最多标注的整数解个数
 */
export function drawPellEquation(
  canvas: HTMLCanvasElement,
  N: number,
  maxPoints = 3,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const sols = generateSolutions(N, Math.max(maxPoints, 1))
  if (sols.length === 0) return

  // 缩放：让第一个解略靠内侧，留边距
  const cx = W / 2
  const cy = H / 2
  const spanX = sols[0].x * 1.4 + 2
  const spanY = sols[0].y * 1.4 + 2
  const sx = (W / 2 - 30) / spanX
  const sy = (H / 2 - 30) / spanY
  const toPx = (x: number) => cx + x * sx
  const toPy = (y: number) => cy - y * sy

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, cy)
  ctx.lineTo(W, cy)
  ctx.moveTo(cx, 0)
  ctx.lineTo(cx, H)
  ctx.stroke()

  // 双曲线：x = ±sqrt(1 + N*y^2)，扫描 y
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  for (const sign of [1, -1]) {
    ctx.beginPath()
    let first = true
    for (let py = 0; py <= H; py += 2) {
      const y = (cy - py) / sy
      const x = sign * Math.sqrt(1 + N * y * y)
      const px = toPx(x)
      if (first) {
        ctx.moveTo(px, py)
        first = false
      } else {
        ctx.lineTo(px, py)
      }
    }
    ctx.stroke()
  }

  // 整数解点（含 ±x, ±y 的对称点）
  ctx.fillStyle = '#ec4899'
  for (const s of sols) {
    for (const gx of [s.x, -s.x]) {
      for (const gy of [s.y, -s.y]) {
        ctx.beginPath()
        ctx.arc(toPx(gx), toPy(gy), 4, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }

  // 标注基本解
  ctx.fillStyle = '#0f172a'
  ctx.font = '13px sans-serif'
  ctx.fillText(`(${sols[0].x}, ${sols[0].y})`, toPx(sols[0].x) + 6, toPy(sols[0].y) - 6)
}
