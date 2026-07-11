/**
 * 拉格朗日乘数法（纯函数数学内核，无 DOM）
 *
 * 在约束 g(x,y)=0 下求目标 f(x,y) 的极值。
 * 关键结论：极值点处 ∇f 与 ∇g 平行，即存在乘数 λ 使 ∇f = λ·∇g。
 *
 * 本内核聚焦一族可解析验证的问题：
 *   目标 f(x,y) = a·x + b·y（线性）
 *   约束 x² + y² = r²（半径 r 的圆）
 * 解析解：最大值点沿梯度方向 (a,b)，
 *   (x*, y*) = r·(a,b)/n，n=√(a²+b²)，最大值 = r·n。
 */

export type Vec2 = [number, number]

/** 线性目标函数 f(x,y)=a·x+b·y */
export function objective(a: number, b: number, x: number, y: number): number {
  return a * x + b * y
}

/** 目标梯度 ∇f = (a, b)，与位置无关 */
export function gradObjective(a: number, b: number): Vec2 {
  return [a, b]
}

/** 圆约束 g(x,y)=x²+y²−r²（=0 时点在圆上） */
export function constraint(x: number, y: number, r: number): number {
  return x * x + y * y - r * r
}

/** 约束梯度 ∇g = (2x, 2y)，指向圆的外法线方向 */
export function gradConstraint(x: number, y: number): Vec2 {
  return [2 * x, 2 * y]
}

/** 二维叉积标量 v1×v2 = v1x·v2y − v1y·v2x；结果为 0 表示两向量平行 */
export function cross(v1: Vec2, v2: Vec2): number {
  return v1[0] * v2[1] - v1[1] * v2[0]
}

/** 向量模长 */
export function norm(v: Vec2): number {
  return Math.hypot(v[0], v[1])
}

export interface LagrangeSolution {
  x: number
  y: number
  lambda: number
  value: number
  angle: number // 解点在圆上的极角（弧度）
}

/**
 * 解析求解：在圆 x²+y²=r² 上求 f=a·x+b·y 的极值。
 * @param kind 'max' 求最大值点，'min' 求最小值点
 */
export function solveCircle(
  a: number,
  b: number,
  r: number,
  kind: 'max' | 'min' = 'max',
): LagrangeSolution {
  const n = Math.hypot(a, b)
  const sign = kind === 'max' ? 1 : -1
  if (n === 0) {
    // 目标为常数，圆上处处相等，约定取角 0
    return { x: r, y: 0, lambda: 0, value: 0, angle: 0 }
  }
  const x = (sign * r * a) / n
  const y = (sign * r * b) / n
  const angle = Math.atan2(y, x)
  const value = objective(a, b, x, y) // = sign·r·n
  const lambda = (sign * n) / (2 * r) // 由 ∇f = λ·∇g 解出
  return { x, y, lambda, value, angle }
}

/** 沿圆采样目标值：f(r cosθ, r sinθ) = r·n·cos(θ−φ)，用于绘制与数值验证 */
export function objectiveOnCircle(a: number, b: number, r: number, theta: number): number {
  return objective(a, b, r * Math.cos(theta), r * Math.sin(theta))
}

export interface LagrangeProblem {
  id: string
  label: string
  a: number
  b: number
  r: number
  note: string
}

export const LAGRANGE_PROBLEMS: LagrangeProblem[] = [
  { id: 'east', label: 'f = x', a: 1, b: 0, r: 1, note: '梯度指向 x 正向，最远点在 (r, 0)' },
  { id: 'diag', label: 'f = x + y', a: 1, b: 1, r: 1, note: '梯度沿对角线，解在圆与 y=x 的交点' },
  { id: 'tilt', label: 'f = x + 2y', a: 1, b: 2, r: 1.2, note: '梯度偏向 y 轴，最大值等于 r 乘根号五' },
]
