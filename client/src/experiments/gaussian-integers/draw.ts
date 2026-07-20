/**
 * 高斯整数 Canvas 绘制
 *
 * 在复平面格点上画出全部高斯整数（灰点），高斯素数高亮（洋红），
 * 由此直观展示其四/八重对称分布。range 控制显示的方格半径。
 */
import { isGaussianPrime } from './gaussianIntegers'

export function drawGaussianIntegers(
  canvas: HTMLCanvasElement,
  range: number,
  showPrimesOnly = false,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const unit = Math.min(W, H) / (2 * range + 2)

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, cy)
  ctx.lineTo(W, cy)
  ctx.moveTo(cx, 0)
  ctx.lineTo(cx, H)
  ctx.stroke()

  const dot = Math.max(2, unit * 0.28)
  for (let a = -range; a <= range; a++) {
    for (let b = -range; b <= range; b++) {
      const prime = isGaussianPrime(a, b)
      if (showPrimesOnly && !prime) continue
      const px = cx + a * unit
      const py = cy - b * unit
      ctx.beginPath()
      if (prime) {
        ctx.fillStyle = '#db2777'
        ctx.arc(px, py, dot * 1.35, 0, 2 * Math.PI)
      } else {
        ctx.fillStyle = '#cbd5e1'
        ctx.arc(px, py, dot * 0.7, 0, 2 * Math.PI)
      }
      ctx.fill()
    }
  }

  // 原点标记
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(cx, cy, dot * 0.8, 0, 2 * Math.PI)
  ctx.fill()
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText('实轴 Re', W - 56, cy - 6)
  ctx.fillText('虚轴 Im', cx + 6, 14)
}
