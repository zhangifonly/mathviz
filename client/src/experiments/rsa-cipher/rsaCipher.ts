/**
 * RSA 加密核心算法（教学版，纯函数便于测试）
 *
 * 用小素数演示公钥密码：
 *   n = p*q, φ = (p-1)(q-1), 选 e 与 φ 互质, d = e 关于 φ 的模逆,
 *   加密 c = m^e mod n, 解密 m = c^d mod n。
 * 全部用 BigInt 保证正确性，快速幂 + 扩展欧几里得求逆。
 */

/** 可选小素数对（p, q），数字足够小让密钥可读 */
export const SAMPLE_PRIMES: [number, number][] = [
  [61, 53],
  [17, 11],
  [47, 71],
  [101, 103],
]

/** 最大公约数（欧几里得算法） */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/**
 * 扩展欧几里得：返回 [g, x, y] 使 a*x + b*y = g = gcd(a,b)
 */
export function extendedGcd(a: number, b: number): [number, number, number] {
  if (b === 0) return [a, 1, 0]
  const [g, x1, y1] = extendedGcd(b, a % b)
  return [g, y1, x1 - Math.floor(a / b) * y1]
}

/** 求 e 关于模 m 的乘法逆元 d，使 (e*d) mod m = 1 */
export function modInverse(e: number, m: number): number {
  const [g, x] = extendedGcd(e, m)
  if (g !== 1) throw new Error('e 与模数不互质，无逆元')
  return ((x % m) + m) % m
}

/** 快速幂取模：base^exp mod mod（BigInt 防溢出） */
export function modPow(base: number, exp: number, mod: number): number {
  let result = 1n
  let b = BigInt(base) % BigInt(mod)
  let e = BigInt(exp)
  const m = BigInt(mod)
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m
    b = (b * b) % m
    e >>= 1n
  }
  return Number(result)
}

export interface RsaKeys {
  p: number
  q: number
  n: number
  phi: number
  e: number
  d: number
}

/** 挑一个与 φ 互质的公钥指数 e（优先常用的 65537 或 17，否则线性搜索） */
export function chooseE(phi: number): number {
  for (const cand of [65537, 17, 7, 5, 3]) {
    if (cand < phi && gcd(cand, phi) === 1) return cand
  }
  for (let e = 3; e < phi; e += 2) {
    if (gcd(e, phi) === 1) return e
  }
  throw new Error('找不到合法的 e')
}

/** 由素数对生成完整 RSA 密钥 */
export function generateKeys(p: number, q: number): RsaKeys {
  const n = p * q
  const phi = (p - 1) * (q - 1)
  const e = chooseE(phi)
  const d = modInverse(e, phi)
  return { p, q, n, phi, e, d }
}

/** 加密单个数字消息 m（需 0 <= m < n） */
export function encrypt(m: number, keys: RsaKeys): number {
  return modPow(m, keys.e, keys.n)
}

/** 解密密文 c */
export function decrypt(c: number, keys: RsaKeys): number {
  return modPow(c, keys.d, keys.n)
}
