/**
 * 勾股数核心算法（纯函数，便于测试）
 *
 * 勾股数是满足 a²+b²=c² 的正整数三元组 (a,b,c)。
 * 本原勾股数由欧几里得公式生成：取整数 m>n>0，
 *   a = m²-n²,  b = 2mn,  c = m²+n²
 * 当 m,n 互质且一奇一偶时，(a,b,c) 就是本原勾股数（gcd=1）。
 */

export interface Triple {
  a: number
  b: number
  c: number
  m: number
  n: number
  primitive: boolean
}

/** 最大公约数（辗转相除） */
export function gcd(x: number, y: number): number {
  while (y !== 0) {
    const t = y
    y = x % y
    x = t
  }
  return Math.abs(x)
}

/** 判断三元组是否满足 a²+b²=c² */
export function isPythagorean(a: number, b: number, c: number): boolean {
  return a > 0 && b > 0 && c > 0 && a * a + b * b === c * c
}

/** 用欧几里得公式由 (m,n) 生成一个勾股数（不判互质，仅套公式） */
export function tripleFrom(m: number, n: number): Triple {
  const a = m * m - n * n
  const b = 2 * m * n
  const c = m * m + n * n
  const primitive = gcd(m, n) === 1 && (m - n) % 2 === 1
  return { a: Math.min(a, b), b: Math.max(a, b), c, m, n, primitive }
}

/**
 * 生成所有斜边 c ≤ limit 的本原勾股数。
 * 条件：m>n>0，m,n 互质，且 m-n 为奇数（保证一奇一偶）。
 */
export function primitiveTriples(limit: number): Triple[] {
  const out: Triple[] = []
  for (let m = 2; m * m + 1 <= limit; m++) {
    for (let n = 1; n < m; n++) {
      if ((m - n) % 2 !== 1) continue
      if (gcd(m, n) !== 1) continue
      const t = tripleFrom(m, n)
      if (t.c <= limit) out.push(t)
    }
  }
  return out.sort((p, q) => p.c - q.c || p.a - q.a)
}

export const LIMIT = 120
export const LIMIT_OPTIONS = [60, 120, 220]
