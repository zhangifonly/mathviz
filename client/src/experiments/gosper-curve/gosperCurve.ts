/**
 * 戈斯珀曲线核心算法（纯函数，便于测试）
 *
 * 戈斯珀曲线是一条能填满平面的分形曲线，由 L 系统生成：
 *   公理: A
 *   规则: A -> A-B--B+A++AA+B-
 *         B -> +A-BB--B-A++A+B
 *   转向角: 60 度（+ 左转，- 右转，A/B 都表示向前画一步）
 * 反复重写公理得到长字符串，再当作画笔指令解析成点列，
 * 即得到自相似地铺砌平面的六边形流水曲线。
 */

export interface Point {
  x: number
  y: number
}

const RULE_A = 'A-B--B+A++AA+B-'
const RULE_B = '+A-BB--B-A++A+B'
const ANGLE = Math.PI / 3 // 60 度

/** 把公理 A 重写 order 次，返回展开后的指令字符串 */
export function rewrite(order: number): string {
  let s = 'A'
  for (let i = 0; i < order; i++) {
    let next = ''
    for (const ch of s) {
      if (ch === 'A') next += RULE_A
      else if (ch === 'B') next += RULE_B
      else next += ch
    }
    s = next
  }
  return s
}

/**
 * 解析指令字符串成点列。A/B 前进一步，+ 左转 60 度，- 右转 60 度。
 * 返回归一化到 [0,1] 的坐标，便于 Canvas 自适应缩放。
 */
export function gosperPoints(order: number): Point[] {
  const cmds = rewrite(order)
  let x = 0
  let y = 0
  let dir = 0 // 弧度
  const pts: Point[] = [{ x, y }]
  for (const ch of cmds) {
    if (ch === 'A' || ch === 'B') {
      x += Math.cos(dir)
      y += Math.sin(dir)
      pts.push({ x, y })
    } else if (ch === '+') {
      dir += ANGLE
    } else if (ch === '-') {
      dir -= ANGLE
    }
  }
  return normalize(pts)
}

/** 平移+缩放到单位正方形 [0,1]×[0,1]，保持长宽比 */
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

export const ORDERS = [2, 3, 4]
