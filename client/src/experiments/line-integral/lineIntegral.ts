/**
 * 曲线积分核心算法（纯函数，便于测试）
 * 第二类 ∫F·dr = ∫F(r(t))·r'(t)dt（做功）；第一类 ∫|F|ds 沿弧长累加。
 * 均用复合梯形法数值积分，给定场 + 参数曲线即可求值。
 */

export interface Vec {
  x: number
  y: number
}

export interface Field {
  id: string
  name: string
  f: (x: number, y: number) => Vec
}

export interface Path {
  id: string
  name: string
  t0: number
  t1: number
  r: (t: number) => Vec
  dr: (t: number) => Vec
}

export const FIELDS: Field[] = [
  { id: 'uniform', name: '匀强场', f: () => ({ x: 0.9, y: 0.4 }) },
  { id: 'rotation', name: '旋转场', f: (x, y) => ({ x: -y, y: x }) },
  { id: 'radial', name: '径向场', f: (x, y) => ({ x: x * 0.6, y: y * 0.6 }) },
]

export const PATHS: Path[] = [
  {
    id: 'line', name: '直线', t0: 0, t1: 1,
    r: (t) => ({ x: -2 + 4 * t, y: -1.2 + 2.4 * t }),
    dr: () => ({ x: 4, y: 2.4 }),
  },
  {
    id: 'arc', name: '圆弧', t0: 0, t1: Math.PI,
    r: (t) => ({ x: 2 * Math.cos(t), y: 2 * Math.sin(t) }),
    dr: (t) => ({ x: -2 * Math.sin(t), y: 2 * Math.cos(t) }),
  },
  {
    id: 'parabola', name: '抛物线', t0: -1.6, t1: 1.6,
    r: (t) => ({ x: t, y: 1.6 - t * t }),
    dr: (t) => ({ x: 1, y: -2 * t }),
  },
]

export function dot(a: Vec, b: Vec): number {
  return a.x * b.x + a.y * b.y
}

export function mag(a: Vec): number {
  return Math.hypot(a.x, a.y)
}

/** 被积函数：F(r(t))·r'(t)，即第二类曲线积分的做功密度 */
export function workDensity(field: Field, path: Path, t: number): number {
  const p = path.r(t)
  return dot(field.f(p.x, p.y), path.dr(t))
}

/** 第二类曲线积分 ∫F·dr，梯形法 n 区间 */
export function lineIntegral2(field: Field, path: Path, n = 240): number {
  const h = (path.t1 - path.t0) / n
  let sum = 0
  for (let i = 0; i <= n; i++) {
    const t = path.t0 + i * h
    const w = i === 0 || i === n ? 0.5 : 1
    sum += w * workDensity(field, path, t)
  }
  return sum * h
}

/** 第一类曲线积分 ∫|F|ds 沿弧长累加 */
export function lineIntegral1(field: Field, path: Path, n = 240): number {
  const h = (path.t1 - path.t0) / n
  let sum = 0
  for (let i = 0; i <= n; i++) {
    const t = path.t0 + i * h
    const p = path.r(t)
    const w = i === 0 || i === n ? 0.5 : 1
    sum += w * mag(field.f(p.x, p.y)) * mag(path.dr(t))
  }
  return sum * h
}

/** 采样路径上的点（世界坐标），返回 n+1 个点 */
export function samplePath(path: Path, n = 60): Vec[] {
  const pts: Vec[] = []
  const h = (path.t1 - path.t0) / n
  for (let i = 0; i <= n; i++) pts.push(path.r(path.t0 + i * h))
  return pts
}

export const getField = (id: string): Field => FIELDS.find((f) => f.id === id) ?? FIELDS[0]
export const getPath = (id: string): Path => PATHS.find((p) => p.id === id) ?? PATHS[0]
