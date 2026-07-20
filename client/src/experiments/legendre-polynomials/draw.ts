/**
 * 勒让德多项式 Canvas 绘制：P_0..P_n 多条曲线 + 正交性内积矩阵
 */
import { sampleCurve, orthogonalityMatrix } from './legendrePolynomials'

const CURVE_COLORS = [
  '#94a3b8', '#6366f1', '#ec4899', '#22d3ee', '#a3e635',
  '#fbbf24', '#f87171', '#34d399',
]

/** 绘制 P_0..P_maxN 在 [-1,1] 上的曲线，y 轴范围 [-1.1,1.1] */
export function drawLegendrePolynomials(
  canvas: HTMLCanvasElement,
  maxN: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const pad = 36
  const yMax = 1.15
  const toX = (x: number) => pad + ((x + 1) / 2) * (W - 2 * pad)
  const toY = (y: number) => H / 2 - (y / yMax) * (H / 2 - pad)

  // 坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, H / 2)
  ctx.lineTo(W - pad, H / 2)
  ctx.moveTo(toX(0), pad)
  ctx.lineTo(toX(0), H - pad)
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('-1', toX(-1) - 6, H / 2 + 16)
  ctx.fillText('1', toX(1) - 4, H / 2 + 16)

  // 各阶曲线
  for (let n = 0; n <= maxN; n++) {
    const pts = sampleCurve(n, 240)
    ctx.strokeStyle = CURVE_COLORS[n % CURVE_COLORS.length]
    ctx.lineWidth = n === maxN ? 2.6 : 1.8
    ctx.beginPath()
    pts.forEach((p, i) => {
      const cx = toX(p.x)
      const cy = toY(p.y)
      if (i === 0) ctx.moveTo(cx, cy)
      else ctx.lineTo(cx, cy)
    })
    ctx.stroke()
    ctx.fillStyle = CURVE_COLORS[n % CURVE_COLORS.length]
    ctx.fillText('P' + n, W - pad + 4, pad + 4 + n * 16)
  }
}

/** 绘制正交性内积矩阵热力图：对角亮、非对角近零 */
export function drawOrthogonalityMatrix(
  canvas: HTMLCanvasElement,
  degrees: number[],
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const M = orthogonalityMatrix(degrees, 1200)
  const k = degrees.length
  const pad = 30
  const cell = Math.min(W - 2 * pad, H - 2 * pad) / k

  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      const v = Math.abs(M[i][j])
      const t = Math.min(1, v / 1.2) // 归一到 [0,1]
      const shade = Math.round(255 - t * 175)
      ctx.fillStyle = `rgb(${shade},${shade},255)`
      const x = pad + j * cell
      const y = pad + i * cell
      ctx.fillRect(x, y, cell - 2, cell - 2)
      ctx.fillStyle = t > 0.35 ? '#ffffff' : '#334155'
      ctx.font = '11px sans-serif'
      ctx.fillText(v < 1e-4 ? '0' : v.toFixed(2), x + cell / 2 - 12, y + cell / 2 + 4)
    }
  }
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('对角=模长² 非对角≈0', pad, H - 8)
}
