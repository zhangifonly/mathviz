/**
 * 奇异值分解 SVD（纯函数数学内核，不依赖 DOM）
 *
 * 任意 2x2 矩阵 A 都能写成 A = U · Σ · Vᵀ 三步动作：
 *   1. Vᵀ 先把空间旋转到主轴方向
 *   2. Σ 沿两个主轴分别拉伸 σ1、σ2（奇异值，非负）
 *   3. U 再旋转到最终朝向
 * 几何上：单位圆经过 A 变换后一定是个椭圆，两条半轴长正好是 σ1、σ2。
 */

/** 2x2 矩阵，行主序 [[a,b],[c,d]] 存成 [a,b,c,d] */
export type Mat2 = [number, number, number, number]
/** 二维向量 */
export type Vec2 = [number, number]

export interface Svd2Result {
  /** 左奇异向量矩阵（旋转），列向量为 u1,u2 */
  U: Mat2
  /** 奇异值 [σ1, σ2]，满足 σ1 ≥ σ2 ≥ 0 */
  S: Vec2
  /** 右奇异向量矩阵（旋转），列向量为 v1,v2 */
  V: Mat2
  /** U 对应的旋转角（弧度） */
  angleU: number
  /** V 对应的旋转角（弧度） */
  angleV: number
}

/** 生成旋转矩阵 R(θ)，列主序即 [[cosθ,-sinθ],[sinθ,cosθ]] */
export function rotation(angle: number): Mat2 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return [c, -s, s, c]
}

/** 矩阵乘向量 A·v */
export function applyMat2(m: Mat2, v: Vec2): Vec2 {
  return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]]
}

/** 矩阵乘矩阵 A·B */
export function matMul(a: Mat2, b: Mat2): Mat2 {
  return [
    a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3],
    a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3],
  ]
}

/**
 * 对 2x2 矩阵做奇异值分解。
 * 思路：对对称阵 AᵀA 做特征分解得到右奇异向量 V 与奇异值 σ=√λ，
 * 再由 uᵢ = A·vᵢ/σᵢ 求出左奇异向量 U。对 2x2 是精确闭式解，无需迭代。
 */
export function svd2(A: Mat2): Svd2Result {
  const [a, b, c, d] = A
  // AᵀA = [[p, q],[q, r]]（对称）
  const p = a * a + c * c
  const q = a * b + c * d
  const r = b * b + d * d
  const mid = (p + r) / 2
  const diff = Math.sqrt(((p - r) / 2) ** 2 + q * q)
  const lambda1 = Math.max(mid + diff, 0)
  const lambda2 = Math.max(mid - diff, 0)
  const s1 = Math.sqrt(lambda1)
  const s2 = Math.sqrt(lambda2)
  // 第一右奇异向量：AᵀA 的最大特征向量
  let v1x: number, v1y: number
  if (Math.abs(q) > 1e-12) {
    v1x = q
    v1y = lambda1 - p
  } else {
    // q≈0，AᵀA 已对角，主轴沿坐标轴
    v1x = p >= r ? 1 : 0
    v1y = p >= r ? 0 : 1
  }
  const vn = Math.hypot(v1x, v1y) || 1
  v1x /= vn
  v1y /= vn
  // v2 取右旋 90°，使 V 成为纯旋转（det=+1）
  const v2x = -v1y
  const v2y = v1x
  const V: Mat2 = [v1x, v2x, v1y, v2y]
  // 左奇异向量 uᵢ = A·vᵢ/σᵢ；σ→0 时用 u1 的垂向兜底
  const u1 = s1 > 1e-12 ? scale(applyMat2(A, [v1x, v1y]), 1 / s1) : ([1, 0] as Vec2)
  const u2: Vec2 = s2 > 1e-12 ? scale(applyMat2(A, [v2x, v2y]), 1 / s2) : [-u1[1], u1[0]]
  const U: Mat2 = [u1[0], u2[0], u1[1], u2[1]]
  const angleV = Math.atan2(v1y, v1x)
  const angleU = Math.atan2(u1[1], u1[0])
  return { U, S: [s1, s2], V, angleU, angleV }
}

/** 向量数乘 */
function scale(v: Vec2, k: number): Vec2 {
  return [v[0] * k, v[1] * k]
}

/** 用分解结果重建矩阵 A = U·diag(S)·Vᵀ，供测试验证 */
export function reconstruct(U: Mat2, S: Vec2, V: Mat2): Mat2 {
  const sigma: Mat2 = [S[0], 0, 0, S[1]]
  const Vt: Mat2 = [V[0], V[2], V[1], V[3]]
  return matMul(matMul(U, sigma), Vt)
}

/** 秩一最佳逼近 A₁ = σ1·u1·v1ᵀ（Eckart–Young 定理，压缩故事的核心） */
export function rankOneApprox(res: Svd2Result): Mat2 {
  const { U, S, V } = res
  const u1: Vec2 = [U[0], U[2]]
  const v1: Vec2 = [V[0], V[2]]
  const s1 = S[0]
  return [
    s1 * u1[0] * v1[0], s1 * u1[0] * v1[1],
    s1 * u1[1] * v1[0], s1 * u1[1] * v1[1],
  ]
}

/** Frobenius 范数 = √Σaᵢⱼ² = √(σ1²+σ2²) */
export function frobeniusNorm(m: Mat2): number {
  return Math.hypot(m[0], m[1], m[2], m[3])
}

/** 基于奇异值阈值判定矩阵的数值秩 */
export function numericRank(S: Vec2, tol = 1e-9): number {
  return (S[0] > tol ? 1 : 0) + (S[1] > tol ? 1 : 0)
}

/** 条件数 σ1/σ2（衡量矩阵求解的病态程度，σ2=0 时为 ∞） */
export function conditionNumber(S: Vec2): number {
  return S[1] === 0 ? Infinity : S[0] / S[1]
}

export interface MatrixOption {
  id: string
  label: string
  matrix: Mat2
  note: string
}

/** 预设矩阵，覆盖旋转拉伸、剪切、奇异（降秩）等典型情形 */
export const MATRIX_OPTIONS: MatrixOption[] = [
  { id: 'stretch', label: '拉伸', matrix: [2, 0, 0, 1], note: '沿坐标轴拉伸，奇异值 2 和 1' },
  { id: 'shear', label: '剪切', matrix: [1, 0.8, 0, 1], note: '错切变换，主轴发生旋转' },
  { id: 'rotate-scale', label: '旋转+缩放', matrix: [1.2, -0.9, 0.9, 1.2], note: '既转又缩，U、V 都非平凡' },
  { id: 'singular', label: '奇异矩阵', matrix: [2, 1, 4, 2], note: '第二行是第一行 2 倍，σ2=0 降为一维' },
]
