/**
 * 奇偶数与整除（纯函数，便于测试，不触碰 DOM）
 *
 * 偶数是能被 2 整除的整数，奇数不能。整除指相除余数为 0。
 * 奇偶性在加法、乘法下遵循固定规律，可用一个数格可视化观察。
 */

/** 是否偶数（能被 2 整除，含 0 与负偶数） */
export function isEven(n: number): boolean {
  return n % 2 === 0
}

/** 是否奇数 */
export function isOdd(n: number): boolean {
  return Math.abs(n % 2) === 1
}

/** n 是否能被 d 整除（d 不为 0 且余数为 0） */
export function isDivisible(n: number, d: number): boolean {
  if (d === 0) return false
  return n % d === 0
}

/** 奇偶标签：0=偶，1=奇（对负数也成立） */
export function parity(n: number): 0 | 1 {
  return isEven(n) ? 0 : 1
}

/**
 * 两数之和的奇偶性：偶+偶=偶，奇+奇=偶，一奇一偶=奇。
 * 返回 0（和为偶）或 1（和为奇），等价于 (parity(a) XOR parity(b))。
 */
export function addParity(a: number, b: number): 0 | 1 {
  return ((parity(a) + parity(b)) % 2) as 0 | 1
}

/**
 * 两数之积的奇偶性：只要有一个是偶数，积就是偶数；
 * 两个都是奇数时积才是奇数。返回 0（积为偶）或 1（积为奇）。
 */
export function mulParity(a: number, b: number): 0 | 1 {
  return (parity(a) & parity(b)) as 0 | 1
}

/** 数格里的单个格子 */
export interface NumberCell {
  n: number         // 数值（从 1 开始）
  remainder: number // n 除以 divisor 的余数
  divisible: boolean // 是否被 divisor 整除
}

/**
 * 生成 1..count 的数格，标注每个数对 divisor 的整除情况。
 * divisor=2 时即奇偶染色。
 */
export function buildGrid(count: number, divisor: number): NumberCell[] {
  const d = divisor <= 0 ? 1 : divisor
  const cells: NumberCell[] = []
  for (let n = 1; n <= count; n++) {
    const remainder = n % d
    cells.push({ n, remainder, divisible: remainder === 0 })
  }
  return cells
}

/** 统计 1..count 中能被 divisor 整除的个数，等于 floor(count/divisor) */
export function countDivisible(count: number, divisor: number): number {
  if (divisor <= 0) return 0
  return Math.floor(count / divisor)
}

export interface DivisorOption {
  divisor: number
  label: string
  note: string
}

export const DIVISOR_OPTIONS: DivisorOption[] = [
  { divisor: 2, label: '除以 2', note: '偶数点亮 → 奇偶相间' },
  { divisor: 3, label: '除以 3', note: '3 的倍数每隔两个出现' },
  { divisor: 5, label: '除以 5', note: '个位是 0 或 5 的数' },
]
