/**
 * 托马斯吸引子（纯函数，便于测试）
 *
 *   dx/dt = sin y − b·x
 *   dy/dt = sin z − b·y
 *   dz/dt = sin x − b·z
 *
 * 由 René Thomas 提出，是「循环对称反馈系统」的代表：
 * 每个变量被下一个变量的正弦驱动，同时受自身的线性阻尼 b 拖住。
 *
 * 阻尼参数 b 控制着一条完整的过渡路径：
 *   b > 1     所有轨道收敛到原点（不动点）
 *   b ≈ 0.32  出现极限环
 *   b ≈ 0.2   混沌，吸引子呈缠绕的管状结构
 *   b → 0     阻尼消失，轨道趋于遍历整个空间
 *
 * 三条可验证性质：
 *   1. **循环对称**：(x,y,z) → (y,z,x) 保持方程组不变
 *   2. **散度恒为 −3b**：三个线性阻尼项各贡献 −b
 *   3. **原点是平衡点**：sin 0 = 0，三个方程都归零
 */

import type { Vec3 } from '../../lib/proj3d'
import type { Field3D } from '../../lib/attractor3d'

/** 标准参数，给出混沌吸引子 */
export const DEFAULT_B = 0.208186

/** 构造向量场 */
export function thomasField(b = DEFAULT_B): Field3D {
  return ([x, y, z]) => [
    Math.sin(y) - b * x,
    Math.sin(z) - b * y,
    Math.sin(x) - b * z,
  ]
}

/** 循环对称检验：f(σp) 应等于 σ(f(p)) */
export function cyclicSymmetryError(p: Vec3, b = DEFAULT_B): number {
  const f = thomasField(b)
  const lhs = f([p[1], p[2], p[0]])
  const r = f(p)
  return Math.max(
    Math.abs(lhs[0] - r[1]),
    Math.abs(lhs[1] - r[2]),
    Math.abs(lhs[2] - r[0]),
  )
}

/** 散度的解析值 −3b */
export function analyticDivergence(b = DEFAULT_B): number {
  return -3 * b
}

/** 原点恒为平衡点 */
export function originResidual(b = DEFAULT_B): number {
  const d = thomasField(b)([0, 0, 0])
  return Math.hypot(d[0], d[1], d[2])
}

/**
 * 对角线上的其他平衡点：x=y=z 时方程退化为 sin x = b·x。
 * b<1 时除原点外还有解，数值求根找出对角线上的第一个正根。
 */
export function diagonalRoot(b = DEFAULT_B): number {
  if (b >= 1) return 0
  // sin x = b·x 的第一个正根落在 (π/2, π) 区间内(b 小时接近 π)
  let lo = 1e-6
  let hi = Math.PI
  const g = (x: number) => Math.sin(x) - b * x
  // g(小正数)>0, g(π)=-bπ<0, 故区间内必有根
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2
    if (g(m) > 0) lo = m
    else hi = m
  }
  return (lo + hi) / 2
}

/** 轨道被限制在 |x| ≤ 1/b 的立方体内：sin 有界于 1，故平衡时 b|x| ≤ 1 */
export function boundEstimate(b = DEFAULT_B): number {
  return 1 / b
}

export const START: Vec3 = [1.1, 1.1, -0.01]

export const PRESETS = [
  { b: 0.5, label: '收敛到不动点', note: 'b=0.5 · 阻尼强' },
  { b: 0.32, label: '极限环', note: 'b=0.32 · 周期轨道' },
  { b: 0.208186, label: '混沌', note: 'b=0.208 · 缠绕管状' },
  { b: 0.1, label: '强混沌', note: 'b=0.1 · 范围更大' },
] as const
