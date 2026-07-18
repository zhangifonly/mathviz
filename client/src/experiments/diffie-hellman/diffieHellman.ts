/**
 * 迪菲-赫尔曼密钥交换核心算法（纯函数，便于测试）
 *
 * 公开素数 p 与原根 g；Alice 私钥 a 算 A = g^a mod p；
 * Bob 私钥 b 算 B = g^b mod p；双方共享密钥 = B^a = A^b = g^(ab) mod p。
 * 窃听者只能看到公开的 p、g、A、B，却难以反推出 a、b。
 */

/** 快速幂取模：计算 (base^exp) mod mod，避免大数溢出 */
export function modPow(base: number, exp: number, mod: number): number {
  if (mod === 1) return 0
  let result = 1
  let b = base % mod
  let e = exp
  while (e > 0) {
    if (e & 1) result = (result * b) % mod
    b = (b * b) % mod
    e = Math.floor(e / 2)
  }
  return result
}

/** 计算某一方的公开值：g^priv mod p */
export function computePublic(g: number, priv: number, p: number): number {
  return modPow(g, priv, p)
}

/** 用对方公开值和自己私钥计算共享密钥：other^priv mod p */
export function computeShared(other: number, priv: number, p: number): number {
  return modPow(other, priv, p)
}

export interface DHResult {
  A: number         // Alice 公开值
  B: number         // Bob 公开值
  sharedAlice: number // Alice 算出的共享密钥
  sharedBob: number   // Bob 算出的共享密钥
  agree: boolean      // 两边是否一致
}

/** 完成一次完整的 DH 交换 */
export function dhExchange(p: number, g: number, a: number, b: number): DHResult {
  const A = computePublic(g, a, p)
  const B = computePublic(g, b, p)
  const sharedAlice = computeShared(B, a, p)
  const sharedBob = computeShared(A, b, p)
  return { A, B, sharedAlice, sharedBob, agree: sharedAlice === sharedBob }
}

/** 公开参数示例：p 为素数，g 为其原根 */
export const SAMPLE = { p: 23, g: 5 }

/** 可选私钥候选，供交互切换 */
export const PRIVATE_KEYS = [3, 4, 6, 7, 9]
