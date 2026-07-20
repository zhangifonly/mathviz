/**
 * Heighway 龙形曲线核心算法（纯函数，便于测试）
 *
 * 把一张纸条反复对折 n 次，再全部展开成直角，
 * 每道折痕留下一个"左转"或"右转"。这串转向序列就完全
 * 决定了龙形曲线的形状。这里用折叠序列递推真实生成。
 */

export type Turn = 'L' | 'R'

export interface Pt {
  x: number
  y: number
}

/**
 * 生成 n 次对折后的转向序列。
 * 递推规律：seq(n) = seq(n-1) + 'L' + reverse(flip(seq(n-1)))
 * 其中 flip 把每个转向取反。seq(0) 为空序列。
 * 长度为 2^n - 1。
 */
export function turnSequence(n: number): Turn[] {
  let seq: Turn[] = []
  for (let i = 0; i < n; i++) {
    const tail: Turn[] = []
    // 取上一轮序列的反转，同时把每个转向翻转
    for (let j = seq.length - 1; j >= 0; j--) {
      tail.push(seq[j] === 'L' ? 'R' : 'L')
    }
    seq = [...seq, 'L', ...tail]
  }
  return seq
}

/**
 * 依据转向序列走出点列。起点 (0,0)，初始朝向 +x。
 * 每走一步长度 step，再按当前转向左转或右转 90 度。
 * 点数 = 转向序列长度 + 2 = 2^n + 1。
 */
export function dragonPoints(n: number, step = 1): Pt[] {
  const turns = turnSequence(n)
  const pts: Pt[] = [{ x: 0, y: 0 }]
  let dx = step
  let dy = 0
  let x = 0
  let y = 0
  x += dx
  y += dy
  pts.push({ x, y })
  for (const t of turns) {
    // 左转 90: (dx,dy)->(dy,-dx)；右转 90: (dx,dy)->(-dy,dx)
    if (t === 'L') {
      const ndx = dy
      const ndy = -dx
      dx = ndx
      dy = ndy
    } else {
      const ndx = -dy
      const ndy = dx
      dx = ndx
      dy = ndy
    }
    x += dx
    y += dy
    pts.push({ x, y })
  }
  return pts
}

/** 计算点列的包围盒，用于自适应缩放 */
export function boundingBox(pts: Pt[]) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of pts) {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.y < minY) minY = p.y
    if (p.y > maxY) maxY = p.y
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY }
}

export const ITERATIONS = [8, 12, 16]
