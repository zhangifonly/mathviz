/**
 * 最速降线核心算法（纯函数，便于测试）
 *
 * 比较三条从 A(0,0) 到 B(bx,by>0，y 向下为正) 的下滑路径：
 * 直线、圆弧、摆线（最速降线）。用能量守恒 v=√(2·g·y) 沿路径数值积分下滑时间。
 */

export interface Pt {
  x: number
  y: number
}

export const G = 9.8

/** 直线路径采样 */
export function straightPath(bx: number, by: number, n = 200): Pt[] {
  const pts: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    pts.push({ x: bx * t, y: by * t })
  }
  return pts
}

/** 圆弧路径：过 A、B 且在 A 点竖直相切的圆弧 */
export function arcPath(bx: number, by: number, n = 200): Pt[] {
  // 圆心在 x 轴上 (cx,0)，过 A(0,0) 与 B。cx 由 |center-A|=|center-B| 定
  const cx = (bx * bx + by * by) / (2 * bx)
  const r = Math.abs(cx)
  const a0 = Math.atan2(0 - 0, 0 - cx)
  const a1 = Math.atan2(by - 0, bx - cx)
  const pts: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * (i / n)
    pts.push({ x: cx + r * Math.cos(a), y: r * Math.sin(a) })
  }
  return pts
}

/** 求摆线参数：x=R(θ-sinθ), y=R(1-cosθ)，解出过 B 的 R 与终止角 θ_end */
export function cycloidParams(bx: number, by: number): { R: number; thetaEnd: number } {
  // 二分求 θ_end 使 (θ-sinθ)/(1-cosθ) = bx/by
  const ratio = bx / by
  let lo = 1e-4
  let hi = 2 * Math.PI - 1e-4
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2
    const f = (m - Math.sin(m)) / (1 - Math.cos(m))
    if (f < ratio) lo = m
    else hi = m
  }
  const thetaEnd = (lo + hi) / 2
  const R = by / (1 - Math.cos(thetaEnd))
  return { R, thetaEnd }
}

/** 摆线（最速降线）路径采样 */
export function cycloidPath(bx: number, by: number, n = 200): Pt[] {
  const { R, thetaEnd } = cycloidParams(bx, by)
  const pts: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const th = (thetaEnd * i) / n
    pts.push({ x: R * (th - Math.sin(th)), y: R * (1 - Math.cos(th)) })
  }
  return pts
}

/** 沿路径的下滑时间：v=√(2g·y)，dt=ds/v，梯形积分（起点 v=0 用小 ε 处理） */
export function descentTime(path: Pt[], g = G): number {
  let t = 0
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].x - path[i - 1].x
    const dy = path[i].y - path[i - 1].y
    const ds = Math.hypot(dx, dy)
    const y0 = Math.max(path[i - 1].y, 1e-6)
    const y1 = Math.max(path[i].y, 1e-6)
    const v0 = Math.sqrt(2 * g * y0)
    const v1 = Math.sqrt(2 * g * y1)
    t += ds / ((v0 + v1) / 2)
  }
  return t
}

export const PATHS = ['cycloid', 'straight', 'arc'] as const
export type PathKind = (typeof PATHS)[number]

export function buildPath(kind: PathKind, bx: number, by: number, n = 200): Pt[] {
  if (kind === 'straight') return straightPath(bx, by, n)
  if (kind === 'arc') return arcPath(bx, by, n)
  return cycloidPath(bx, by, n)
}
