/**
 * 核与像 - 线性映射的零空间与列空间（纯函数，便于测试）
 *
 * 把 2x2 矩阵 M 看作平面到平面的线性映射 x -> M x。
 * - 核(kernel/零空间)：被映射压成零向量的所有输入方向。
 * - 像(image/列空间)：所有输出向量能覆盖到的集合。
 * 用高斯消元判定秩，从而刻画核与像的几何形态。
 */

export type Mat2 = [number, number, number, number] // [a, b, c, d] 行主序
export interface Vec2 { x: number; y: number }

const EPS = 1e-9

/** 高斯消元（部分主元）求 2x2 矩阵的秩：0 / 1 / 2 */
export function rank(m: Mat2): number {
  // 复制成两行：r0 = [a, b], r1 = [c, d]
  const rows = [
    [m[0], m[1]],
    [m[2], m[3]],
  ]
  let r = 0
  for (let col = 0; col < 2 && r < 2; col++) {
    // 在 r..2 行中找该列绝对值最大的主元
    let piv = r
    for (let i = r + 1; i < 2; i++) {
      if (Math.abs(rows[i][col]) > Math.abs(rows[piv][col])) piv = i
    }
    if (Math.abs(rows[piv][col]) < EPS) continue
    const t = rows[r]; rows[r] = rows[piv]; rows[piv] = t
    // 用主元行消去下方
    for (let i = r + 1; i < 2; i++) {
      const f = rows[i][col] / rows[r][col]
      for (let j = col; j < 2; j++) rows[i][j] -= f * rows[r][j]
    }
    r++
  }
  return r
}

/** 行列式（辅助判满秩） */
export function det(m: Mat2): number {
  return m[0] * m[3] - m[1] * m[2]
}

/**
 * 降秩(rank 1)时返回核方向的单位向量；满秩或零矩阵返回 null。
 * 核满足 M v = 0，即 a*x+b*y=0 且 c*x+d*y=0。
 */
export function kernelDirection(m: Mat2): Vec2 | null {
  if (rank(m) !== 1) return null
  const [a, b, c, d] = m
  // 取一条非零行的法向作为解方向：行 (p,q) 的核方向为 (q,-p)
  let px = a, py = b
  if (Math.abs(a) < EPS && Math.abs(b) < EPS) { px = c; py = d }
  const vx = py, vy = -px
  const len = Math.hypot(vx, vy) || 1
  return { x: vx / len, y: vy / len }
}

export type ImageKind = 'plane' | 'line' | 'point'

/** 像(列空间)的几何描述：满秩=全平面，秩1=一条直线，秩0=原点 */
export function imageDescription(m: Mat2): ImageKind {
  const r = rank(m)
  return r === 2 ? 'plane' : r === 1 ? 'line' : 'point'
}

/** 秩1 时像所在直线的方向单位向量（列空间的生成向量） */
export function imageDirection(m: Mat2): Vec2 | null {
  if (rank(m) !== 1) return null
  const [a, b, c, d] = m
  // 取非零列作为方向：列1=(a,c)，列2=(b,d)
  let vx = a, vy = c
  if (Math.abs(a) < EPS && Math.abs(c) < EPS) { vx = b; vy = d }
  const len = Math.hypot(vx, vy) || 1
  return { x: vx / len, y: vy / len }
}

/** 应用映射 */
export function apply(m: Mat2, v: Vec2): Vec2 {
  return { x: m[0] * v.x + m[1] * v.y, y: m[2] * v.x + m[3] * v.y }
}

/** 示例矩阵：满秩(旋转缩放)、秩1(投影到直线)、零矩阵 */
export const SAMPLE_MATRICES: { name: string; kind: string; m: Mat2 }[] = [
  { name: '满秩', kind: 'full', m: [1, -0.5, 0.5, 1] },
  { name: '秩1', kind: 'rank1', m: [1, 2, 2, 4] },
  { name: '零矩阵', kind: 'zero', m: [0, 0, 0, 0] },
]
