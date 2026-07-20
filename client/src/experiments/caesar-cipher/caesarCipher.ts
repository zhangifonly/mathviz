/**
 * 凯撒密码核心算法（纯函数，便于测试）
 *
 * 凯撒密码是最古老的替换加密：把每个字母沿字母表向后移动固定位数(shift)，
 * 超过 Z 就绕回 A（模 26）。解密就是反向移位。
 * 由于密钥空间只有 25 种，可用频率分析轻松破解。
 */

// 英文字母标准出现频率（百分比，索引 0=a ... 25=z）
export const ENGLISH_FREQ = [
  8.17, 1.29, 2.78, 4.25, 12.70, 2.23, 2.02, 6.09, 6.97, 0.15,
  0.77, 4.03, 2.41, 6.75, 7.51, 1.93, 0.10, 5.99, 6.33, 9.06,
  2.76, 0.98, 2.36, 0.15, 1.97, 0.07,
]

/** 可选移位量（0 无位移，25 最大位移） */
export const SHIFTS = [3, 7, 13, 19]

/** 示例明文（用于演示加解密与破解） */
export const SAMPLE_TEXT =
  'The quick brown fox jumps over the lazy dog near the river bank at dawn'

const A = 97 // 'a'
const Z = 90 // 'Z'

/** 单个字符移位，非字母原样返回 */
function shiftChar(code: number, shift: number): number {
  if (code >= 65 && code <= Z) {
    return ((code - 65 + shift) % 26 + 26) % 26 + 65
  }
  if (code >= A && code <= 122) {
    return ((code - A + shift) % 26 + 26) % 26 + A
  }
  return code
}

/** 加密：每个字母向后移 shift 位（模 26），保留大小写与非字母 */
export function encrypt(text: string, shift: number): string {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    out += String.fromCharCode(shiftChar(text.charCodeAt(i), shift))
  }
  return out
}

/** 解密：反向移位，等价于用 -shift 加密 */
export function decrypt(text: string, shift: number): string {
  return encrypt(text, -shift)
}

/** 统计字母频率，返回长度 26 的数组（0=a），值为百分比 */
export function letterFrequency(text: string): number[] {
  const counts = new Array(26).fill(0)
  let total = 0
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i)
    let idx = -1
    if (c >= 65 && c <= Z) idx = c - 65
    else if (c >= A && c <= 122) idx = c - A
    if (idx >= 0) {
      counts[idx]++
      total++
    }
  }
  if (total === 0) return counts
  return counts.map((n) => (n / total) * 100)
}

/**
 * 卡方统计：衡量密文按某 shift 解密后与英文标准频率的偏离，越小越像英文。
 */
export function chiSquared(freq: number[]): number {
  let sum = 0
  for (let i = 0; i < 26; i++) {
    const e = ENGLISH_FREQ[i]
    const diff = freq[i] - e
    sum += (diff * diff) / (e || 0.01)
  }
  return sum
}

/**
 * 频率分析破解：遍历 25 种可能移位，选卡方最小者作为最可能的密钥。
 * 返回 { shift, plaintext, score }。
 */
export function crack(cipher: string): { shift: number; plaintext: string; score: number } {
  let best = { shift: 0, plaintext: cipher, score: Infinity }
  for (let s = 0; s < 26; s++) {
    const candidate = decrypt(cipher, s)
    const score = chiSquared(letterFrequency(candidate))
    if (score < best.score) {
      best = { shift: s, plaintext: candidate, score }
    }
  }
  return best
}
