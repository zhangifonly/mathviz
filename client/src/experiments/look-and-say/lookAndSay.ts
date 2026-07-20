/**
 * 外观数列（Look-and-say）核心算法（纯函数，便于测试）
 *
 * 规则：读出上一项的数字串。把连续相同的数字按"个数+数字"读出。
 * 例如 "1" -> "11"（一个1）-> "21"（两个1）-> "1211"（一个2一个1）...
 * 相邻两项长度之比趋于康威常数 λ ≈ 1.303577。
 */

// 康威常数（相邻项长度比的极限）
export const CONWAY_CONSTANT = 1.303577269

/** 读出一个数字串：把连续游程按"个数+数字"输出 */
export function lookAndSaySay(s: string): string {
  let out = ''
  let i = 0
  while (i < s.length) {
    const ch = s[i]
    let count = 1
    while (i + count < s.length && s[i + count] === ch) count++
    out += String(count) + ch
    i += count
  }
  return out
}

/** 前 n 项数列，从起始种子 seed（默认 "1"）开始 */
export function sequence(n: number, seed = '1'): string[] {
  const terms: string[] = []
  let cur = seed
  for (let i = 0; i < n; i++) {
    terms.push(cur)
    cur = lookAndSaySay(cur)
  }
  return terms
}

/** 相邻项长度比 length(a[i+1]) / length(a[i]) */
export function lengthRatio(terms: string[]): number[] {
  const ratios: number[] = []
  for (let i = 0; i + 1 < terms.length; i++) {
    ratios.push(terms[i + 1].length / terms[i].length)
  }
  return ratios
}

// 展示前 8 项
export const TERMS = 8
