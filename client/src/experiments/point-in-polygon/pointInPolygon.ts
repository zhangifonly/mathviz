/**
 * 点在多边形内 - 核心算法（纯函数，便于测试）
 *
 * 提供两种判定：
 *  1) 射线法 rayCasting：从点向右发一条水平射线，数它与多边形边的交点个数，
 *     奇数在内、偶数在外（偶奇规则 even-odd rule）。
 *  2) 环绕数 windingNumber：累计多边形绕点旋转的圈数，非零即在内（nonzero rule）。
 *
 * 对凸多边形两法一致；对自交多边形（如五角星画法），两法可能给出不同结果。
 */

export interface Pt {
  x: number
  y: number
}

/**
 * 射线法：偶奇规则。向 +x 方向发射线，统计穿过的边数。
 */
export function rayCasting(polygon: Pt[], p: Pt): boolean {
  let inside = false
  const n = polygon.length
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const a = polygon[i]
    const b = polygon[j]
    // 边 (a,b) 是否跨越点的水平线
    const straddles = a.y > p.y !== b.y > p.y
    if (straddles) {
      // 交点的 x 坐标，位于点右侧则计一次穿越
      const xCross = ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x
      if (p.x < xCross) inside = !inside
    }
  }
  return inside
}

/** 叉积判定点相对有向边 a->b 的左右：>0 在左侧 */
function isLeft(a: Pt, b: Pt, p: Pt): number {
  return (b.x - a.x) * (p.y - a.y) - (p.x - a.x) * (b.y - a.y)
}

/**
 * 环绕数：非零规则。返回多边形绕点的整数圈数（有符号），非零即在内部。
 */
export function windingNumber(polygon: Pt[], p: Pt): number {
  let wn = 0
  const n = polygon.length
  for (let i = 0; i < n; i++) {
    const a = polygon[i]
    const b = polygon[(i + 1) % n]
    if (a.y <= p.y) {
      if (b.y > p.y && isLeft(a, b, p) > 0) wn++
    } else {
      if (b.y <= p.y && isLeft(a, b, p) < 0) wn--
    }
  }
  return wn
}

/** 非零规则的布尔判定 */
export function insideNonzero(polygon: Pt[], p: Pt): boolean {
  return windingNumber(polygon, p) !== 0
}

/** 一个凸六边形 */
const CONVEX: Pt[] = [
  { x: 300, y: 60 }, { x: 480, y: 160 }, { x: 480, y: 340 },
  { x: 300, y: 440 }, { x: 120, y: 340 }, { x: 120, y: 160 },
]

/** 一个凹的 L / 箭头形多边形 */
const CONCAVE: Pt[] = [
  { x: 120, y: 80 }, { x: 300, y: 240 }, { x: 480, y: 80 },
  { x: 400, y: 420 }, { x: 300, y: 300 }, { x: 200, y: 420 },
]

/** 自交五角星（按顶点跳步连线），偶奇与非零规则在中心区不同 */
function makeStar(cx: number, cy: number, r: number): Pt[] {
  const pts: Pt[] = []
  for (let k = 0; k < 5; k++) {
    const ang = (-Math.PI / 2) + (k * 4 * Math.PI) / 5
    pts.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) })
  }
  return pts
}

const STAR: Pt[] = makeStar(300, 250, 190)

export const POLYGONS: Record<string, Pt[]> = {
  convex: CONVEX,
  concave: CONCAVE,
  star: STAR,
}

export const POLYGON_KEYS = ['convex', 'concave', 'star'] as const
