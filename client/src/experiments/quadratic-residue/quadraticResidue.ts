/**
 * 二次剩余核心算法（纯函数，便于测试）
 *
 * 对素数 p，若同余方程 x^2 ≡ a (mod p) 有解，则称 a 是模 p 的二次剩余(QR)。
 * 这里给出：全部非零二次剩余集合、勒让德符号（欧拉判别法）、以及单点判定。
 */

/** 快速幂取模：base^exp mod m */
export function powMod(base: number, exp: number, m: number): number {
  let result = 1
  let b = base % m
  let e = exp
  while (e > 0) {
    if (e & 1) result = (result * b) % m
    b = (b * b) % m
    e = Math.floor(e / 2)
  }
  return result
}

/**
 * 返回模 p 的所有非零二次剩余，即 { x^2 mod p | x = 1..p-1 } 去重升序。
 * 对奇素数 p，恰好有 (p-1)/2 个非零二次剩余。
 */
export function quadraticResidues(p: number): number[] {
  const set = new Set<number>()
  for (let x = 1; x < p; x++) {
    set.add((x * x) % p)
  }
  return Array.from(set).sort((a, b) => a - b)
}

/**
 * 勒让德符号 (a/p)，用欧拉判别法 a^((p-1)/2) mod p 计算。
 * 返回 0（p 整除 a）、1（a 是二次剩余）、-1（a 是二次非剩余）。
 */
export function legendreSymbol(a: number, p: number): number {
  const r = a % p
  if (r === 0) return 0
  const e = powMod(r, (p - 1) / 2, p)
  return e === 1 ? 1 : -1
}

/** 判定 a 是否为模 p 的二次剩余（含 0 视为剩余，因 0^2=0）。 */
export function isQR(a: number, p: number): boolean {
  const r = ((a % p) + p) % p
  if (r === 0) return true
  return legendreSymbol(r, p) === 1
}

/**
 * 配对信息：x 与 p-x 平方相同，映射到同一个二次剩余。
 * 返回 x（1..p-1）到其平方值的数组，便于绘制配对连线。
 */
export function squarePairs(p: number): { x: number; sq: number }[] {
  const pairs: { x: number; sq: number }[] = []
  for (let x = 1; x < p; x++) {
    pairs.push({ x, sq: (x * x) % p })
  }
  return pairs
}

/** 可选素数模数。 */
export const PRIMES = [7, 11, 13, 17]
