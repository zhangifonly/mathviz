/**
 * 组合恒等式（纯函数数学内核，无 DOM）
 *
 * 用「数格子」的组合思想证明几个经典二项式恒等式：
 *  - 求和恒等式：C(n,0)+C(n,1)+...+C(n,n) = 2^n（子集计数）
 *  - 对称恒等式：C(n,k) = C(n,n-k)（选 k 个 = 剔除 n-k 个）
 *  - 帕斯卡法则：C(n,k) = C(n-1,k-1) + C(n-1,k)（含/不含某元素）
 *  - 曲棍球棒恒等式：sum_{i=r}^{n} C(i,r) = C(n+1,r+1)
 */

/** 二项式系数 C(n,k)。用乘法递推保持整数，越界返回 0。 */
export function binomial(n: number, k: number): number {
  if (k < 0 || k > n || n < 0) return 0
  if (k === 0 || k === n) return 1
  const kk = Math.min(k, n - k)
  let result = 1
  for (let i = 0; i < kk; i++) {
    result = (result * (n - i)) / (i + 1)
  }
  return Math.round(result)
}

/** 帕斯卡三角第 n 行：[C(n,0), C(n,1), ..., C(n,n)] */
export function binomialRow(n: number): number[] {
  const row: number[] = []
  for (let k = 0; k <= n; k++) row.push(binomial(n, k))
  return row
}

/** 求和恒等式：整行相加应等于 2^n（该行所有子集总数）。 */
export function sumIdentity(n: number): {
  terms: number[]
  sum: number
  power: number
  equal: boolean
} {
  const terms = binomialRow(n)
  const sum = terms.reduce((a, b) => a + b, 0)
  const power = 2 ** n
  return { terms, sum, power, equal: sum === power }
}

/** 对称恒等式：C(n,k) 与 C(n,n-k) 应逐项相等。 */
export function symmetryPairs(n: number): {
  k: number
  left: number
  right: number
  equal: boolean
}[] {
  const pairs: { k: number; left: number; right: number; equal: boolean }[] = []
  for (let k = 0; k <= n; k++) {
    const left = binomial(n, k)
    const right = binomial(n, n - k)
    pairs.push({ k, left, right, equal: left === right })
  }
  return pairs
}

/** 帕斯卡法则：C(n,k) = C(n-1,k-1) + C(n-1,k)。 */
export function pascalRule(
  n: number,
  k: number,
): { value: number; upperLeft: number; upperRight: number; equal: boolean } {
  const value = binomial(n, k)
  const upperLeft = binomial(n - 1, k - 1)
  const upperRight = binomial(n - 1, k)
  return { value, upperLeft, upperRight, equal: value === upperLeft + upperRight }
}

/** 曲棍球棒恒等式：从 C(r,r) 累加到 C(n,r)，应等于 C(n+1,r+1)。 */
export function hockeyStick(
  r: number,
  n: number,
): { terms: number[]; sum: number; closed: number; equal: boolean } {
  const terms: number[] = []
  for (let i = r; i <= n; i++) terms.push(binomial(i, r))
  const sum = terms.reduce((a, b) => a + b, 0)
  const closed = binomial(n + 1, r + 1)
  return { terms, sum, closed, equal: sum === closed }
}

export interface IdentityOption {
  id: 'sum' | 'symmetry' | 'pascal' | 'hockey'
  label: string
  formula: string
  note: string
}

/** 可切换的四个经典恒等式。 */
export const IDENTITY_OPTIONS: IdentityOption[] = [
  { id: 'sum', label: '求和恒等式', formula: 'C(n,0)+...+C(n,n) = 2^n', note: '一行之和等于所有子集数' },
  { id: 'symmetry', label: '对称恒等式', formula: 'C(n,k) = C(n,n-k)', note: '选 k 个等于剔除 n 减 k 个' },
  { id: 'pascal', label: '帕斯卡法则', formula: 'C(n,k) = C(n-1,k-1)+C(n-1,k)', note: '按是否含某元素分两类' },
  { id: 'hockey', label: '曲棍球棒', formula: 'ΣC(i,r) = C(n+1,r+1)', note: '斜线累加落到下一格' },
]
