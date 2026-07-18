/**
 * 保守场与势函数核心算法（纯函数，便于测试）
 *
 * 2D 向量场 F = (P, Q)。若旋度 curl = dQ/dx - dP/dy 处处为零，
 * 则 F 为保守场，存在势函数 phi 使 F = grad(phi)。
 * 保守场沿路径做功只依赖起终点：W = phi(终) - phi(始)，与路径无关。
 */

export interface Vec {
  x: number
  y: number
}

export interface Field {
  id: string
  name: string
  P: (x: number, y: number) => number
  Q: (x: number, y: number) => number
  conservative: boolean
  potential?: (x: number, y: number) => number
}

/** 数值旋度 dQ/dx - dP/dy（中心差分） */
export function curl(field: Field, x: number, y: number, h = 1e-4): number {
  const dQdx = (field.Q(x + h, y) - field.Q(x - h, y)) / (2 * h)
  const dPdy = (field.P(x, y + h) - field.P(x, y - h)) / (2 * h)
  return dQdx - dPdy
}

/** 在网格上采样判断是否保守（旋度处处近零） */
export function isConservative(field: Field, lo = -2, hi = 2, n = 9, tol = 1e-3): boolean {
  const step = (hi - lo) / (n - 1)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (Math.abs(curl(field, lo + i * step, lo + j * step)) > tol) return false
    }
  }
  return true
}

/** 沿折线路径做功的数值线积分（中点法，每段 F(mid)·dr） */
export function workAlongPath(field: Field, path: Vec[]): number {
  let sum = 0
  for (let i = 0; i + 1 < path.length; i++) {
    const a = path[i]
    const b = path[i + 1]
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    sum += field.P(mx, my) * (b.x - a.x) + field.Q(mx, my) * (b.y - a.y)
  }
  return sum
}

/** 保守场做功的解析值：phi(终) - phi(始)，与路径无关 */
export function potentialWork(field: Field, start: Vec, end: Vec): number {
  if (!field.potential) throw new Error('非保守场没有势函数')
  return field.potential(end.x, end.y) - field.potential(start.x, start.y)
}

/** 直线路径：从 start 到 end 均匀取 n+1 点 */
export function straightPath(start: Vec, end: Vec, n = 60): Vec[] {
  const pts: Vec[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    pts.push({ x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t })
  }
  return pts
}

/** 折线路径：先水平走到终点横坐标，再竖直上去（L 形，围出面积） */
export function cornerPath(start: Vec, end: Vec, n = 60): Vec[] {
  const corner: Vec = { x: end.x, y: start.y }
  const half = Math.floor(n / 2)
  return [...straightPath(start, corner, half), ...straightPath(corner, end, n - half).slice(1)]
}

export const START: Vec = { x: -1.5, y: -1.0 }
export const END: Vec = { x: 0.5, y: 1.5 }

/** 供选择的向量场：一个保守（梯度场），一个非保守（旋转场） */
export const FIELDS: Field[] = [
  {
    id: 'gradient',
    name: '保守场（梯度场）',
    P: (x) => 2 * x,
    Q: (_x, y) => 2 * y,
    conservative: true,
    potential: (x, y) => x * x + y * y,
  },
  {
    id: 'rotation',
    name: '非保守场（旋转场）',
    P: (_x, y) => -y,
    Q: (x) => x,
    conservative: false,
  },
]
