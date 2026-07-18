/**
 * 对数螺线核心算法（纯函数，便于测试）
 *
 * 对数螺线（等角螺线）的极坐标方程为 r = a * e^(b*theta)。
 * 它最迷人的性质是"等角"：任意点处切线与该点径向的夹角恒为常数，
 * 且每转一圈半径按固定倍数放大，因而处处自相似。
 */

export interface Pt {
  x: number
  y: number
}

/**
 * 生成对数螺线 r = a*e^(b*theta) 的直角坐标点列。
 * @param turns 圈数（theta 从 0 到 turns*2π）
 * @param steps 每圈采样点数
 */
export function spiralPoints(a: number, b: number, turns: number, steps = 120): Pt[] {
  const pts: Pt[] = []
  const total = Math.max(1, Math.round(turns * steps))
  for (let i = 0; i <= total; i++) {
    const theta = (i / steps) * 2 * Math.PI
    const r = a * Math.exp(b * theta)
    pts.push({ x: r * Math.cos(theta), y: r * Math.sin(theta) })
  }
  return pts
}

/**
 * 阿基米德螺线 r = a + b*theta 的直角坐标点列（用于对比：线性增长）。
 */
export function archimedeanPoints(a: number, b: number, turns: number, steps = 120): Pt[] {
  const pts: Pt[] = []
  const total = Math.max(1, Math.round(turns * steps))
  for (let i = 0; i <= total; i++) {
    const theta = (i / steps) * 2 * Math.PI
    const r = a + b * theta
    pts.push({ x: r * Math.cos(theta), y: r * Math.sin(theta) })
  }
  return pts
}

/**
 * 等角螺线的定角（切线与径向的夹角），恒为 atan(1/b)，与 theta 无关。
 * 返回弧度。b 越小螺线越"松"，夹角越接近 90°。
 */
export function pitchAngle(b: number): number {
  return Math.atan2(1, b)
}

/** 每转一圈半径放大的倍数 e^(2πb)。 */
export function growthPerTurn(b: number): number {
  return Math.exp(2 * Math.PI * b)
}

/** 极径：给定 theta 求 r。 */
export function radiusAt(a: number, b: number, theta: number): number {
  return a * Math.exp(b * theta)
}

/** 预置参数组：[a, b]，b 从松到紧。 */
export const PARAMS: Array<{ a: number; b: number; label: string }> = [
  { a: 6, b: 0.1, label: '松（b=0.1）' },
  { a: 6, b: 0.2, label: '中（b=0.2）' },
  { a: 6, b: 0.35, label: '紧（b=0.35）' },
]

export const B_VALUES = [0.1, 0.2, 0.35]
