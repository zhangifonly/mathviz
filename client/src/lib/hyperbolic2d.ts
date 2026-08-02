/**
 * 双曲几何的共享内核：庞加莱圆盘模型（纯函数，便于测试）
 *
 * 双曲平面装进单位圆盘。圆盘内的点是「点」，垂直于边界圆的圆弧是「直线」
 * （测地线）。边界本身不属于这个平面 —— 它在无穷远处。
 *
 * 与球面几何形成对偶：
 *                球面        欧氏      双曲
 *   曲率 K        +1          0        −1
 *   内角和        > π        = π       < π
 *   面积       内角和 − π   与角无关   π − 内角和
 *   平行线        没有        唯一      无穷多条
 *
 * 面积公式 Area = π − (α+β+γ) 叫**角亏**，是球面盈余的镜像。
 * 推论：双曲三角形面积**有上界 π**（三角都趋于 0 时达到），欧氏三角形无上界。
 *
 * 度量：ds² = 4(dx²+dy²)/(1−r²)²，靠近边界时距离被无限放大。
 */

/** 圆盘上的点 */
export interface HPoint {
  x: number
  y: number
}

export function hypot2(p: HPoint): number {
  return Math.hypot(p.x, p.y)
}

/** 点是否在开圆盘内（边界不属于双曲平面） */
export function inDisk(p: HPoint, tol = 1e-9): boolean {
  return hypot2(p) < 1 - tol
}

/**
 * 双曲距离 d(p,q) = arcosh(1 + 2|p−q|²/((1−|p|²)(1−|q|²)))。
 * 靠近边界时分母趋零，距离趋于无穷。
 */
export function hyperbolicDistance(p: HPoint, q: HPoint): number {
  const dx = p.x - q.x
  const dy = p.y - q.y
  const dp = 1 - (p.x * p.x + p.y * p.y)
  const dq = 1 - (q.x * q.x + q.y * q.y)
  if (dp <= 0 || dq <= 0) return Infinity
  const arg = 1 + (2 * (dx * dx + dy * dy)) / (dp * dq)
  return Math.acosh(Math.max(1, arg))
}

/** 测地线：要么是过原点的直径，要么是垂直于边界的圆弧 */
export interface Geodesic {
  kind: 'diameter' | 'arc'
  /** 圆弧情形的圆心与半径 */
  cx: number
  cy: number
  r: number
}

/**
 * 过两点的测地线。
 *
 * 垂直于单位圆的条件是 |c|² = 1 + r²。设圆心 c=(cx,cy)，
 * 过 p、q 两点给出两个线性方程：
 *   2·cx·px + 2·cy·py = |p|² + 1
 *   2·cx·qx + 2·cy·qy = |q|² + 1
 * 解这个 2×2 线性系统即得圆心；半径由 r² = |c|² − 1 得到。
 *
 * 行列式趋零意味着两点与原点共线，此时测地线是直径。
 */
export function geodesicThrough(p: HPoint, q: HPoint): Geodesic {
  const a1 = 2 * p.x
  const b1 = 2 * p.y
  const c1 = p.x * p.x + p.y * p.y + 1
  const a2 = 2 * q.x
  const b2 = 2 * q.y
  const c2 = q.x * q.x + q.y * q.y + 1
  const det = a1 * b2 - a2 * b1
  if (Math.abs(det) < 1e-12) {
    return { kind: 'diameter', cx: 0, cy: 0, r: 0 }
  }
  const cx = (c1 * b2 - c2 * b1) / det
  const cy = (a1 * c2 - a2 * c1) / det
  const r2 = cx * cx + cy * cy - 1
  if (r2 <= 0) return { kind: 'diameter', cx: 0, cy: 0, r: 0 }
  return { kind: 'arc', cx, cy, r: Math.sqrt(r2) }
}

/** 测地线是否真的垂直于边界圆：|c|² − r² 应为 1 */
export function orthogonalityResidual(g: Geodesic): number {
  if (g.kind === 'diameter') return 0
  return Math.abs(g.cx * g.cx + g.cy * g.cy - g.r * g.r - 1)
}

/** 沿测地线从 p 到 q 采样（用于绘制） */
export function geodesicPath(p: HPoint, q: HPoint, steps = 60): HPoint[] {
  const g = geodesicThrough(p, q)
  if (g.kind === 'diameter') {
    const out: HPoint[] = []
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      out.push({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t })
    }
    return out
  }
  const a0 = Math.atan2(p.y - g.cy, p.x - g.cx)
  let a1 = Math.atan2(q.y - g.cy, q.x - g.cx)
  // 取短弧：跨越 π 时绕另一侧
  let d = a1 - a0
  while (d > Math.PI) d -= 2 * Math.PI
  while (d < -Math.PI) d += 2 * Math.PI
  a1 = a0 + d
  const out: HPoint[] = []
  for (let i = 0; i <= steps; i++) {
    const a = a0 + (a1 - a0) * (i / steps)
    out.push({ x: g.cx + g.r * Math.cos(a), y: g.cy + g.r * Math.sin(a) })
  }
  return out
}

