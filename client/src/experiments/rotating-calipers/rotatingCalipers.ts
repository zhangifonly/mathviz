/**
 * 旋转卡壳核心算法（纯函数）：Andrew 单调链求凸包，
 * 再旋转卡壳求最远点对(直径)与最小面积外接矩形。全部自实现。
 */
export interface Point {
  x: number
  y: number
}

/** 叉积 (b-a)x(c-a)，>0 为左转（逆时针） */
export function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
}

export function dist2(a: Point, b: Point): number {
  return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)
}

/** 生成 n 个随机点（线性同余伪随机，可复现） */
export function makePoints(n: number, width: number, height: number, seed = 1): Point[] {
  let s = seed
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const pad = 40
  const pts: Point[] = []
  for (let i = 0; i < n; i++) {
    pts.push({ x: pad + rand() * (width - 2 * pad), y: pad + rand() * (height - 2 * pad) })
  }
  return pts
}

/** Andrew 单调链求凸包，返回逆时针顶点，不含重复首点 */
export function convexHull(points: Point[]): Point[] {
  const pts = [...points].sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x))
  if (pts.length <= 2) return pts
  const build = (arr: Point[]): Point[] => {
    const st: Point[] = []
    for (const p of arr) {
      while (st.length >= 2 && cross(st[st.length - 2], st[st.length - 1], p) <= 0) st.pop()
      st.push(p)
    }
    st.pop()
    return st
  }
  return build(pts).concat(build([...pts].reverse()))
}

/** 旋转卡壳求凸包直径（最远点对），返回两端点与距离平方 */
export function diameter(hull: Point[]): { a: Point; b: Point; d2: number } {
  if (hull.length < 2) return { a: hull[0], b: hull[0], d2: 0 }
  if (hull.length === 2) return { a: hull[0], b: hull[1], d2: dist2(hull[0], hull[1]) }
  const n = hull.length
  let best = { a: hull[0], b: hull[1], d2: dist2(hull[0], hull[1]) }
  let j = 1
  for (let i = 0; i < n; i++) {
    const ni = (i + 1) % n
    while (
      Math.abs(cross(hull[i], hull[ni], hull[(j + 1) % n])) > Math.abs(cross(hull[i], hull[ni], hull[j]))
    ) {
      j = (j + 1) % n
    }
    for (const k of [i, ni]) {
      const d = dist2(hull[k], hull[j])
      if (d > best.d2) best = { a: hull[k], b: hull[j], d2: d }
    }
  }
  return best
}

/** 最小面积外接矩形：沿每条凸包边旋转支撑线，取面积最小者，返回四角与面积 */
export function minAreaRect(hull: Point[]): { corners: Point[]; area: number } {
  if (hull.length < 3) return { corners: hull.slice(), area: 0 }
  const n = hull.length
  let best = { corners: [] as Point[], area: Infinity }
  for (let i = 0; i < n; i++) {
    const p = hull[i]
    const q = hull[(i + 1) % n]
    const len = Math.hypot(q.x - p.x, q.y - p.y) || 1
    const ux = (q.x - p.x) / len
    const uy = (q.y - p.y) / len
    let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity
    for (const r of hull) {
      const u = (r.x - p.x) * ux + (r.y - p.y) * uy
      const v = (r.x - p.x) * -uy + (r.y - p.y) * ux
      minU = Math.min(minU, u); maxU = Math.max(maxU, u)
      minV = Math.min(minV, v); maxV = Math.max(maxV, v)
    }
    const area = (maxU - minU) * (maxV - minV)
    if (area < best.area) {
      const at = (u: number, v: number): Point => ({ x: p.x + ux * u - uy * v, y: p.y + uy * u + ux * v })
      best = { area, corners: [at(minU, minV), at(maxU, minV), at(maxU, maxV), at(minU, maxV)] }
    }
  }
  return best
}

export const POINT_COUNTS = [12, 24, 48]
