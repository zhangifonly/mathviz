/**
 * 雅可比矩阵核心算法（纯函数，便于测试）
 *
 * 给定一个 2D 非线性映射 T(u,v) = (x(u,v), y(u,v))，
 * 雅可比矩阵 J = [[dx/du, dx/dv], [dy/du, dy/dv]] 描述该映射在
 * 某点附近的局部线性近似；其行列式 det(J) 是局部面积缩放因子。
 * 这里用数值偏导（中心差分）计算，通用且稳定。
 */

export type Mapping = (u: number, v: number) => [number, number]

export interface MappingDef {
  id: string
  name: string
  T: Mapping
}

/** 极坐标映射：u=半径, v=角度 */
const polar: Mapping = (u, v) => [u * Math.cos(v), u * Math.sin(v)]

/** 复平方 z^2 = (u+iv)^2，双曲型扭曲 */
const square: Mapping = (u, v) => [u * u - v * v, 2 * u * v]

/** 指数螺旋（复指数 e^z 的变体） */
const swirl: Mapping = (u, v) => {
  const r = Math.exp(u * 0.6)
  return [r * Math.cos(v), r * Math.sin(v)]
}

/** 剪切+波浪，非均匀拉伸 */
const wave: Mapping = (u, v) => [u + 0.4 * Math.sin(v), v + 0.4 * Math.sin(u)]

export const MAPPINGS: MappingDef[] = [
  { id: 'polar', name: '极坐标映射', T: polar },
  { id: 'square', name: '复平方 z²', T: square },
  { id: 'swirl', name: '指数螺旋', T: swirl },
  { id: 'wave', name: '正弦剪切', T: wave },
]

/**
 * 中心差分数值偏导求 2x2 雅可比矩阵。
 * 返回 [[dxdu, dxdv], [dydu, dydv]]。
 */
export function jacobianMatrix(
  T: Mapping,
  u: number,
  v: number,
  h = 1e-4,
): [[number, number], [number, number]] {
  const [xu1, yu1] = T(u + h, v)
  const [xu0, yu0] = T(u - h, v)
  const [xv1, yv1] = T(u, v + h)
  const [xv0, yv0] = T(u, v - h)
  const dxdu = (xu1 - xu0) / (2 * h)
  const dydu = (yu1 - yu0) / (2 * h)
  const dxdv = (xv1 - xv0) / (2 * h)
  const dydv = (yv1 - yv0) / (2 * h)
  return [
    [dxdu, dxdv],
    [dydu, dydv],
  ]
}

/** 2x2 行列式 = 局部面积缩放因子 */
export function det2(m: [[number, number], [number, number]]): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0]
}

/** 直接求映射在 (u,v) 处的雅可比行列式 */
export function jacobianDet(T: Mapping, u: number, v: number): number {
  return det2(jacobianMatrix(T, u, v))
}

/** 按 id 取映射定义 */
export function getMapping(id: string): MappingDef {
  return MAPPINGS.find((m) => m.id === id) ?? MAPPINGS[0]
}

/** uv 平面上均匀网格线的采样点数量（每边格数） */
export const GRID_STEPS = 8
export const MAPPING_IDS = MAPPINGS.map((m) => m.id)
