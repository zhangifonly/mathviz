/**
 * 椭圆曲线 Canvas 绘制：曲线 + 两点 P,Q + 弦切法求和 P+Q 的几何构造
 */
import { curveY, pointAdd, negate, type Curve, type Point } from './ellipticCurve'

const RANGE = 4 // 坐标显示范围 [-RANGE, RANGE]

export function drawEllipticCurve(
  canvas: HTMLCanvasElement,
  c: Curve,
  P: Point | null,
  Q: Point | null,
  showSum = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const sx = W / (2 * RANGE)
  const sy = H / (2 * RANGE)
  const tx = (x: number) => W / 2 + x * sx
  const ty = (y: number) => H / 2 - y * sy

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2)
  ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H)
  ctx.stroke()

  // 曲线两支（上下分支）
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  for (const sign of [1, -1]) {
    ctx.beginPath()
    let started = false
    for (let px = 0; px <= W; px++) {
      const x = (px - W / 2) / sx
      const y = curveY(c, x)
      if (y === null) { started = false; continue }
      const yy = ty(sign * y)
      if (!started) { ctx.moveTo(tx(x), yy); started = true }
      else ctx.lineTo(tx(x), yy)
    }
    ctx.stroke()
  }

  const dot = (p: Point, color: string, label: string) => {
    ctx.fillStyle = color
    ctx.beginPath(); ctx.arc(tx(p.x), ty(p.y), 5, 0, 2 * Math.PI); ctx.fill()
    ctx.font = 'bold 15px sans-serif'
    ctx.fillText(label, tx(p.x) + 8, ty(p.y) - 8)
  }

  if (P && Q && showSum) {
    const R = pointAdd(c, P, Q) // P+Q
    const third = negate(R)     // 直线与曲线的第三交点
    // 过 P、Q 的割线（延伸到第三点）
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 1.5
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(tx(P.x), ty(P.y)); ctx.lineTo(tx(Q.x), ty(Q.y))
    if (third) ctx.lineTo(tx(third.x), ty(third.y))
    ctx.stroke()
    if (third && R) {
      // 从第三点竖直对称到 P+Q
      ctx.strokeStyle = '#10b981'
      ctx.beginPath()
      ctx.moveTo(tx(third.x), ty(third.y)); ctx.lineTo(tx(R.x), ty(R.y))
      ctx.stroke()
      ctx.setLineDash([])
      dot(third, '#94a3b8', "R'")
      dot(R, '#10b981', 'P+Q')
    }
    ctx.setLineDash([])
  }

  if (P) dot(P, '#ec4899', 'P')
  if (Q) dot(Q, '#3b82f6', 'Q')
}
