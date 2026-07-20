/**
 * 生日悖论 Canvas 绘制：概率随人数 n 增长的曲线。
 * 标注 n=23（约 0.507）与 n=70（约 0.999）两个关键点。
 */
import { collisionProb } from './birthdayParadox'

const MAX_N = 100
const PAD = 44

/**
 * 绘制概率曲线。
 * @param highlightN  高亮显示的人数（画竖线 + 圆点 + 概率标签），可选
 * @param simProb     该人数下的模拟频率（画一个空心圆对照），可选
 */
export function drawBirthdayParadox(
  canvas: HTMLCanvasElement,
  highlightN?: number,
  simProb?: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const px = (n: number) => PAD + (n / MAX_N) * (W - PAD * 2)
  const py = (p: number) => H - PAD - p * (H - PAD * 2)

  // 网格与坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let g = 0; g <= 10; g++) {
    const y = py(g / 10)
    ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke()
  }
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('0%', 8, py(0)); ctx.fillText('50%', 4, py(0.5)); ctx.fillText('100%', 2, py(1))
  ctx.fillText('人数 n', W - PAD - 30, H - PAD + 26)

  // 50% 参考线
  ctx.strokeStyle = '#f59e0b'; ctx.setLineDash([5, 4])
  ctx.beginPath(); ctx.moveTo(PAD, py(0.5)); ctx.lineTo(W - PAD, py(0.5)); ctx.stroke()
  ctx.setLineDash([])

  // 概率曲线
  ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let n = 1; n <= MAX_N; n++) {
    const x = px(n); const y = py(collisionProb(n))
    if (n === 1) ctx.moveTo(x, y); else ctx.lineTo(x, y)
  }
  ctx.stroke()

  markPoint(ctx, px, py, 23, '#ec4899')
  markPoint(ctx, px, py, 70, '#22c55e')

  if (highlightN && highlightN >= 1 && highlightN <= MAX_N) {
    const p = collisionProb(highlightN)
    ctx.strokeStyle = '#0f172a'; ctx.setLineDash([3, 3])
    ctx.beginPath(); ctx.moveTo(px(highlightN), py(0)); ctx.lineTo(px(highlightN), py(p)); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#0f172a'
    ctx.beginPath(); ctx.arc(px(highlightN), py(p), 5, 0, 2 * Math.PI); ctx.fill()
    ctx.font = 'bold 13px sans-serif'
    ctx.fillText(`n=${highlightN}: ${(p * 100).toFixed(1)}%`, px(highlightN) + 8, py(p) - 8)
    if (simProb !== undefined) {
      ctx.strokeStyle = '#0891b2'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(px(highlightN), py(simProb), 6, 0, 2 * Math.PI); ctx.stroke()
    }
  }
}

function markPoint(
  ctx: CanvasRenderingContext2D,
  px: (n: number) => number,
  py: (p: number) => number,
  n: number,
  color: string,
) {
  const p = collisionProb(n)
  ctx.fillStyle = color
  ctx.beginPath(); ctx.arc(px(n), py(p), 4, 0, 2 * Math.PI); ctx.fill()
  ctx.font = '11px sans-serif'
  ctx.fillText(`n=${n} ≈ ${(p * 100).toFixed(1)}%`, px(n) - 20, py(p) - 10)
}
