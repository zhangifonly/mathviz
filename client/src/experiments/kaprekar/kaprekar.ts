/**
 * 卡普雷卡常数核心算法（纯函数，便于测试）
 *
 * 卡普雷卡例程：取一个四位数（数字不全相同），把各位数字
 * 从大到小排成最大数，从小到大排成最小数，用大数减小数。
 * 对绝大多数四位数反复迭代，最终都会收敛到 6174，即卡普雷卡常数。
 */

export const KAPREKAR_CONSTANT = 6174

/** 一步卡普雷卡例程的结果 */
export interface KaprekarStep {
  n: number      // 本步输入（补齐到四位）
  big: number    // 各位降序排列得到的最大数
  small: number  // 各位升序排列得到的最小数
  result: number // big - small
}

/** 取 n 的四位数字数组（不足四位在前面补 0） */
export function digitsOf(n: number): number[] {
  const s = String(Math.abs(Math.trunc(n))).padStart(4, '0').slice(-4)
  return s.split('').map((c) => Number(c))
}

/** 执行一步卡普雷卡例程：大数减小数 */
export function kaprekarStep(n: number): KaprekarStep {
  const d = digitsOf(n)
  const big = Number([...d].sort((a, b) => b - a).join(''))
  const small = Number([...d].sort((a, b) => a - b).join(''))
  return { n: Number(d.join('')), big, small, result: big - small }
}

/** 判断四位数字是否全部相同（如 1111、2222），这类数会落入 0 而非 6174 */
export function isRepdigit(n: number): boolean {
  const d = digitsOf(n)
  return d.every((x) => x === d[0])
}

/**
 * 生成从 n 迭代到 6174 的完整链条。
 * 数字全相同者会停在 0；其余四位数最多 7 步收敛到 6174。
 * @returns 每一步的 KaprekarStep 数组
 */
export function kaprekarChain(n: number, maxSteps = 7): KaprekarStep[] {
  const chain: KaprekarStep[] = []
  let cur = Number(digitsOf(n).join(''))
  for (let i = 0; i < maxSteps; i++) {
    const step = kaprekarStep(cur)
    chain.push(step)
    if (step.result === KAPREKAR_CONSTANT || step.result === 0) break
    cur = step.result
  }
  return chain
}

/** 收敛到 6174 所需步数（全相同数字返回 -1 表示不收敛） */
export function stepsToKaprekar(n: number): number {
  if (isRepdigit(n)) return -1
  const chain = kaprekarChain(n)
  const last = chain[chain.length - 1]
  return last.result === KAPREKAR_CONSTANT ? chain.length : -1
}

/** 示例四位数，展示不同长度的收敛链 */
export const SAMPLES = [3524, 1234, 2005, 9831, 6174]
