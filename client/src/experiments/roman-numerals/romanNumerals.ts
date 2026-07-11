/**
 * 罗马数字（纯函数，便于测试，不涉及 DOM）
 *
 * 罗马数字用 7 个字母表示数：I=1, V=5, X=10, L=50, C=100, D=500, M=1000。
 * 采用加法与减法两种规则：多数情况把符号从大到小相加；当小符号写在
 * 大符号左边时（如 IV=4, IX=9）表示相减。本内核覆盖 1..3999。
 */

/** 单个符号-数值对，用于逐符号动画展示 */
export interface RomanStep {
  symbol: string
  value: number
}

/** 一个数的罗马数字分解结果 */
export interface RomanBreakdown {
  value: number
  roman: string
  steps: RomanStep[]
}

/** 从大到小的映射表，含 6 个减法组合，是转换算法的核心 */
export const NUMERALS: RomanStep[] = [
  { value: 1000, symbol: 'M' },
  { value: 900, symbol: 'CM' },
  { value: 500, symbol: 'D' },
  { value: 400, symbol: 'CD' },
  { value: 100, symbol: 'C' },
  { value: 90, symbol: 'XC' },
  { value: 50, symbol: 'L' },
  { value: 40, symbol: 'XL' },
  { value: 10, symbol: 'X' },
  { value: 9, symbol: 'IX' },
  { value: 5, symbol: 'V' },
  { value: 4, symbol: 'IV' },
  { value: 1, symbol: 'I' },
]

const SINGLE: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }

/** 把 1..3999 的整数分解为罗马符号序列 */
export function decompose(n: number): RomanBreakdown {
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    throw new RangeError('罗马数字仅支持 1 到 3999 的整数')
  }
  const steps: RomanStep[] = []
  let rest = n
  for (const item of NUMERALS) {
    while (rest >= item.value) {
      steps.push(item)
      rest -= item.value
    }
  }
  return { value: n, roman: steps.map((s) => s.symbol).join(''), steps }
}

/** 整数转罗马数字字符串 */
export function toRoman(n: number): string {
  return decompose(n).roman
}

/** 罗马数字字符串转整数（按加减规则解析，不校验规范性） */
export function fromRoman(s: string): number {
  const str = s.toUpperCase().trim()
  let total = 0
  for (let i = 0; i < str.length; i++) {
    const cur = SINGLE[str[i]]
    const next = SINGLE[str[i + 1]]
    if (cur === undefined) throw new Error(`非法罗马符号: ${str[i]}`)
    if (next !== undefined && cur < next) total -= cur
    else total += cur
  }
  return total
}

/** 判断字符串是否为规范的罗马数字（回环校验：转成数字再转回来相等） */
export function isValidRoman(s: string): boolean {
  const str = s.toUpperCase().trim()
  if (!/^[IVXLCDM]+$/.test(str)) return false
  try {
    const n = fromRoman(str)
    return n >= 1 && n <= 3999 && toRoman(n) === str
  } catch {
    return false
  }
}

/** 示例数字，覆盖加法、减法、进位与年份等典型场景 */
export const ROMAN_OPTIONS: { value: number; note: string }[] = [
  { value: 4, note: '减法规则 IV：5 减 1' },
  { value: 9, note: '减法规则 IX：10 减 1' },
  { value: 14, note: '加减混合 XIV' },
  { value: 49, note: '易错 XLIX，不是 IL' },
  { value: 2024, note: '年份 MMXXIV' },
  { value: 3888, note: '符号最多 MMMDCCCLXXXVIII' },
]
