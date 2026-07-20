/**
 * 赠券收集问题核心算法（纯函数，便于测试）
 *
 * 有 n 种不同的赠券，每次随机抽到其中一种（等概率）。
 * 问：集齐全部 n 种，平均需要抽多少次？
 * 答案是 n * H(n)，H(n) 为第 n 个调和数 1 + 1/2 + ... + 1/n。
 * 直觉近似为 n * ln(n)：种类越多，收尾越慢。
 */

/** 第 n 个调和数 H(n) = 1 + 1/2 + ... + 1/n */
export function harmonic(n: number): number {
  let h = 0
  for (let k = 1; k <= n; k++) h += 1 / k
  return h
}

/** 集齐 n 种赠券的期望抽取次数 = n * H(n) */
export function expectedDraws(n: number): number {
  if (n <= 0) return 0
  return n * harmonic(n)
}

/** 用 n * ln(n) 做的粗略近似（种类多时逼近期望） */
export function approxDraws(n: number): number {
  if (n <= 1) return n
  return n * Math.log(n)
}

/**
 * 模拟一次集齐 n 种赠券的过程（带可复现伪随机种子）。
 * 返回每张"新赠券"首次出现时的累计抽取次数，长度为 n。
 * progress[i] = 集齐第 (i+1) 种时，一共抽了多少次。
 */
export function simulate(n: number, seed = 1): number[] {
  let s = seed >>> 0
  const rand = () => {
    // 线性同余伪随机，保证可测试
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const seen = new Array<boolean>(n).fill(false)
  const progress: number[] = []
  let collected = 0
  let draws = 0
  while (collected < n) {
    draws++
    const k = Math.floor(rand() * n)
    if (!seen[k]) {
      seen[k] = true
      collected++
      progress.push(draws)
    }
  }
  return progress
}

/** 集齐 n 种所需的总抽取次数（模拟结果的最后一项） */
export function simulateTotal(n: number, seed = 1): number {
  const p = simulate(n, seed)
  return p.length ? p[p.length - 1] : 0
}

export const COUPON_COUNTS = [6, 12, 24]
