/**
 * 切比雪夫多项式 Canvas 绘制
 * 画出 T0..Tn 多条曲线（[-1,1] 区间等幅振荡），并标出最高阶的根节点。
 */
import { sampleCurve, chebyshevRoots, chebyshevT } from './chebyshevPolynomials'

const COLORS = ['#94a3b8', '#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#38bdf8']

/** 绘制 T0..T{maxDegree} 曲线，标出 T{maxDegree} 的根 */
export function drawChebyshevPolynomials(
  canvas: HTMLCanvasElement,
  maxDegree: number,
  showRoots = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const pad = 36
  // 坐标映射：x in [-1,1] -> px；y in [-1,1] -> py（y 轴向上）
  const px = (x: number) => pad + ((x + 1) / 2) * (W - 2 * pad)
  const py = (y: number) => H / 2 - y * (H / 2 - pad)

  // 网格与坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let gy = -1; gy <= 1; gy += 0.5) {
    ctx.beginPath()
    ctx.moveTo(px(-1), py(gy))
    ctx.lineTo(px(1), py(gy))
    ctx.stroke()
  }
  ctx.strokeStyle = '#94a3b8'
  ctx.beginPath()
  ctx.moveTo(px(-1), py(0))
  ctx.lineTo(px(1), py(0))
  ctx.moveTo(px(0), py(-1.05))
  ctx.lineTo(px(0), py(1.05))
  ctx.stroke()

  // 各阶曲线
  for (let n = 0; n <= maxDegree; n++) {
    ctx.strokeStyle = COLORS[n % COLORS.length]
    ctx.lineWidth = n === maxDegree ? 2.8 : 1.4
    ctx.globalAlpha = n === maxDegree ? 1 : 0.55
    ctx.beginPath()
    sampleCurve(n).forEach(([x, y], i) => {
      const X = px(x)
      const Y = py(y)
      if (i === 0) ctx.moveTo(X, Y)
      else ctx.lineTo(X, Y)
    })
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // 最高阶的切比雪夫节点（根）
  if (showRoots && maxDegree >= 1) {
    ctx.fillStyle = '#0f172a'
    for (const r of chebyshevRoots(maxDegree)) {
      ctx.beginPath()
      ctx.arc(px(r), py(chebyshevT(maxDegree, r)), 4, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  // 图例标签
  ctx.fillStyle = COLORS[maxDegree % COLORS.length]
  ctx.font = 'bold 15px sans-serif'
  ctx.fillText(`T${maxDegree}(x)`, W - pad - 54, pad + 4)
}