/** 测地线在点 p 处的切方向（单位向量） */
export function geodesicTangent(p: HPoint, toward: HPoint): HPoint {
  const g = geodesicThrough(p, toward)
  if (g.kind === 'diameter') {
    const dx = toward.x - p.x
    const dy = toward.y - p.y
    const n = Math.hypot(dx, dy)
    return n < 1e-12 ? { x: 1, y: 0 } : { x: dx / n, y: dy / n }
  }
  // 圆的切向：半径向量转 90°，方向选朝着 toward 那一侧
  const rx = p.x - g.cx
  const ry = p.y - g.cy
  let tx = -ry
  let ty = rx
  const n = Math.hypot(tx, ty)
  tx /= n
  ty /= n
  // 若切向背离 toward，翻转
  if ((toward.x - p.x) * tx + (toward.y - p.y) * ty < 0) {
    tx = -tx
    ty = -ty
  }
  return { x: tx, y: ty }
}

/**
 * 双曲角：两条测地线在 p 点的夹角。
 *
 * 庞加莱圆盘是**共形模型**，即双曲角等于欧氏角。
 * 所以直接量两条切线的欧氏夹角即可 —— 这是这个模型最方便的性质。
 */
export function hyperbolicAngle(vertex: HPoint, a: HPoint, b: HPoint): number {
  const ta = geodesicTangent(vertex, a)
  const tb = geodesicTangent(vertex, b)
  const cosv = ta.x * tb.x + ta.y * tb.y
  return Math.acos(Math.max(-1, Math.min(1, cosv)))
}

export interface HTriangle {
  A: HPoint
  B: HPoint
  C: HPoint
}

/** 三个内角 */
export function triangleAngles(t: HTriangle): [number, number, number] {
  return [
    hyperbolicAngle(t.A, t.B, t.C),
    hyperbolicAngle(t.B, t.C, t.A),
    hyperbolicAngle(t.C, t.A, t.B),
  ]
}

/** 内角和 */
export function angleSum(t: HTriangle): number {
  return triangleAngles(t).reduce((s, a) => s + a, 0)
}

/**
 * 角亏 = π − 内角和。在双曲平面上恒为正，且等于面积。
 * 这是球面盈余的镜像（球面上是 内角和 − π）。
 */
export function angularDefect(t: HTriangle): number {
  return Math.PI - angleSum(t)
}

/** 面积 = 角亏（高斯–博内定理在 K=−1 下的形式） */
export function triangleArea(t: HTriangle): number {
  return angularDefect(t)
}

/** 三条边的双曲长度 */
export function triangleSides(t: HTriangle): [number, number, number] {
  return [
    hyperbolicDistance(t.B, t.C),
    hyperbolicDistance(t.C, t.A),
    hyperbolicDistance(t.A, t.B),
  ]
}

/** 双曲三角形面积的上界 π（三角趋于零时达到） */
export const MAX_TRIANGLE_AREA = Math.PI

/**
 * 双曲余弦定理：cosh c = cosh a·cosh b − sinh a·sinh b·cos C。
 * 注意与球面版本的差别：三角函数换成双曲函数，且中间是减号。
 * 返回等式两端之差，应为 0。
 */
export function cosineRuleResidual(t: HTriangle): number {
  const [a, b, c] = triangleSides(t)
  const C = triangleAngles(t)[2]
  const lhs = Math.cosh(c)
  const rhs = Math.cosh(a) * Math.cosh(b) - Math.sinh(a) * Math.sinh(b) * Math.cos(C)
  return Math.abs(lhs - rhs)
}

/**
 * 双曲勾股定理：直角三角形（C=π/2）满足 cosh c = cosh a·cosh b。
 * 与球面版 cos c = cos a·cos b 形式相同，只是 cos 换成 cosh。
 */
export function pythagoreanResidual(a: number, b: number, c: number): number {
  return Math.abs(Math.cosh(c) - Math.cosh(a) * Math.cosh(b))
}

/** 圆盘上的圆周长：双曲半径 r 的圆周长为 2π·sinh r（欧氏是 2πr） */
export function circleCircumference(r: number): number {
  return 2 * Math.PI * Math.sinh(r)
}

/** 双曲圆面积：2π(cosh r − 1)（欧氏是 πr²） */
export function circleArea(r: number): number {
  return 2 * Math.PI * (Math.cosh(r) - 1)
}

/** 欧氏对照 */
export function euclideanCircumference(r: number): number {
  return 2 * Math.PI * r
}

export function euclideanCircleArea(r: number): number {
  return Math.PI * r * r
}
