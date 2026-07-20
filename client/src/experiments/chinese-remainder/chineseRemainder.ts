/**
 * 中国剩余定理核心算法（纯函数，便于测试）
 *
 * 求解同余方程组 x ≡ r_i (mod m_i)，要求模两两互质。
 * 用扩展欧几里得算法求模逆元，逐一合并各方程，得到唯一最小非负解。
 * 经典“物不知数”：x≡2(mod3), x≡3(mod5), x≡2(mod7) => 23。
 */

/** 扩展欧几里得：返回 [g, x, y]，满足 a*x + b*y = g = gcd(a,b) */
export function extendedGcd(a: number, b: number): [number, number, number] {
  if (b === 0) return [a, 1, 0]
  const [g, x1, y1] = extendedGcd(b, a % b)
  return [g, y1, x1 - Math.floor(a / b) * y1]
}

/** 模逆元：求 a 在模 m 下的逆元（要求 gcd(a,m)=1），返回 0..m-1 */
export function modInverse(a: number, m: number): number {
  const [g, x] = extendedGcd(((a % m) + m) % m, m)
  if (g !== 1) throw new Error('模逆元不存在：a 与 m 不互质')
  return ((x % m) + m) % m
}

/** 两两互质校验 */
export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b)
}

export interface CrtResult {
  x: number // 最小非负解
  M: number // 所有模的乘积（解的周期）
}

/**
 * 中国剩余定理求解。remainders 与 moduli 一一对应，模需两两互质。
 * 返回最小非负解 x 与周期 M。
 */
export function crt(remainders: number[], moduli: number[]): CrtResult {
  if (remainders.length !== moduli.length || moduli.length === 0) {
    throw new Error('余数与模数量必须相等且非空')
  }
  for (let i = 0; i < moduli.length; i++) {
    for (let j = i + 1; j < moduli.length; j++) {
      if (gcd(moduli[i], moduli[j]) !== 1) {
        throw new Error('模必须两两互质')
      }
    }
  }
  const M = moduli.reduce((a, b) => a * b, 1)
  let x = 0
  for (let i = 0; i < moduli.length; i++) {
    const Mi = M / moduli[i]
    const ti = modInverse(Mi, moduli[i])
    x += remainders[i] * Mi * ti
  }
  return { x: ((x % M) + M) % M, M }
}

/** 校验某个候选值是否满足全部同余条件 */
export function satisfies(x: number, remainders: number[], moduli: number[]): boolean {
  return moduli.every((m, i) => ((x % m) + m) % m === ((remainders[i] % m) + m) % m)
}

// 经典样例：物不知数及其变体
export const SAMPLES: { name: string; remainders: number[]; moduli: number[] }[] = [
  { name: '物不知数', remainders: [2, 3, 2], moduli: [3, 5, 7] },
  { name: '韩信点兵', remainders: [1, 5, 4], moduli: [3, 5, 7] },
  { name: '双模示例', remainders: [1, 2], moduli: [4, 9] },
]
