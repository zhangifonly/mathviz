/**
 * 皮克定理核心算法（纯函数，便于测试）
 *
 * 对顶点全为格点的简单多边形，其面积 A = I + B/2 - 1，
 * 其中 I 为内部格点数，B 为边界格点数。
 * 这里用鞋带公式算真实面积，用 gcd 算边界格点数，
 * 再反推内部格点数，最终验证皮克公式成立。
 */

export interface Point {
  x: number
  y: number
}

/** 最大公约数（辗转相除，取绝对值） */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

/** 鞋带公式：多边形有向面积的绝对值（顶点须为多边形顺序） */
export function shoelaceArea(poly: Point[]): number {
  const n = poly.length
  let sum = 0
  for (let i = 0; i < n; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % n]
    sum += a.x * b.y - b.x * a.y
  }
  return Math.abs(sum) / 2
}

/** 边界格点数 B：每条边上格点数 = gcd(|dx|,|dy|)，累加即为总边界点数 */
export function boundaryPoints(poly: Point[]): number {
  const n = poly.length
  let total = 0
  for (let i = 0; i < n; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % n]
    total += gcd(b.x - a.x, b.y - a.y)
  }
  return total
}

/** 内部格点数 I = A - B/2 + 1（由皮克公式反解） */
export function interiorPoints(poly: Point[]): number {
  const A = shoelaceArea(poly)
  const B = boundaryPoints(poly)
  return A - B / 2 + 1
}

/** 皮克公式重算面积 A = I + B/2 - 1，用于与鞋带面积对照验证 */
export function pickArea(poly: Point[]): number {
  const I = interiorPoints(poly)
  const B = boundaryPoints(poly)
  return I + B / 2 - 1
}

export interface PresetPolygon {
  name: string
  vertices: Point[]
}

/** 若干组格点多边形（坐标皆为整数格点） */
export const PRESET_POLYGONS: PresetPolygon[] = [
  {
    name: '三角形',
    vertices: [
      { x: 1, y: 1 },
      { x: 7, y: 2 },
      { x: 3, y: 6 },
    ],
  },
  {
    name: '矩形',
    vertices: [
      { x: 1, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 5 },
      { x: 1, y: 5 },
    ],
  },
  {
    name: '五边形',
    vertices: [
      { x: 2, y: 1 },
      { x: 7, y: 2 },
      { x: 8, y: 6 },
      { x: 4, y: 8 },
      { x: 1, y: 4 },
    ],
  },
  {
    name: 'L 形',
    vertices: [
      { x: 1, y: 1 },
      { x: 7, y: 1 },
      { x: 7, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 7 },
      { x: 1, y: 7 },
    ],
  },
]
