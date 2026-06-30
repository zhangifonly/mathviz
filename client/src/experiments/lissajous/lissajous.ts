/**
 * 利萨茹图形与玫瑰曲线参数方程（纯函数，便于测试）
 *
 * - 利萨茹 Lissajous：x=A sin(a t+δ), y=B sin(b t)，频率比 a:b 决定图形
 * - 玫瑰曲线 Rose：r=cos(k θ)，花瓣数由 k 决定
 */

export interface Point {
  x: number
  y: number
}

export type FigureKind = 'lissajous-1-1' | 'lissajous-3-2' | 'lissajous-5-4' | 'rose-3' | 'rose-4' | 'rose-5'

/** 利萨茹图形：频率比 a:b，相位差 δ */
export function lissajous(a: number, b: number, delta = Math.PI / 2, steps = 1000): Point[] {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (2 * Math.PI * i) / steps
    pts.push({ x: Math.sin(a * t + delta), y: Math.sin(b * t) })
  }
  return pts
}

/** 玫瑰曲线：r=cos(kθ)。k 为奇数 → k 瓣；k 为偶数 → 2k 瓣 */
export function rose(k: number, steps = 1000): Point[] {
  const pts: Point[] = []
  const max = k % 2 === 0 ? 2 * Math.PI : Math.PI
  for (let i = 0; i <= steps; i++) {
    const theta = (max * i) / steps
    const r = Math.cos(k * theta)
    pts.push({ x: r * Math.cos(theta), y: r * Math.sin(theta) })
  }
  return pts
}

export interface FigureInfo {
  kind: FigureKind
  label: string
  formula: string
}

export const FIGURE_INFO: FigureInfo[] = [
  { kind: 'lissajous-1-1', label: '利萨茹 1:1', formula: 'x=sin(t+δ), y=sin t → 圆/椭圆' },
  { kind: 'lissajous-3-2', label: '利萨茹 3:2', formula: 'x=sin(3t+δ), y=sin 2t' },
  { kind: 'lissajous-5-4', label: '利萨茹 5:4', formula: 'x=sin(5t+δ), y=sin 4t' },
  { kind: 'rose-3', label: '玫瑰线 k=3', formula: 'r=cos 3θ → 3 瓣' },
  { kind: 'rose-4', label: '玫瑰线 k=4', formula: 'r=cos 4θ → 8 瓣' },
  { kind: 'rose-5', label: '玫瑰线 k=5', formula: 'r=cos 5θ → 5 瓣' },
]

/** 按图形类型生成点集 */
export function buildFigure(kind: FigureKind): Point[] {
  switch (kind) {
    case 'lissajous-1-1':
      return lissajous(1, 1)
    case 'lissajous-3-2':
      return lissajous(3, 2)
    case 'lissajous-5-4':
      return lissajous(5, 4)
    case 'rose-3':
      return rose(3)
    case 'rose-4':
      return rose(4)
    case 'rose-5':
      return rose(5)
    default:
      return lissajous(3, 2)
  }
}

/** 玫瑰曲线花瓣数：k 奇 → k，k 偶 → 2k */
export function petalCount(k: number): number {
  return k % 2 === 0 ? 2 * k : k
}
