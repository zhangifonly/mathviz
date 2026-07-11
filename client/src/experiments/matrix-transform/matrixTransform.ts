/**
 * 2x2 矩阵变换（纯函数，便于测试，不碰 DOM）
 *
 * 一个 2x2 矩阵 [[a,b],[c,d]] 定义了平面上的一次线性变换：
 * 它把基向量 i=(1,0) 送到 (a,c)，把 j=(0,1) 送到 (b,d)。
 * 行列式 ad-bc 表示单位正方形被变换后的有向面积（缩放因子）。
 */

/** 二维向量 */
export interface Vec2 {
  x: number
  y: number
}

/** 2x2 矩阵，按 [a, b, c, d] 表示矩阵 [[a, b], [c, d]] */
export type Mat2 = [number, number, number, number]

/** 单位矩阵（恒等变换） */
export const IDENTITY: Mat2 = [1, 0, 0, 1]

/** 把矩阵作用到向量：[[a,b],[c,d]] · (x,y) = (a x + b y, c x + d y) */
export function applyMatrix(m: Mat2, v: Vec2): Vec2 {
  const [a, b, c, d] = m
  return { x: a * v.x + b * v.y, y: c * v.x + d * v.y }
}

/** 矩阵乘法 m1 · m2（先做 m2 再做 m1 的复合变换） */
export function multiplyMatrix(m1: Mat2, m2: Mat2): Mat2 {
  const [a, b, c, d] = m1
  const [e, f, g, h] = m2
  return [a * e + b * g, a * f + b * h, c * e + d * g, c * f + d * h]
}

/** 行列式 ad - bc，即面积缩放因子（负号表示翻转朝向） */
export function determinant(m: Mat2): number {
  const [a, b, c, d] = m
  return a * d - b * c
}

/** 旋转矩阵（角度制，逆时针为正） */
export function rotationMatrix(deg: number): Mat2 {
  const r = (deg * Math.PI) / 180
  const cos = Math.cos(r)
  const sin = Math.sin(r)
  return [cos, -sin, sin, cos]
}

/** 在恒等矩阵与目标矩阵之间线性插值，t 从 0 到 1，用于动画过渡 */
export function lerpMatrix(from: Mat2, to: Mat2, t: number): Mat2 {
  const k = Math.max(0, Math.min(1, t))
  return [
    from[0] + (to[0] - from[0]) * k,
    from[1] + (to[1] - from[1]) * k,
    from[2] + (to[2] - from[2]) * k,
    from[3] + (to[3] - from[3]) * k,
  ]
}

export interface TransformOption {
  id: string
  label: string
  matrix: Mat2
  note: string
}

/** 常见的线性变换预设 */
export const TRANSFORM_OPTIONS: TransformOption[] = [
  { id: 'rotate', label: '旋转 90°', matrix: rotationMatrix(90), note: '行列式=1，面积不变，方向不翻转' },
  { id: 'scale', label: '放大 2 倍', matrix: [2, 0, 0, 2], note: '行列式=4，面积放大到 4 倍' },
  { id: 'shear', label: '水平错切', matrix: [1, 1, 0, 1], note: '行列式=1，正方形被推成平行四边形' },
  { id: 'reflect', label: '关于 x 轴翻转', matrix: [1, 0, 0, -1], note: '行列式=-1，方向被翻转' },
  { id: 'squash', label: '压扁（奇异）', matrix: [1, 1, 1, 1], note: '行列式=0，平面被压成一条直线' },
]
