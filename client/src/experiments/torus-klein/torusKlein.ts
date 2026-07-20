/**
 * 环面与克莱因瓶核心算法（纯函数，便于测试）
 *
 * 把一个正方形的边按不同规则粘合：
 *  - 两对边都同向粘合 -> 环面 torus
 *  - 一对同向、一对反向粘合 -> 克莱因瓶 klein
 * 这里给出真实的参数曲面方程，并做正交投影到 2D。
 */

export type Surface = 'torus' | 'klein'
export const SURFACES: Surface[] = ['torus', 'klein']

export interface Vec3 {
  x: number
  y: number
  z: number
}

/** 环面参数点：大半径 R、小半径 r，u,v ∈ [0,2π) */
export function torusPoint(u: number, v: number, R = 2, r = 0.8): Vec3 {
  const cu = Math.cos(u)
  const su = Math.sin(u)
  return {
    x: (R + r * Math.cos(v)) * cu,
    y: (R + r * Math.cos(v)) * su,
    z: r * Math.sin(v),
  }
}

/**
 * 克莱因瓶的经典“8字形”浸入参数式，u,v ∈ [0,2π)。
 * 沿 u 方向绕一圈时截面翻转半周，实现一对边的反向粘合。
 */
export function kleinPoint(u: number, v: number, R = 2, r = 0.9): Vec3 {
  const cu2 = Math.cos(u / 2)
  const su2 = Math.sin(u / 2)
  const sv = Math.sin(v)
  const s2v = Math.sin(2 * v)
  const rad = R + r * (cu2 * sv - su2 * s2v)
  return {
    x: rad * Math.cos(u),
    y: rad * Math.sin(u),
    z: r * (su2 * sv + cu2 * s2v),
  }
}

/** 按曲面类型取参数点 */
export function surfacePoint(kind: Surface, u: number, v: number): Vec3 {
  return kind === 'torus' ? torusPoint(u, v) : kleinPoint(u, v)
}

/**
 * 绕 Y 轴再绕 X 轴旋转后正交投影到 2D（返回归一化前的相机坐标）。
 * angle 为绕 Y 轴角度，tilt 为绕 X 轴俯仰角。
 */
export function project(p: Vec3, angle: number, tilt: number): { x: number; y: number; depth: number } {
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)
  const x1 = p.x * ca + p.z * sa
  const z1 = -p.x * sa + p.z * ca
  const ct = Math.cos(tilt)
  const st = Math.sin(tilt)
  const y2 = p.y * ct - z1 * st
  const z2 = p.y * st + z1 * ct
  return { x: x1, y: y2, depth: z2 }
}

/** 是否可定向：环面可定向，克莱因瓶不可定向 */
export function isOrientable(kind: Surface): boolean {
  return kind === 'torus'
}

/** 生成参数网格线上的采样点，n 段一圈 */
export function gridCurve(kind: Surface, fixed: 'u' | 'v', t: number, n: number): Vec3[] {
  const pts: Vec3[] = []
  const two = Math.PI * 2
  for (let i = 0; i <= n; i++) {
    const s = (i / n) * two
    pts.push(fixed === 'u' ? surfacePoint(kind, t, s) : surfacePoint(kind, s, t))
  }
  return pts
}
