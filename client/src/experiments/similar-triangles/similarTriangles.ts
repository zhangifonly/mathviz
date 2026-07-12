/**
 * 相似三角形（纯函数数学内核，无 DOM）
 *
 * 相似三角形：形状相同、大小可不同。对应角相等，对应边成比例。
 * 若相似比（缩放系数）为 k，则对应边之比都是 k，而面积之比是 k 的平方。
 */

export interface Point {
  x: number
  y: number
}

/** 用于演示的基准三角形（world 坐标，单位任意） */
export const BASE_TRIANGLE: Point[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 1, y: 3 },
]

/** 两点间距离 */
export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/** 三条边长：[AB, BC, CA]，与顶点顺序 [A,B,C] 对应 */
export function sideLengths(tri: Point[]): [number, number, number] {
  const [a, b, c] = tri
  return [distance(a, b), distance(b, c), distance(c, a)]
}

/** 三角形面积（鞋带公式，取绝对值） */
export function triangleArea(tri: Point[]): number {
  const [a, b, c] = tri
  return Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2
}

/** 顶点 p 处的内角（度），由指向另两点的向量夹角求得 */
function angleAt(p: Point, q: Point, r: Point): number {
  const v1x = q.x - p.x
  const v1y = q.y - p.y
  const v2x = r.x - p.x
  const v2y = r.y - p.y
  const dot = v1x * v2x + v1y * v2y
  const m1 = Math.hypot(v1x, v1y)
  const m2 = Math.hypot(v2x, v2y)
  if (m1 === 0 || m2 === 0) return 0
  const cos = Math.max(-1, Math.min(1, dot / (m1 * m2)))
  return (Math.acos(cos) * 180) / Math.PI
}

/** 三个内角（度）：[A, B, C]，顺序与顶点对应 */
export function triangleAngles(tri: Point[]): [number, number, number] {
  const [a, b, c] = tri
  return [angleAt(a, b, c), angleAt(b, a, c), angleAt(c, a, b)]
}

/** 以质心为中心，把三角形按系数 k 缩放（相似变换） */
export function scaleTriangle(tri: Point[], k: number): Point[] {
  const cx = (tri[0].x + tri[1].x + tri[2].x) / 3
  const cy = (tri[0].y + tri[1].y + tri[2].y) / 3
  return tri.map((p) => ({ x: cx + (p.x - cx) * k, y: cy + (p.y - cy) * k }))
}

export interface SimilarData {
  base: Point[]
  scaled: Point[]
  k: number
  baseSides: [number, number, number]
  scaledSides: [number, number, number]
  angles: [number, number, number]
  baseArea: number
  scaledArea: number
  areaRatio: number
}

/** 给定相似比 k，计算基准三角形与相似三角形的全部量 */
export function computeSimilar(k: number, tri: Point[] = BASE_TRIANGLE): SimilarData {
  const scaled = scaleTriangle(tri, k)
  const baseArea = triangleArea(tri)
  const scaledArea = triangleArea(scaled)
  return {
    base: tri,
    scaled,
    k,
    baseSides: sideLengths(tri),
    scaledSides: sideLengths(scaled),
    angles: triangleAngles(tri),
    baseArea,
    scaledArea,
    areaRatio: baseArea === 0 ? 0 : scaledArea / baseArea,
  }
}

export interface ScaleOption {
  k: number
  label: string
  note: string
}

export const SCALE_OPTIONS: ScaleOption[] = [
  { k: 0.5, label: '相似比 1:2', note: '缩小一半，面积变四分之一' },
  { k: 1.5, label: '相似比 3:2', note: '放大 1.5 倍，面积变 2.25 倍' },
  { k: 2, label: '相似比 2:1', note: '放大 2 倍，面积变 4 倍' },
  { k: 3, label: '相似比 3:1', note: '放大 3 倍，面积变 9 倍' },
]
