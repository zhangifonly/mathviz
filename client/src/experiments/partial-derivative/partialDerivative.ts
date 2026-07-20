/**
 * 偏导数与梯度核心算法（纯函数，便于测试）
 *
 * 二元函数 f(x, y) 在某点沿 x 方向、沿 y 方向的变化率，
 * 分别是偏导数 partialX 与 partialY，用中心差分数值逼近：
 *   f'(a) ≈ (f(a+h) - f(a-h)) / (2h)
 * 梯度 gradient = [fx, fy]，指向函数上升最陡的方向，
 * 且始终垂直于等高线。
 */

export type Field = (x: number, y: number) => number

export interface FieldDef {
  id: string
  name: string
  f: Field
  /** 高度值大致范围，用于等高线着色归一化 */
  range: [number, number]
}

/** 沿 x 方向偏导（中心差分） */
export function partialX(f: Field, x: number, y: number, h = 1e-4): number {
  return (f(x + h, y) - f(x - h, y)) / (2 * h)
}

/** 沿 y 方向偏导（中心差分） */
export function partialY(f: Field, x: number, y: number, h = 1e-4): number {
  return (f(x, y + h) - f(x, y - h)) / (2 * h)
}

/** 梯度向量 [fx, fy]，指向上升最陡方向 */
export function gradient(f: Field, x: number, y: number, h = 1e-4): [number, number] {
  return [partialX(f, x, y, h), partialY(f, x, y, h)]
}

/** 梯度的模长（最陡上升的坡度大小） */
export function gradientMagnitude(f: Field, x: number, y: number, h = 1e-4): number {
  const [gx, gy] = gradient(f, x, y, h)
  return Math.hypot(gx, gy)
}

export const FUNCTIONS: FieldDef[] = [
  {
    id: 'bowl',
    name: '碗 (x²+y²)',
    f: (x, y) => x * x + y * y,
    range: [0, 8],
  },
  {
    id: 'saddle',
    name: '鞍面 (x²−y²)',
    f: (x, y) => x * x - y * y,
    range: [-4, 4],
  },
  {
    id: 'ripple',
    name: '波纹 (sin·环)',
    f: (x, y) => Math.sin(2 * Math.sqrt(x * x + y * y)),
    range: [-1, 1],
  },
  {
    id: 'monkey',
    name: '猴鞍 (x³−3xy²)',
    f: (x, y) => x * x * x - 3 * x * y * y,
    range: [-6, 6],
  },
]

export function fieldById(id: string): FieldDef {
  return FUNCTIONS.find((d) => d.id === id) ?? FUNCTIONS[0]
}
