/**
 * 皮亚诺曲线核心算法（纯函数，便于测试）
 *
 * 皮亚诺曲线是历史上第一条空间填充曲线（Peano, 1890）：
 * 一条连续曲线，最终填满整个正方形。它基于三进制、3x3 自相似。
 * 这里用经典的 L 系统重写规则生成 order 阶曲线的点列。
 */

export interface Point {
  x: number
  y: number
}

/** 可选阶数（阶数越高越接近填满正方形） */
export const ORDERS = [2, 3, 4]

/** 皮亚诺曲线的 L 系统重写规则（角度 90 度） */
const RULES: Record<string, string> = {
  X: 'XFYFX+F+YFXFY-F-XFYFX',
  Y: 'YFXFY-F-XFYFX+F+YFXFY',
}

/** 迭代 order 次生成 L 系统指令串 */
export function peanoLSystem(order: number): string {
  let s = 'X'
  for (let i = 0; i < order; i++) {
    let next = ''
    for (const c of s) next += RULES[c] ?? c
    s = next
  }
  return s
}

/** 把点列归一化到单位正方形 [0,1]x[0,1]（保持纵横比） */
function normalize(pts: Point[]): Point[] {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of pts) {
    if (p.x < minX) minX = p.x
    if (p.y < minY) minY = p.y
    if (p.x > maxX) maxX = p.x
    if (p.y > maxY) maxY = p.y
  }
  const span = Math.max(maxX - minX, maxY - minY) || 1
  return pts.map((p) => ({ x: (p.x - minX) / span, y: (p.y - minY) / span }))
}

/**
 * 生成 order 阶皮亚诺曲线点列，归一化到 [0,1]x[0,1]。
 * 用海龟图解释 L 系统指令：F 前进、+ 左转 90、- 右转 90。
 */
export function peanoPoints(order: number): Point[] {
  const cmds = peanoLSystem(order)
  const dx = [1, 0, -1, 0]
  const dy = [0, 1, 0, -1]
  let x = 0
  let y = 0
  let dir = 0
  const pts: Point[] = [{ x, y }]
  for (const c of cmds) {
    if (c === 'F') {
      x += dx[dir]
      y += dy[dir]
      pts.push({ x, y })
    } else if (c === '+') {
      dir = (dir + 1) & 3
    } else if (c === '-') {
      dir = (dir + 3) & 3
    }
  }
  return normalize(pts)
}

/** order 阶曲线的顶点数（3x3 自相似，共访问 9^order 个格点） */
export function pointCount(order: number): number {
  return Math.pow(9, order)
}
