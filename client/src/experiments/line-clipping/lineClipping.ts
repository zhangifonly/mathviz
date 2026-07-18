/**
 * Cohen-Sutherland 线段裁剪算法（纯函数，便于测试）
 *
 * 给定一个矩形裁剪窗口和若干线段，把每条线段落在窗口外的部分剪掉，
 * 只保留窗口内的部分。经典做法是给每个端点算一个 4 位「区域码」，
 * 用位运算快速做 trivial 接受/拒绝，再迭代求交点收窄线段。
 */

export interface Rect {
  xmin: number
  ymin: number
  xmax: number
  ymax: number
}

export interface Segment {
  x1: number
  y1: number
  x2: number
  y2: number
}

// 区域码 4 位：上 下 右 左
export const INSIDE = 0
export const LEFT = 1
export const RIGHT = 2
export const BOTTOM = 4
export const TOP = 8

/** 计算点 (x,y) 相对矩形窗口的 4 位区域码 */
export function computeOutCode(x: number, y: number, rect: Rect): number {
  let code = INSIDE
  if (x < rect.xmin) code |= LEFT
  else if (x > rect.xmax) code |= RIGHT
  if (y < rect.ymin) code |= BOTTOM
  else if (y > rect.ymax) code |= TOP
  return code
}

/**
 * 裁剪一条线段，返回被窗口截取后的线段；若整段在窗外则返回 null。
 */
export function clipLine(seg: Segment, rect: Rect): Segment | null {
  let { x1, y1, x2, y2 } = seg
  let code1 = computeOutCode(x1, y1, rect)
  let code2 = computeOutCode(x2, y2, rect)

  for (;;) {
    if ((code1 | code2) === 0) return { x1, y1, x2, y2 } // 两端都在内，接受
    if ((code1 & code2) !== 0) return null // 同侧窗外，拒绝

    const codeOut = code1 !== 0 ? code1 : code2
    let x = 0
    let y = 0
    if (codeOut & TOP) {
      x = x1 + (x2 - x1) * (rect.ymax - y1) / (y2 - y1)
      y = rect.ymax
    } else if (codeOut & BOTTOM) {
      x = x1 + (x2 - x1) * (rect.ymin - y1) / (y2 - y1)
      y = rect.ymin
    } else if (codeOut & RIGHT) {
      y = y1 + (y2 - y1) * (rect.xmax - x1) / (x2 - x1)
      x = rect.xmax
    } else {
      y = y1 + (y2 - y1) * (rect.xmin - x1) / (x2 - x1)
      x = rect.xmin
    }

    if (codeOut === code1) {
      x1 = x
      y1 = y
      code1 = computeOutCode(x1, y1, rect)
    } else {
      x2 = x
      y2 = y
      code2 = computeOutCode(x2, y2, rect)
    }
  }
}

/** 裁剪窗口 */
export const WINDOW: Rect = { xmin: 150, ymin: 120, xmax: 450, ymax: 360 }

/** 演示用线段集合（覆盖内外/穿越/斜穿等多种情形） */
export const SEGMENTS: Segment[] = [
  { x1: 60, y1: 200, x2: 540, y2: 260 },
  { x1: 300, y1: 40, x2: 300, y2: 440 },
  { x1: 80, y1: 60, x2: 520, y2: 420 },
  { x1: 200, y1: 180, x2: 400, y2: 300 },
  { x1: 100, y1: 400, x2: 500, y2: 100 },
  { x1: 20, y1: 30, x2: 120, y2: 90 },
]
