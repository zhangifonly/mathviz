/**
 * 耳切三角剖分核心算法（纯函数，便于测试）
 *
 * 简单多边形三角化：反复找到一个"耳朵"（凸顶点，其构成的三角形内
 * 不含其他顶点），切下它，直到只剩一个三角形。n 边简单多边形恰好
 * 被切成 n-2 个三角形。
 */

export interface Pt { x: number; y: number }
export interface Triangle { a: Pt; b: Pt; c: Pt }
export interface ClipStep { earIndex: number; triangle: Triangle; remaining: Pt[] }

/** 多边形有向面积的两倍（>0 逆时针，<0 顺时针） */
export function signedArea2(poly: Pt[]): number {
  let s = 0
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % poly.length]
    s += a.x * b.y - b.x * a.y
  }
  return s
}

/** 叉积 (b-a)x(c-a)，正为左转（逆时针） */
export function cross(a: Pt, b: Pt, c: Pt): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
}

/** 点 p 是否落在三角形 abc 内（含边） */
export function pointInTriangle(p: Pt, a: Pt, b: Pt, c: Pt): boolean {
  const d1 = cross(a, b, p), d2 = cross(b, c, p), d3 = cross(c, a, p)
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0
  return !(hasNeg && hasPos)
}

/** 判断逆时针多边形的顶点 i 是否为耳（凸且三角形内无其他顶点） */
export function isEar(poly: Pt[], i: number): boolean {
  const n = poly.length
  if (n < 3) return false
  const prev = poly[(i - 1 + n) % n]
  const cur = poly[i]
  const next = poly[(i + 1) % n]
  if (cross(prev, cur, next) <= 0) return false
  for (let j = 0; j < n; j++) {
    if (j === i || j === (i - 1 + n) % n || j === (i + 1) % n) continue
    if (pointInTriangle(poly[j], prev, cur, next)) return false
  }
  return true
}

/** 耳切法三角剖分，返回三角形列表与逐步切耳帧（先规整为逆时针） */
export function earClipping(polygon: Pt[]): { triangles: Triangle[]; steps: ClipStep[] } {
  const poly = signedArea2(polygon) < 0 ? [...polygon].reverse() : [...polygon]
  const triangles: Triangle[] = []
  const steps: ClipStep[] = []
  let guard = poly.length * poly.length + 5
  while (poly.length > 3 && guard-- > 0) {
    let clipped = false
    for (let i = 0; i < poly.length; i++) {
      if (!isEar(poly, i)) continue
      const n = poly.length
      const tri: Triangle = { a: poly[(i - 1 + n) % n], b: poly[i], c: poly[(i + 1) % n] }
      triangles.push(tri)
      poly.splice(i, 1)
      steps.push({ earIndex: i, triangle: tri, remaining: [...poly] })
      clipped = true
      break
    }
    if (!clipped) break
  }
  if (poly.length === 3) {
    const tri: Triangle = { a: poly[0], b: poly[1], c: poly[2] }
    triangles.push(tri)
    steps.push({ earIndex: 1, triangle: tri, remaining: [] })
  }
  return { triangles, steps }
}

/** 生成五角星（凹多边形），交替外/内半径 */
export function starPolygon(cx: number, cy: number, outer: number, inner: number, points: number): Pt[] {
  const pts: Pt[] = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const ang = -Math.PI / 2 + (i * Math.PI) / points
    pts.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) })
  }
  return pts
}

/** 预置凹多边形：L 形与五角星 */
export const POLYGONS: Record<string, Pt[]> = {
  L形: [
    { x: 80, y: 60 }, { x: 320, y: 60 }, { x: 320, y: 180 },
    { x: 200, y: 180 }, { x: 200, y: 400 }, { x: 80, y: 400 },
  ],
  五角星: starPolygon(300, 250, 200, 90, 5),
}

export const POLYGON_NAMES = Object.keys(POLYGONS)
