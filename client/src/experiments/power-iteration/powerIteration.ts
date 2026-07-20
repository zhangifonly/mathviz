/**
 * 幂迭代核心算法（纯函数，便于测试）
 *
 * 反复用矩阵 A 乘以一个向量并归一化：v <- Av / |Av|，
 * 向量会逐步转向 A 的主特征向量（对应绝对值最大的特征值）方向。
 * 用瑞利商 (v·Av)/(v·v) 估计主特征值。这里聚焦 2x2 矩阵。
 */

// 2x2 矩阵按行优先展开：[a, b, c, d] 表示 [[a, b], [c, d]]
export type Matrix2 = [number, number, number, number]
export type Vec2 = [number, number]

export interface IterStep {
  vector: Vec2      // 归一化后的向量
  eigenvalue: number // 该步瑞利商估计的主特征值
}

/** 矩阵作用于向量：A·v */
export function matVec(m: Matrix2, v: Vec2): Vec2 {
  return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]]
}

/** 向量模长 */
export function norm(v: Vec2): number {
  return Math.hypot(v[0], v[1])
}

/** 归一化为单位向量（零向量原样返回） */
export function normalize(v: Vec2): Vec2 {
  const n = norm(v)
  if (n === 0) return [0, 0]
  return [v[0] / n, v[1] / n]
}

/** 点积 */
export function dot(a: Vec2, b: Vec2): number {
  return a[0] * b[0] + a[1] * b[1]
}

/** 瑞利商：估计 v 方向上的特征值 (v·Av)/(v·v) */
export function rayleigh(m: Matrix2, v: Vec2): number {
  const d = dot(v, v)
  if (d === 0) return 0
  return dot(v, matVec(m, v)) / d
}

/**
 * 幂迭代：从 v0 出发，反复 v = Av/|Av|。
 * 返回长度 iters+1 的步序列（含初始步），每步含归一化向量与瑞利商估值。
 */
export function powerIteration(m: Matrix2, v0: Vec2, iters: number): IterStep[] {
  let v = normalize(v0)
  const steps: IterStep[] = [{ vector: v, eigenvalue: rayleigh(m, v) }]
  for (let i = 0; i < iters; i++) {
    v = normalize(matVec(m, v))
    steps.push({ vector: v, eigenvalue: rayleigh(m, v) })
  }
  return steps
}

// 预置示例矩阵：主特征向量方向各不相同，收敛速度也不同
export const SAMPLE_MATRICES: { name: string; matrix: Matrix2 }[] = [
  { name: '对称拉伸', matrix: [2, 1, 1, 2] },
  { name: '非对称', matrix: [3, 1, 0, 2] },
  { name: '强主向', matrix: [4, 0, 0, 1] },
]
