/**
 * 威尔逊定理核心算法（纯函数，便于测试）
 *
 * 威尔逊定理：整数 n > 1 是素数，当且仅当 (n-1)! ≡ -1 (mod n)。
 * 其中 -1 (mod n) 即 n-1。合数 n（除 n=4 外）多半有 (n-1)! ≡ 0。
 *
 * 直接算 (n-1)! 会迅速溢出，所以边乘边取模，全程保持在 [0, n) 内。
 */

/** 计算 k! mod n，逐步取模避免大数溢出 */
export function factorialMod(k: number, n: number): number {
  if (n <= 1) return 0
  let acc = 1 % n
  for (let i = 2; i <= k; i++) {
    acc = (acc * i) % n
  }
  return acc
}

/** 朴素素性判定，用作威尔逊判据的对照标准 */
export function isPrime(n: number): boolean {
  if (n < 2) return false
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) return false
  }
  return true
}

/** 威尔逊判据：返回 (n-1)! mod n 是否等于 n-1，即 ≡ -1 (mod n) */
export function wilsonCheck(n: number): boolean {
  if (n < 2) return false
  return factorialMod(n - 1, n) === n - 1
}

export interface WilsonRow {
  n: number
  value: number // (n-1)! mod n
  prime: boolean // wilsonCheck(n)
}

/** 生成 2..N 每个 n 的 (n-1)! mod n 及素性 */
export function wilsonTable(upTo: number): WilsonRow[] {
  const rows: WilsonRow[] = []
  for (let n = 2; n <= upTo; n++) {
    rows.push({ n, value: factorialMod(n - 1, n), prime: wilsonCheck(n) })
  }
  return rows
}

export const RANGE = [15, 25, 40]
