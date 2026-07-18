/**
 * 考拉兹猜想核心算法（纯函数，便于测试）
 *
 * 规则：从正整数 n 出发，偶数除以 2，奇数乘 3 加 1，反复迭代。
 * 猜想是：无论起点是谁，最终都会落到 1。至今无人能证明。
 */

/** 生成从 n 到 1 的完整考拉兹序列（含起点与结尾 1） */
export function collatzSequence(n: number): number[] {
  if (!Number.isFinite(n) || n < 1) return []
  let x = Math.floor(n)
  const seq: number[] = [x]
  while (x !== 1) {
    x = x % 2 === 0 ? x / 2 : 3 * x + 1
    seq.push(x)
  }
  return seq
}

/** 停止时间：序列的步数（不含起点，即到达 1 需要迭代的次数） */
export function stoppingTime(n: number): number {
  const seq = collatzSequence(n)
  return seq.length === 0 ? 0 : seq.length - 1
}

/** 序列中出现过的最大值（冰雹能飞到多高） */
export function maxValue(n: number): number {
  const seq = collatzSequence(n)
  let m = 0
  for (const v of seq) {
    if (v > m) m = v
  }
  return m
}

/** 几个著名的“冰雹”起点，轨迹跌宕起伏 */
export const START_VALUES = [27, 97, 703]
