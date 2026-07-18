/**
 * ε-δ 极限定义核心算法（纯函数，便于测试）
 *
 * 极限 lim(x→a) f(x) = L 的严格含义：
 * 对任意 ε>0，都存在 δ>0，使得当 0<|x-a|<δ 时，恒有 |f(x)-L|<ε。
 *
 * findDelta 对给定的 ε 数值搜索一个可行的 δ：从 a 向两侧逐步扩张，
 * 找到最近的"违规点"（|f(x)-L| 达到 ε 的位置），δ 取其之内的安全距离。
 * ε 越小，可行的 δ 也越小，这正是极限定义的精髓。
 */

export interface LimitFunction {
  id: string
  label: string
  fn: (x: number) => number
  a: number
  L: number
}

export const FUNCTIONS: LimitFunction[] = [
  { id: 'linear', label: 'f(x) = 2x + 1', fn: (x) => 2 * x + 1, a: 1, L: 3 },
  { id: 'square', label: 'f(x) = x²', fn: (x) => x * x, a: 2, L: 4 },
  { id: 'cubic', label: 'f(x) = x³', fn: (x) => x * x * x, a: 1, L: 1 },
]

/** 默认极限点与极限值（取第一个函数） */
export const a = FUNCTIONS[0].a
export const L = FUNCTIONS[0].L

/**
 * 数值搜索可行的 δ：使得 0<|x-a|<δ 时 |f(x)-L|<eps。
 * 从 a 向两侧以 maxDelta/resolution 为步长扩张，遇到首个违规点即停。
 * @returns 最大可行 δ（若在 maxDelta 内无违规则返回 maxDelta）
 */
export function findDelta(
  fn: (x: number) => number,
  aPoint: number,
  limit: number,
  eps: number,
  maxDelta = 2,
  resolution = 2000,
): number {
  if (eps <= 0) return 0
  const stepSize = maxDelta / resolution
  for (let i = 1; i <= resolution; i++) {
    const d = i * stepSize
    const right = Math.abs(fn(aPoint + d) - limit)
    const left = Math.abs(fn(aPoint - d) - limit)
    if (right >= eps || left >= eps) {
      // 违规发生在距离 d 处，安全 δ 取上一步
      return Math.max(d - stepSize, 0)
    }
  }
  return maxDelta
}

/** 判断某点 x 是否落在容差带内（|f(x)-L|<eps） */
export function withinEpsilon(
  fn: (x: number) => number,
  limit: number,
  eps: number,
  x: number,
): boolean {
  return Math.abs(fn(x) - limit) < eps
}

/** 可选的 ε 档位，从大到小，用于交互演示 δ 收缩 */
export const EPSILONS = [1, 0.5, 0.25, 0.1]
