/**
 * 点在多边形内 - Canvas 绘制
 * 网格采样每个点，按选定规则染色（内部实心/外部空心），叠加多边形轮廓。
 */
import { rayCasting, insideNonzero, type Pt } from './pointInPolygon'

export type Rule = 'ray' | 'winding'

function testInside(rule: Rule, poly: Pt[], p: Pt): boolean {
  return rule === 'ray' ? rayCasting(poly, p) : insideNonzero(poly, p)
}

/**
 * @param rule 判定规则：射线法(偶奇) 或 环绕数(非零)
 * @param probe 可选探针点，画一条向右的射线并高亮
 */
export function drawPointInPolygon(
  canvas: HTMLCanvasElement,
  polygon: Pt[],
  rule: Rule = 'ray',
  step = 22,
  probe?: Pt,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || polygon.length < 3) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 网格采样点染色
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      const p = { x, y }
      const inside = testInside(rule, polygon, p)
      ctx.beginPath()
      ctx.arc(x, y, 2.4, 0, 2 * Math.PI)
      if (inside) {
        ctx.fillStyle = rule === 'ray' ? '#6366f1' : '#ec4899'
        ctx.fill()
      } else {
        ctx.strokeStyle = '#cbd5e1'
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }

  // 多边形轮廓
  ctx.beginPath()
  ctx.moveTo(polygon[0].x, polygon[0].y)
  for (let i = 1; i < polygon.length; i++) ctx.lineTo(polygon[i].x, polygon[i].y)
  ctx.closePath()
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.fillStyle = '#0f172a'
  for (const v of polygon) {
    ctx.beginPath()
    ctx.arc(v.x, v.y, 3.5, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 探针点与射线
  if (probe) {
    const inside = testInside(rule, polygon, probe)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 1.5
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(probe.x, probe.y)
    ctx.lineTo(W, probe.y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(probe.x, probe.y, 6, 0, 2 * Math.PI)
    ctx.fillStyle = inside ? '#16a34a' : '#dc2626'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()
  }
}
