/**
 * 错排问题核心算法（纯函数，便于测试）
 *
 * 错排（Derangement）：n 个元素的排列中，没有任何一个元素在原来的位置。
 * 经典模型：n 封信装进 n 个信封，每封信都装错。
 *
 * 错排数 D(n) 满足递推：D(n) = (n-1) * (D(n-1) + D(n-2))
 * 边界：D(0) = 1, D(1) = 0。
 * 且比值 D(n)/n! 随 n 增大迅速趋于 1/e ≈ 0.3679。
 */

/** 计算错排数 D(n)（递推，返回精确整数直到 double 精度上限） */
export function derangement(n: number): number {
  if (n < 0) return 0
  if (n === 0) return 1
  if (n === 1) return 0
  let prev = 1 // D(0)
  let cur = 0 // D(1)
  for (let k = 2; k <= n; k++) {
    const next = (k - 1) * (cur + prev)
    prev = cur
    cur = next
  }
  return cur
}

/** 阶乘 n! */
export function factorial(n: number): number {
  let f = 1
  for (let k = 2; k <= n; k++) f *= k
  return f
}

/** 比值 D(n)/n!，理论上趋于 1/e */
export function derangementRatio(n: number): number {
  if (n === 0) return 1
  return derangement(n) / factorial(n)
}

/** 一个排列是否为错排（perm[i] !== i 对所有 i 成立） */
export function isDerangement(perm: number[]): boolean {
  for (let i = 0; i < perm.length; i++) {
    if (perm[i] === i) return false
  }
  return true
}

/** 枚举 0..n-1 的所有错排（回溯，n 较小时使用） */
export function listDerangements(n: number): number[][] {
  const result: number[][] = []
  const perm: number[] = []
  const used: boolean[] = new Array(n).fill(false)
  const backtrack = (pos: number) => {
    if (pos === n) {
      result.push([...perm])
      return
    }
    for (let v = 0; v < n; v++) {
      if (used[v] || v === pos) continue
      used[v] = true
      perm[pos] = v
      backtrack(pos + 1)
      used[v] = false
    }
  }
  backtrack(0)
  return result
}

/** 1/e，比值的理论极限 */
export const INV_E = 1 / Math.E

/** 可选的元素数量档位 */
export const N_VALUES = [4, 5, 6, 7]
