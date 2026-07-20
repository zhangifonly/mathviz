/**
 * 卢卡斯数核心算法（纯函数，便于测试）
 *
 * 卢卡斯数列与斐波那契同用递推 a(n)=a(n-1)+a(n-2)，
 * 但初值不同：L0=2, L1=1。数列为 2,1,3,4,7,11,18,29,47,...
 * 相邻项之比同样趋于黄金比 φ≈1.6180339887。
 * 与斐波那契有优美关系：L(n) = F(n-1) + F(n+1)。
 */

export const PHI = (1 + Math.sqrt(5)) / 2

/** 返回前 n 项卢卡斯数 L0..L(n-1)（BigInt 精度无溢出） */
export function lucasSequence(n: number): number[] {
  if (n <= 0) return []
  const out: number[] = [2]
  if (n === 1) return out
  out.push(1)
  for (let i = 2; i < n; i++) {
    out.push(out[i - 1] + out[i - 2])
  }
  return out
}

/** 第 n 个卢卡斯数 L(n)，L0=2, L1=1 */
export function lucas(n: number): number {
  if (n < 0) return NaN
  let a = 2
  let b = 1
  if (n === 0) return a
  for (let i = 2; i <= n; i++) {
    const c = a + b
    a = b
    b = c
  }
  return b
}

/** 前 n 项斐波那契 F0..F(n-1)，F0=0, F1=1 */
export function fibonacciSequence(n: number): number[] {
  if (n <= 0) return []
  const out: number[] = [0]
  if (n === 1) return out
  out.push(1)
  for (let i = 2; i < n; i++) {
    out.push(out[i - 1] + out[i - 2])
  }
  return out
}

/** 相邻项之比 L(n+1)/L(n)，长度为 seq.length-1 */
export function ratios(seq: number[]): number[] {
  const out: number[] = []
  for (let i = 1; i < seq.length; i++) {
    if (seq[i - 1] !== 0) out.push(seq[i] / seq[i - 1])
  }
  return out
}

/** 第 k 个斐波那契数 F(k)，F0=0, F1=1 */
export function fibonacci(k: number): number {
  if (k < 0) return NaN
  let a = 0
  let b = 1
  if (k === 0) return 0
  for (let i = 2; i <= k; i++) {
    const c = a + b
    a = b
    b = c
  }
  return b
}

/** 由斐波那契恒等式给出 L(n) = F(n-1) + F(n+1)（n>=1） */
export function lucasFromFib(n: number): number {
  return fibonacci(n - 1) + fibonacci(n + 1)
}

export const TERMS = [8, 12, 16]
