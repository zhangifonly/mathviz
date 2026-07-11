/**
 * 点积与叉积（纯函数数学内核，无 DOM）
 *
 * 点积（内积）: a·b = ax*bx + ay*by + az*bz = |a||b|cosθ，结果是标量。
 * 叉积（外积）: a×b 是一个向量，方向垂直于 a、b，模长 = |a||b|sinθ。
 * 二维叉积退化为标量 ax*by - ay*bx（等于三维叉积的 z 分量）。
 */

export interface Vec3 {
  x: number
  y: number
  z: number
}

/** 点积：对应分量相乘再求和 */
export function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

/** 叉积：返回同时垂直于 a、b 的向量（右手定则） */
export function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

/** 二维叉积（标量），等于三维叉积的 z 分量 */
export function cross2d(ax: number, ay: number, bx: number, by: number): number {
  return ax * by - ay * bx
}

/** 向量模长 */
export function magnitude(v: Vec3): number {
  return Math.sqrt(dot(v, v))
}

/** 两向量夹角（弧度，范围 0~π）。零向量返回 0 */
export function angleBetween(a: Vec3, b: Vec3): number {
  const m = magnitude(a) * magnitude(b)
  if (m === 0) return 0
  // 夹紧到 [-1,1] 防止浮点误差导致 acos 返回 NaN
  const c = Math.max(-1, Math.min(1, dot(a, b) / m))
  return Math.acos(c)
}

/** a 在 b 方向上的标量投影：|a|cosθ = a·b / |b| */
export function scalarProjection(a: Vec3, b: Vec3): number {
  const mb = magnitude(b)
  if (mb === 0) return 0
  return dot(a, b) / mb
}

/** 平行四边形面积 = |a×b| = |a||b|sinθ */
export function parallelogramArea(a: Vec3, b: Vec3): number {
  return magnitude(cross(a, b))
}

export interface VectorPairOption {
  id: string
  label: string
  note: string
  a: Vec3
  b: Vec3
}

/** 预设的向量对示例，覆盖垂直、平行、一般夹角三种情形 */
export const DOT_CROSS_OPTIONS: VectorPairOption[] = [
  {
    id: 'perpendicular',
    label: '垂直向量',
    note: '点积为 0，叉积模长最大',
    a: { x: 3, y: 0, z: 0 },
    b: { x: 0, y: 2, z: 0 },
  },
  {
    id: 'general',
    label: '一般夹角',
    note: '点积、叉积都非零',
    a: { x: 3, y: 1, z: 0 },
    b: { x: 1, y: 2, z: 0 },
  },
  {
    id: 'parallel',
    label: '平行向量',
    note: '叉积为 0，点积等于模长乘积',
    a: { x: 2, y: 1, z: 0 },
    b: { x: 4, y: 2, z: 0 },
  },
]
