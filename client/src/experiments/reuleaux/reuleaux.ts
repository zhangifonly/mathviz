/**
 * 等宽曲线 - 勒洛多边形核心算法（纯函数，便于测试）
 *
 * 勒洛多边形基于奇数边正多边形构造：把每条边替换成一段圆弧，
 * 该圆弧以对面的顶点为圆心，半径恰为多边形的"宽度" width。
 * 由此得到一条处处等宽的曲线（如勒洛三角形）。
 */

export interface Point {
  x: number
  y: number
}

/** 一段圆弧：圆心(cx,cy)、半径 r、起止角(弧度)、是否逆时针 */
export interface Arc {
  cx: number
  cy: number
  r: number
  start: number
  end: number
  ccw: boolean
}

/** 支持的边数：只能是奇数 */
export const SIDES = [3, 5, 7]

/** 由恒定宽度反推底层正多边形的外接圆半径 */
export function circumRadius(n: number, width: number): number {
  return width / (2 * Math.sin((Math.PI * (n - 1)) / (2 * n)))
}

/** n 个顶点，均匀分布在外接圆上（顶点在正上方起始） */
export function reuleauxVertices(n: number, cx: number, cy: number, width: number): Point[] {
  const rc = circumRadius(n, width)
  const pts: Point[] = []
  for (let k = 0; k < n; k++) {
    const a = -Math.PI / 2 + (2 * Math.PI * k) / n
    pts.push({ x: cx + rc * Math.cos(a), y: cy + rc * Math.sin(a) })
  }
  return pts
}

/** 归一化到 (-PI, PI] */
function norm(a: number): number {
  while (a > Math.PI) a -= 2 * Math.PI
  while (a <= -Math.PI) a += 2 * Math.PI
  return a
}

/** 返回 n 段圆弧，每段以对面顶点为圆心，半径为 width */
export function reuleauxArcs(n: number, cx: number, cy: number, width: number): Arc[] {
  const v = reuleauxVertices(n, cx, cy, width)
  const opp = (n + 1) / 2
  const arcs: Arc[] = []
  for (let k = 0; k < n; k++) {
    const c = v[(k + opp) % n]
    const p0 = v[k]
    const p1 = v[(k + 1) % n]
    const start = Math.atan2(p0.y - c.y, p0.x - c.x)
    const end = Math.atan2(p1.y - c.y, p1.x - c.x)
    arcs.push({ cx: c.x, cy: c.y, r: width, start, end, ccw: norm(end - start) < 0 })
  }
  return arcs
}

/** 沿曲线采样边界点，每段圆弧 per 个点 */
export function boundaryPoints(n: number, cx: number, cy: number, width: number, per = 24): Point[] {
  const arcs = reuleauxArcs(n, cx, cy, width)
  const pts: Point[] = []
  for (const arc of arcs) {
    const span = norm(arc.end - arc.start)
    for (let i = 0; i < per; i++) {
      const a = arc.start + (span * i) / per
      pts.push({ x: arc.cx + arc.r * Math.cos(a), y: arc.cy + arc.r * Math.sin(a) })
    }
  }
  return pts
}

/** 在方向 theta 上测量图形的宽度（投影跨度）。等宽曲线该值恒为 width */
export function widthAlong(points: Point[], theta: number): number {
  const ux = Math.cos(theta)
  const uy = Math.sin(theta)
  let lo = Infinity
  let hi = -Infinity
  for (const p of points) {
    const proj = p.x * ux + p.y * uy
    if (proj < lo) lo = proj
    if (proj > hi) hi = proj
  }
  return hi - lo
}

/** 勒洛多边形面积（宽度 width）：A = (1/2)(PI - n*tan(PI/2n)) w^2 */
export function reuleauxArea(n: number, width: number): number {
  return 0.5 * (Math.PI - n * Math.tan(Math.PI / (2 * n))) * width * width
}

/** 周长（巴比尔定理）：所有等宽 width 的曲线周长都是 PI*width */
export function reuleauxPerimeter(width: number): number {
  return Math.PI * width
}
