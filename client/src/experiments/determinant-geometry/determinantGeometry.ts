/**
 * 行列式的几何意义核心算法（纯函数，便于测试）
 *
 * 二阶行列式 = 两列向量张成的平行四边形的有向面积；
 * 三阶行列式 = 三列向量张成的平行六面体的有向体积。
 * 行列式的绝对值是面积/体积的缩放因子，符号表示定向是否翻转。
 */

export type Matrix2 = [[number, number], [number, number]]
export type Matrix3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
]

export interface Point {
  x: number
  y: number
}

/** 二阶行列式：ad - bc，等于两列向量张成平行四边形的有向面积 */
export function det2(m: Matrix2): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0]
}

/** 三阶行列式：按第一行余子式展开，等于平行六面体的有向体积 */
export function det3(m: Matrix3): number {
  const [a, b, c] = m[0]
  const [d, e, f] = m[1]
  const [g, h, i] = m[2]
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
}

/**
 * 单位正方形经矩阵 M 变换后的平行四边形四个顶点。
 * 列向量 col1=(a,c), col2=(b,d)。
 * 顶点顺序：原点、col1、col1+col2、col2（逆时针闭合）。
 */
export function transformUnitSquare(m: Matrix2): Point[] {
  const [[a, b], [c, d]] = m
  return [
    { x: 0, y: 0 },
    { x: a, y: c },
    { x: a + b, y: c + d },
    { x: b, y: d },
  ]
}

/** 平行四边形面积 = |det|，有向面积保留符号 */
export function signedArea(m: Matrix2): number {
  return det2(m)
}

/** 预置示例矩阵，覆盖放大、剪切、翻转、退化(det=0)四种情形 */
export const SAMPLE_MATRICES: { name: string; matrix: Matrix2 }[] = [
  { name: '恒等', matrix: [[1, 0], [0, 1]] },
  { name: '放大', matrix: [[2, 0], [0, 1.5]] },
  { name: '剪切', matrix: [[1, 1], [0, 1]] },
  { name: '翻转', matrix: [[1, 0], [0, -1]] },
  { name: '退化', matrix: [[2, 1], [4, 2]] },
]
