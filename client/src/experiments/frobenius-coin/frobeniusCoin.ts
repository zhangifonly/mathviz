/**
 * Frobenius 硬币问题核心算法（纯函数，便于测试）
 *
 * 给定一组互质的硬币面额，问：哪些非负整数金额可以用这些面额
 * 凑出（每种硬币可用任意多枚）？无法凑出的最大金额就是 Frobenius 数。
 * 用完全背包 DP 标记可凑金额，简单可靠。
 */

/** 两个数的最大公约数 */
export function gcd(a: number, b: number): number {
  while (b !== 0) {
    ;[a, b] = [b, a % b]
  }
  return Math.abs(a)
}

/** 一组数是否两两整体互质（gcd 全体为 1），否则大金额可能永远凑不出 */
export function isCoprime(coins: number[]): boolean {
  return coins.reduce((g, c) => gcd(g, c), 0) === 1
}

/**
 * 用完全背包 DP 标记 0..limit 各金额能否凑出。
 * 返回布尔数组，reach[i] 为 true 表示金额 i 可凑。
 */
export function representable(coins: number[], limit: number): boolean[] {
  const reach = new Array(limit + 1).fill(false)
  reach[0] = true
  const valid = coins.filter((c) => c > 0)
  for (const c of valid) {
    for (let i = c; i <= limit; i++) {
      if (reach[i - c]) reach[i] = true
    }
  }
  return reach
}

/**
 * Frobenius 数：无法凑出的最大金额。
 * 两枚互质硬币 a,b 有闭式公式 a*b - a - b（Chicken McNugget 定理）。
 * 多枚硬币无闭式，用 DP 在足够大范围内找最后一个不可凑金额。
 * 若不互质返回 Infinity（有无穷多金额凑不出）。
 */
export function frobeniusNumber(coins: number[]): number {
  const valid = coins.filter((c) => c > 0)
  if (valid.length === 0 || !isCoprime(valid)) return Infinity
  if (valid.includes(1)) return -1
  if (valid.length === 2) {
    const [a, b] = valid
    return a * b - a - b
  }
  const limit = frobeniusBound(valid)
  const reach = representable(valid, limit)
  for (let i = limit; i >= 0; i--) {
    if (!reach[i]) return i
  }
  return -1
}

/** DP 搜索上界：最小两面额乘积足以覆盖 Frobenius 数 */
export function frobeniusBound(coins: number[]): number {
  const sorted = [...coins].filter((c) => c > 0).sort((x, y) => x - y)
  const a = sorted[0]
  const b = sorted[1] ?? sorted[0]
  return Math.max(a * b, 100)
}

/** 预设面额组合：麦乐鸡数(6,9,20) 等经典例子 */
export const COIN_SETS = [[3, 5], [6, 9, 20]]
