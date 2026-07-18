/**
 * 高尔顿板 Canvas 绘制：上方钉板三角 + 下方柱状堆积 + 叠加正态曲线
 */
import { binomialDist } from './galtonBoard'

/**
 * 绘制高尔顿板。
 * @param counts 各槽小球计数（长度 rows+1）
 */
export function drawGaltonBoard(
  canvas: HTMLCanvasElement,
  rows: number,
  counts: number[],
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const pegTop = 30
  const pegBottom = H * 0.45
  const gapX = W / (rows + 2)
  const cx = W / 2

  // 钉板三角：第 r 层有 r+1 个钉子
  ctx.fillStyle = '#94a3b8'
  for (let r = 0; r < rows; r++) {
    const y = pegTop + (r / Math.max(1, rows - 1)) * (pegBottom - pegTop)
    for (let c = 0; c <= r; c++) {
      const x = cx + (c - r / 2) * gapX
      ctx.beginPath()
      ctx.arc(x, y, 2.5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  // 底部柱状堆积
  const slots = rows + 1
  const barW = (W - 20) / slots
  const total = counts.reduce((a, b) => a + b, 0) || 1
  const maxCount = Math.max(...counts, 1)
  const chartTop = pegBottom + 20
  const chartBottom = H - 24
  const chartH = chartBottom - chartTop
  ctx.fillStyle = '#6366f1'
  for (let i = 0; i < slots; i++) {
    const h = (counts[i] / maxCount) * chartH
    const x = 10 + i * barW
    ctx.fillRect(x + 1, chartBottom - h, barW - 2, h)
  }

  // 叠加理论正态（二项）曲线
  const dist = binomialDist(rows)
  const maxProb = Math.max(...dist)
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < slots; i++) {
    const x = 10 + i * barW + barW / 2
    const y = chartBottom - (dist[i] / maxProb) * chartH
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText(`共 ${total} 球`, 12, chartBottom + 18)
}
