/**
 * 容斥原理核心算法（纯函数，便于测试）
 *
 * 若直接把各集合大小相加，重叠部分会被重复计数。
 * 容斥原理用"加单个 - 减两两交 + 加三三交 - ..."交替修正，
 * 精确算出并集大小。这里同时提供通用集合版与整除具体例。
 */

export interface IEXTerm {
  subset: number[] // 参与交集的集合下标
  size: number // 该交集的元素个数
  sign: number // 容斥符号：+1 或 -1
}

/** 1..N 中能被 d 整除的数 */
export function multiplesUpTo(n: number, d: number): number[] {
  const out: number[] = []
  for (let k = d; k <= n; k += d) out.push(k)
  return out
}

/** 给定若干集合的下标子集，求这些集合的交集大小 */
export function intersectionSize(sets: number[][], subset: number[]): number {
  if (subset.length === 0) return 0
  const base = new Set(sets[subset[0]])
  for (let i = 1; i < subset.length; i++) {
    const other = new Set(sets[subset[i]])
    for (const v of base) if (!other.has(v)) base.delete(v)
  }
  return base.size
}

/** 枚举全部非空子集（下标） */
export function allSubsets(m: number): number[][] {
  const res: number[][] = []
  for (let mask = 1; mask < 1 << m; mask++) {
    const s: number[] = []
    for (let i = 0; i < m; i++) if (mask & (1 << i)) s.push(i)
    res.push(s)
  }
  return res
}

/** 容斥原理逐项：符号 = (-1)^(|子集|+1) */
export function iexTerms(sets: number[][]): IEXTerm[] {
  return allSubsets(sets.length).map((subset) => ({
    subset,
    size: intersectionSize(sets, subset),
    sign: subset.length % 2 === 1 ? 1 : -1,
  }))
}

/** 用容斥公式求并集大小（加减交替累加各项） */
export function unionSizeIE(sets: number[][]): number {
  return iexTerms(sets).reduce((acc, t) => acc + t.sign * t.size, 0)
}

/** 直接构造并集求大小（用于交叉验证容斥结果） */
export function unionSizeDirect(sets: number[][]): number {
  const u = new Set<number>()
  for (const s of sets) for (const v of s) u.add(v)
  return u.size
}

/** 三集合韦恩图的 7 个互斥区域元素个数 */
export function vennRegions(sets: number[][]): number[] {
  const s = (sub: number[]) => intersectionSize(sets, sub)
  const abc = s([0, 1, 2])
  const ab = s([0, 1]) - abc
  const ac = s([0, 2]) - abc
  const bc = s([1, 2]) - abc
  const a = sets[0].length - ab - ac - abc
  const b = sets[1].length - ab - bc - abc
  const c = sets[2].length - ac - bc - abc
  // 顺序：仅A, 仅B, 仅C, A∩B, A∩C, B∩C, A∩B∩C
  return [a, b, c, ab, ac, bc, abc]
}

/** 具体例：1..N 中能被 divisors 各数整除的数（用于展示容斥） */
export function divisibleSets(n: number, divisors: number[]): number[][] {
  return divisors.map((d) => multiplesUpTo(n, d))
}

export interface Sample {
  n: number
  divisors: number[]
  labels: string[]
}

export const SAMPLES: Sample[] = [
  { n: 30, divisors: [2, 3, 5], labels: ['被2整除', '被3整除', '被5整除'] },
  { n: 60, divisors: [2, 3, 5], labels: ['被2整除', '被3整除', '被5整除'] },
  { n: 100, divisors: [2, 3, 5], labels: ['被2整除', '被3整除', '被5整除'] },
]
