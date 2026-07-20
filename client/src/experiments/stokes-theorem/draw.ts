/**
 * 斯托克斯定理 Canvas 绘制：旋度热力图 + 向量场 + 带方向的闭合边界 + 两个相等数值。
 * 数学坐标范围固定 [-3.2, 3.2]，y 向上；映射到画布像素。
 */
import {
  curlDensity, pointInRegion, boundaryPoints, circulation, curlIntegral,
  type VectorField, type Region,
} from './stokesTheorem'

const RANGE = 3.2

function heat(v: number, m: number): string {
  const t = Math.max(-1, Math.min(1, v / (m || 1)))
  if (t >= 0) return `rgba(239,68,68,${0.12 + 0.55 * t})` // 正旋度偏红
  return `rgba(59,130,246,${0.12 + 0.55 * -t})` // 负旋度偏蓝
}

export function drawStokesTheorem(
  canvas: HTMLCanvasElement,
  field: VectorField,
  region: Region,
  showValues = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width, H = canvas.height
  const S = Math.min(W, H) / (2 * RANGE)
  const toPx = (x: number, y: number) => [W / 2 + x * S, H / 2 - y * S] as const
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)
  // 1) 区域内旋度热力图
  const maxCurl = Math.max(0.5, Math.abs(curlDensity(field, region.cx, region.cy)),
    Math.abs(curlDensity(field, region.cx + 1, region.cy + 1)))
  const cell = 10
  for (let py = 0; py < H; py += cell) {
    for (let px = 0; px < W; px += cell) {
      const x = (px + cell / 2 - W / 2) / S
      const y = (H / 2 - (py + cell / 2)) / S
      if (!pointInRegion(region, x, y)) continue
      ctx.fillStyle = heat(curlDensity(field, x, y), maxCurl)
      ctx.fillRect(px, py, cell, cell)
    }
  }

  // 2) 向量场箭头（均匀网格采样）
  ctx.strokeStyle = '#334155'; ctx.fillStyle = '#334155'
  for (let gx = -RANGE + 0.4; gx <= RANGE; gx += 0.8) {
    for (let gy = -RANGE + 0.4; gy <= RANGE; gy += 0.8) {
      const vx = field.P(gx, gy), vy = field.Q(gx, gy)
      const len = Math.hypot(vx, vy) || 1
      const s = 0.28 / len
      const [x0, y0] = toPx(gx, gy)
      const [x1, y1] = toPx(gx + vx * s, gy + vy * s)
      arrow(ctx, x0, y0, x1, y1, 3)
    }
  }

  // 3) 闭合边界（逆时针，带方向箭头）
  const bp = boundaryPoints(region, 240)
  ctx.strokeStyle = '#7c3aed'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  bp.forEach((p, i) => {
    const [x, y] = toPx(p.x, p.y)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
  ctx.lineWidth = 1; ctx.strokeStyle = '#7c3aed'; ctx.fillStyle = '#7c3aed'
  for (let k = 0; k < bp.length - 1; k += Math.floor(bp.length / 8)) {
    const a = toPx(bp[k].x, bp[k].y)
    const b = toPx(bp[k + 1].x, bp[k + 1].y)
    arrow(ctx, a[0], a[1], a[0] + (b[0] - a[0]) * 6, a[1] + (b[1] - a[1]) * 6, 5)
  }

  // 4) 两个相等数值
  if (showValues) {
    const circ = circulation(field, region, 1440), flux = curlIntegral(field, region, 100)
    ctx.font = 'bold 15px monospace'
    ctx.fillStyle = '#7c3aed'
    ctx.fillText(`环量 ∮F·dr = ${circ.toFixed(3)}`, 12, 24)
    ctx.fillStyle = '#dc2626'
    ctx.fillText(`旋度积分 ∬curl dA = ${flux.toFixed(3)}`, 12, 46)
    ctx.fillStyle = '#059669'
    ctx.fillText(`两者相等 ✓ (差 ${Math.abs(circ - flux).toExponential(1)})`, 12, 68)
  }
}

function arrow(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, head: number) {
  ctx.beginPath()
  ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke()
  const a = Math.atan2(y1 - y0, x1 - x0)
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x1 - head * Math.cos(a - 0.4), y1 - head * Math.sin(a - 0.4))
  ctx.lineTo(x1 - head * Math.cos(a + 0.4), y1 - head * Math.sin(a + 0.4))
  ctx.closePath()
  ctx.fill()
}
