/**
 * 康托三分集核心算法（纯函数，便于测试）
 *
 * 从闭区间 [0,1] 出发，反复挖去每段中间的三分之一。
 * 第 n 层剩余的是 2^n 段小区间，每段长度 (1/3)^n，
 * 剩余总长度 (2/3)^n 随层数趋于零，但极限集合却不可数。
 * 其豪斯多夫维数为 log2 / log3 ≈ 0.6309。
 */

export interface Segment {
  start: number
  end: number
}

/** 挖去一段中间的三分之一，返回左右两段 */
export function removeMiddleThird(seg: Segment): Segment[] {
  const third = (seg.end - seg.start) / 3
  return [
    { start: seg.start, end: seg.start + third },
    { start: seg.end - third, end: seg.end },
  ]
}

/** 返回第 n 层剩余的所有线段区间（第 0 层为整段 [0,1]） */
export function cantorSegments(n: number): Segment[] {
  let segs: Segment[] = [{ start: 0, end: 1 }]
  for (let i = 0; i < n; i++) {
    const next: Segment[] = []
    for (const s of segs) next.push(...removeMiddleThird(s))
    segs = next
  }
  return segs
}

/** 第 n 层剩余的线段条数 = 2^n */
export function segmentCount(n: number): number {
  return 2 ** n
}

/** 第 n 层剩余总长度 = (2/3)^n */
export function remainingLength(n: number): number {
  return (2 / 3) ** n
}

/** 康托集的豪斯多夫维数 = log2 / log3 */
export function cantorDimension(): number {
  return Math.log(2) / Math.log(3)
}

export const LEVELS = [5, 7]
