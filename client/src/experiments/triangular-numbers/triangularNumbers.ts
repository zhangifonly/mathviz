/**
 * 图形数核心算法（纯函数，便于测试）
 *
 * 把点子摆成规则图形：三角形、正方形、正五边形，
 * 需要多少个点，就得到对应的「图形数」。
 * 三角形数 T(n)=n(n+1)/2，正方形数 S(n)=n^2，
 * 五边形数 P(n)=n(3n-1)/2。这里还生成点阵坐标供绘制。
 */

export type FigurateType = 'triangular' | 'square' | 'pentagonal'

export interface Dot {
  x: number
  y: number
}

/** 第 n 个三角形数：1,3,6,10,15... */
export function triangular(n: number): number {
  return (n * (n + 1)) / 2
}

/** 第 n 个正方形数：1,4,9,16... */
export function square(n: number): number {
  return n * n
}

/** 第 n 个五边形数：1,5,12,22,35... */
export function pentagonal(n: number): number {
  return (n * (3 * n - 1)) / 2
}

/** 按类型返回第 n 个图形数 */
export function figurate(type: FigurateType, n: number): number {
  if (type === 'triangular') return triangular(n)
  if (type === 'square') return square(n)
  return pentagonal(n)
}

/** 三角形排布：第 k 行有 k 个点（k=1..n） */
function triangularDots(n: number): Dot[] {
  const dots: Dot[] = []
  for (let row = 1; row <= n; row++) {
    const offset = (n - row) / 2
    for (let c = 0; c < row; c++) {
      dots.push({ x: offset + c, y: row - 1 })
    }
  }
  return dots
}

/** 正方形排布：n×n 网格 */
function squareDots(n: number): Dot[] {
  const dots: Dot[] = []
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      dots.push({ x: c, y: r })
    }
  }
  return dots
}

// 正五边形相对共享顶点的四个外顶点（单位半径，浮点，绘制时缩放）
const PENTA_V: Dot[] = [
  { x: 0.951, y: 0.691 }, { x: 0.588, y: 1.809 },
  { x: -0.588, y: 1.809 }, { x: -0.951, y: 0.691 },
]

/**
 * 五边形排布：嵌套五边形共用左下角顶点。
 * 第 k 层在三条外边上各放 k 个点、共享 2 个角，恰好增加 3k-2 个点，
 * 累加得五边形数 P(n)=n(3n-1)/2。
 */
function pentagonalDots(n: number): Dot[] {
  const dots: Dot[] = [{ x: 0, y: 0 }]
  for (let k = 2; k <= n; k++) {
    const s = k - 1
    for (let e = 0; e < 3; e++) {
      const a = PENTA_V[e]
      const b = PENTA_V[e + 1]
      for (let i = e === 0 ? 0 : 1; i < k; i++) {
        const t = i / (k - 1)
        dots.push({ x: s * (a.x + t * (b.x - a.x)), y: s * (a.y + t * (b.y - a.y)) })
      }
    }
  }
  return dots
}

/** 生成某图形数的点阵坐标（网格单位，未缩放） */
export function dotsFor(type: FigurateType, n: number): Dot[] {
  if (n <= 0) return []
  if (type === 'triangular') return triangularDots(n)
  if (type === 'square') return squareDots(n)
  return pentagonalDots(n)
}

export const TYPES: FigurateType[] = ['triangular', 'square', 'pentagonal']
export const N_VALUES = [4, 6, 8]
