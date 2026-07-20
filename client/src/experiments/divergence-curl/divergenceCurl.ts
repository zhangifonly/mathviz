/**
 * 散度与旋度核心算法（纯函数，便于测试）
 *
 * 2D 向量场 F(x,y) = [P, Q]。
 * 散度 divergence = ∂P/∂x + ∂Q/∂y，度量某点"源/汇"强度；
 * 旋度（2D 标量）curl = ∂Q/∂x - ∂P/∂y，度量某点旋转强度。
 * 这里用中心差分做数值微分，对任意场函数都成立。
 */

export type FieldId = 'source' | 'rotation' | 'shear' | 'sink'

export interface FieldDef {
  id: FieldId
  name: string
  desc: string
  /** 场函数：返回该点向量 [P, Q]（坐标已归一化到 [-1,1]） */
  fn: (x: number, y: number) => [number, number]
}

/** 四种经典向量场 */
export const FIELDS: FieldDef[] = [
  { id: 'source', name: '源场', desc: '向外发散，散度为正', fn: (x, y) => [x, y] },
  { id: 'rotation', name: '旋转场', desc: '纯旋转，只有旋度', fn: (x, y) => [-y, x] },
  { id: 'shear', name: '剪切场', desc: '横向剪切，兼具旋度', fn: (_x, y) => [y, 0] },
  { id: 'sink', name: '汇场', desc: '向内汇聚，散度为负', fn: (x, y) => [-x, -y] },
]

/** 按 id 取场定义 */
export function getField(id: FieldId): FieldDef {
  const f = FIELDS.find((d) => d.id === id)
  if (!f) throw new Error(`unknown field: ${id}`)
  return f
}

/** 向量场在某点的数值散度（中心差分） */
export function divergence(
  fn: (x: number, y: number) => [number, number],
  x: number,
  y: number,
  h = 1e-4,
): number {
  const dPdx = (fn(x + h, y)[0] - fn(x - h, y)[0]) / (2 * h)
  const dQdy = (fn(x, y + h)[1] - fn(x, y - h)[1]) / (2 * h)
  return dPdx + dQdy
}

/** 向量场在某点的数值旋度（2D 标量，中心差分） */
export function curl(
  fn: (x: number, y: number) => [number, number],
  x: number,
  y: number,
  h = 1e-4,
): number {
  const dQdx = (fn(x + h, y)[1] - fn(x - h, y)[1]) / (2 * h)
  const dPdy = (fn(x, y + h)[0] - fn(x, y - h)[0]) / (2 * h)
  return dQdx - dPdy
}

/** 单个箭头样本：位置(x,y)、向量(u,v)、模长 */
export interface Arrow {
  x: number
  y: number
  u: number
  v: number
  mag: number
}

/**
 * 在 [-1,1]×[-1,1] 上按 n×n 网格采样向量场，返回箭头数组。
 * grid 越大箭头越密。
 */
export function sampleField(
  fn: (x: number, y: number) => [number, number],
  grid = 11,
): Arrow[] {
  const arrows: Arrow[] = []
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const x = -1 + (2 * i) / (grid - 1)
      const y = -1 + (2 * j) / (grid - 1)
      const [u, v] = fn(x, y)
      arrows.push({ x, y, u, v, mag: Math.hypot(u, v) })
    }
  }
  return arrows
}

export const GRID_SIZES = [7, 11, 15]
