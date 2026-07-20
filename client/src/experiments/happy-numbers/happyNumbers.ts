/**
 * 快乐数核心算法（纯函数，便于测试）
 *
 * 快乐数定义：从一个正整数出发，反复用"各位数字平方和"替换它，
 * 若最终能到达 1，则称为快乐数；否则会陷入一个不含 1 的循环。
 * 不快乐的数最终一定进入固定的 8 数循环：
 * 4 -> 16 -> 37 -> 58 -> 89 -> 145 -> 42 -> 20 -> 4。
 */

/** 计算一个数各位数字的平方和，即迭代的下一步 */
export function nextHappy(n: number): number {
  let sum = 0
  let x = Math.abs(Math.trunc(n))
  while (x > 0) {
    const d = x % 10
    sum += d * d
    x = Math.floor(x / 10)
  }
  return sum
}

/**
 * 返回从 n 出发的迭代链，直到到达 1（快乐）或再次遇到已出现的值（进入循环）。
 * 链首为 n，链尾为 1 或循环入口（重复出现的那个值本身只出现一次）。
 */
export function happyChain(n: number): number[] {
  const chain: number[] = []
  const seen = new Set<number>()
  let x = Math.abs(Math.trunc(n))
  if (x === 0) x = 0
  while (x !== 1 && !seen.has(x)) {
    chain.push(x)
    seen.add(x)
    x = nextHappy(x)
  }
  chain.push(x) // 收尾：1 或已出现过的循环入口
  return chain
}

/** 判断 n 是否为快乐数 */
export function isHappy(n: number): boolean {
  const seen = new Set<number>()
  let x = Math.abs(Math.trunc(n))
  while (x !== 1 && !seen.has(x)) {
    seen.add(x)
    x = nextHappy(x)
  }
  return x === 1
}

/** 统计 1..n 范围内的快乐数个数 */
export function countHappy(n: number): number {
  let c = 0
  for (let i = 1; i <= n; i++) if (isHappy(i)) c++
  return c
}

/** 供交互演示的示例数（含快乐数与不快乐数） */
export const SAMPLES = [7, 19, 23, 28, 44, 82, 100]

/** 分布网格可选的展示范围 */
export const RANGE = [50, 100, 150]

/** 不快乐数一定进入的 8 数循环 */
export const SAD_CYCLE = [4, 16, 37, 58, 89, 145, 42, 20]
