/**
 * 原根核心算法（纯函数，便于测试）
 *
 * 模 p（p 为素数）的既约剩余系 {1, 2, ..., p-1} 在乘法下构成循环群。
 * 若 g 的幂 g^0, g^1, ... 模 p 能遍历全部 p-1 个非零余数，则 g 是模 p 的原根。
 * 原根即这个乘法循环群的生成元。
 */

/** 计算 g^k mod p（快速幂，防溢出） */
export function powMod(g: number, k: number, p: number): number {
  let result = 1
  let base = g % p
  let e = k
  while (e > 0) {
    if (e & 1) result = (result * base) % p
    base = (base * base) % p
    e = Math.floor(e / 2)
  }
  return result
}

/**
 * 返回 g 的幂模 p 序列 [g^0, g^1, ..., g^(p-2)]（长度 p-1）。
 * 这是 g 在圆环上跳跃访问到的余数顺序。
 */
export function powerCycle(g: number, p: number): number[] {
  const seq: number[] = []
  let cur = 1 % p
  for (let i = 0; i < p - 1; i++) {
    seq.push(cur)
    cur = (cur * g) % p
  }
  return seq
}

/** 判断 g 是否为模 p 的原根：幂序列须遍历全部 1..p-1（无重复） */
export function isPrimitiveRoot(g: number, p: number): boolean {
  if (g % p === 0) return false
  const seen = new Set<number>()
  let cur = 1 % p
  for (let i = 0; i < p - 1; i++) {
    if (seen.has(cur)) return false
    seen.add(cur)
    cur = (cur * g) % p
  }
  return seen.size === p - 1
}

/** 找出模 p 的全部原根（升序） */
export function findPrimitiveRoots(p: number): number[] {
  const roots: number[] = []
  for (let g = 2; g < p; g++) {
    if (isPrimitiveRoot(g, p)) roots.push(g)
  }
  return roots
}

/** 幂序列覆盖到的不同余数个数（原根覆盖 p-1，非原根覆盖子群阶） */
export function orbitSize(g: number, p: number): number {
  return new Set(powerCycle(g, p)).size
}

export const PRIMES = [7, 11, 13]
