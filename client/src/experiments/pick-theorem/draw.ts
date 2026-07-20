/**
 * 皮克定理 Canvas 绘制：格点网格 + 多边形 + 内部点(实心)/边界点(空心)
 */
import { shoelaceArea, boundaryPoints, interiorPoints, type Point } from './pickTheorem'

/** 点是否落在线段 a-b 上（整数格点，共线且在区间内） */
function onSegment(p: Point, a: Point, b: Point): boolean {
  const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)
  if (cross !== 0) return false
  return (
    Math.min(a.x, b.x) <= p.x && p.x <= Math.max(a.x, b.x) &&
    Math.min(a.y, b.y) <= p.y && p.y <= Math.max(a.y, b.y)
  )
}

/** 点是否在多边形边界上 */
function onBoundary(p: Point, poly: Point[]): boolean {
  const n = poly.length
  for (let i = 0; i < n; i++) {
    if (onSegment(p, poly[i], poly[(i + 1) % n])) return true
  }
  return false
}

/** 射线法判断点是否在多边形内部（不含边界） */
function inside(p: Point, poly: Point[]): boolean {
  let c = false
  const n = poly.length
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const yi = poly[i].y, yj = poly[j].y, xi = poly[i].x, xj = poly[j].x
    const hit = yi > p.y !== yj > p.y &&
      p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi
    if (hit) c = !c
  }
  return c
}

export function drawPickTheorem(canvas: HTMLCanvasElement, poly: Point[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx || poly.length < 3) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const GX = 10, GY = 10 // 格点范围 0..GX, 0..GY
  const pad = 24
  const sx = (W - 2 * pad) / GX
  const sy = (H - 2 * pad) / GY
  const px = (x: number) => pad + x * sx
  const py = (y: number) => H - pad - y * sy // y 轴向上

  // 网格线
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let x = 0; x <= GX; x++) {
    ctx.beginPath(); ctx.moveTo(px(x), py(0)); ctx.lineTo(px(x), py(GY)); ctx.stroke()
  }
  for (let y = 0; y <= GY; y++) {
    ctx.beginPath(); ctx.moveTo(px(0), py(y)); ctx.lineTo(px(GX), py(y)); ctx.stroke()
  }

  // 多边形填充与描边
  ctx.beginPath()
  poly.forEach((v, i) => (i === 0 ? ctx.moveTo(px(v.x), py(v.y)) : ctx.lineTo(px(v.x), py(v.y))))
  ctx.closePath()
  ctx.fillStyle = 'rgba(99,102,241,0.15)'
  ctx.fill()
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.stroke()

  // 分类并绘制格点
  for (let x = 0; x <= GX; x++) {
    for (let y = 0; y <= GY; y++) {
      const p = { x, y }
      const isB = onBoundary(p, poly)
      const isI = !isB && inside(p, poly)
      if (isI) {
        ctx.fillStyle = '#ec4899'
        ctx.beginPath(); ctx.arc(px(x), py(y), 4.5, 0, 2 * Math.PI); ctx.fill()
      } else if (isB) {
        ctx.fillStyle = '#ffffff'
        ctx.beginPath(); ctx.arc(px(x), py(y), 4.5, 0, 2 * Math.PI); ctx.fill()
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2
        ctx.beginPath(); ctx.arc(px(x), py(y), 4.5, 0, 2 * Math.PI); ctx.stroke()
      } else {
        ctx.fillStyle = '#cbd5e1'
        ctx.beginPath(); ctx.arc(px(x), py(y), 1.6, 0, 2 * Math.PI); ctx.fill()
      }
    }
  }

  // 面积标注
  const A = shoelaceArea(poly)
  const I = interiorPoints(poly)
  const B = boundaryPoints(poly)
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 15px sans-serif'
  ctx.fillText(`A = ${I} + ${B}/2 - 1 = ${A}`, pad, 18)
}
