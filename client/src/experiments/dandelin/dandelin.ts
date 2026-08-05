/**
 * Dandelin 双球（纯函数，便于测试）
 *
 * 「用平面斜切圆锥，切口是椭圆」—— 这句话人人都听过，但**为什么**是椭圆？
 * 凭什么切口上每个点到两个定点的距离之和恒定？
 *
 * 1822 年 Dandelin 给出了一个不需要坐标计算的漂亮证明：
 * 在圆锥内部塞进**两个球**，让它们同时与圆锥面相切、与切平面相切。
 * 这两个球与切平面的切点，就是椭圆的两个焦点。
 *
 * 证明的核心是一条初等事实：**从锥外一点到球的所有切线段等长**。
 *
 *   设 P 是切口上任一点，母线过 P 交上球于 T₁、交下球于 T₂。
 *   PF₁ = PT₁（都是从 P 到上球的切线段）
 *   PF₂ = PT₂（都是从 P 到下球的切线段）
 *   于是 PF₁ + PF₂ = PT₁ + PT₂ = T₁T₂
 *
 * 而 T₁T₂ 是母线上被两个切圆截出的那一段 —— 它**与 P 无关**（对一切母线都等长）。
 * 所以距离之和恒定，切口就是椭圆，Q.E.D.
 *
 * 本实验把这个论证逐步数值验证：内切球半径、焦点位置、切线段等长、
 * 以及最关键的「PF₁ + PF₂ = 2a 与 P 无关」。
 *
 * 圆锥取顶点在原点、沿 +z 张开、半顶角 α：
 *   点 (x,y,z) 在锥面上 ⟺ √(x²+y²) = z·tan α
 */

/** 三维点 */
export type P3 = [number, number, number]

export function sub(a: P3, b: P3): P3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function dot(a: P3, b: P3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

export function norm(a: P3): number {
  return Math.hypot(a[0], a[1], a[2])
}

export function dist(a: P3, b: P3): number {
  return norm(sub(a, b))
}

export function scale(a: P3, k: number): P3 {
  return [a[0] * k, a[1] * k, a[2] * k]
}

export function add(a: P3, b: P3): P3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

/**
 * 配置：半顶角 α，切平面的倾角 θ 与高度 h。
 *
 * 切平面取过点 (0,0,h)、法向在 xz 平面内、与 z 轴夹角为 θ 的平面。
 * θ = 0 给水平面（切口是圆），θ 增大切口拉长成椭圆。
 * θ 必须小于 π/2 − α，否则平面会与锥面平行或相交成抛物线/双曲线。
 */
export interface ConeCut {
  /** 半顶角（弧度），0 < α < π/2 */
  alpha: number
  /** 切平面倾角（弧度） */
  theta: number
  /** 切平面在 z 轴上的截距 */
  h: number
}

/** 切平面的单位法向：在 xz 平面内，与 z 轴成 θ */
export function planeNormal(cut: ConeCut): P3 {
  return [Math.sin(cut.theta), 0, Math.cos(cut.theta)]
}

/** 切平面上一点（z 轴截距点） */
export function planePoint(cut: ConeCut): P3 {
  return [0, 0, cut.h]
}

/** 点到切平面的有向距离 */
export function planeDistance(p: P3, cut: ConeCut): number {
  return dot(sub(p, planePoint(cut)), planeNormal(cut))
}

/** 切口是椭圆的条件：倾角小于 π/2 − α */
export function isEllipse(cut: ConeCut): boolean {
  return cut.theta < Math.PI / 2 - cut.alpha - 1e-12
}

/**
 * 内切球：球心在 z 轴上 (0,0,c)，与锥面相切时半径 r = c·sin α。
 * 再要求与切平面相切：|planeDistance| = r，解出 c。
 *
 * 两个解对应上下两个球（切平面两侧各一个）。
 */
export interface Sphere {
  center: P3
  radius: number
}

/**
 * 解出两个 Dandelin 球。
 *
 * 球心 (0,0,c)、半径 c·sin α。到平面距离为
 *   d(c) = (c − h)·cos θ    （因为法向在 xz 平面内，球心在 z 轴上）
 * 相切条件 |d(c)| = c·sin α 给出两支：
 *   (c − h)cos θ = +c sin α  →  c = h·cos θ / (cos θ − sin α)   上球
 *   (c − h)cos θ = −c sin α  →  c = h·cos θ / (cos θ + sin α)   下球
 */
export function dandelinSpheres(cut: ConeCut): [Sphere, Sphere] {
  const { alpha, theta, h } = cut
  const ct = Math.cos(theta)
  const sa = Math.sin(alpha)
  const cUpper = (h * ct) / (ct - sa)
  const cLower = (h * ct) / (ct + sa)
  return [
    { center: [0, 0, cUpper], radius: cUpper * sa },
    { center: [0, 0, cLower], radius: cLower * sa },
  ]
}

/**
 * 球与切平面的切点 = 球心沿平面法向投影到平面上的点。
 * 这两个点就是椭圆的焦点 —— 这是整个证明的结论。
 */
export function tangencyPoint(s: Sphere, cut: ConeCut): P3 {
  const n = planeNormal(cut)
  const d = planeDistance(s.center, cut)
  // 球心朝平面移动 d，落到平面上
  return sub(s.center, scale(n, d))
}

/** 两个焦点 */
export function foci(cut: ConeCut): [P3, P3] {
  const [up, low] = dandelinSpheres(cut)
  return [tangencyPoint(up, cut), tangencyPoint(low, cut)]
}

/**
 * 母线方向：绕 z 轴方位角 φ 处的单位母线方向。
 * 锥面上的点可写成 t·dir(φ)，t ≥ 0 是到顶点的距离。
 */
export function generatrixDir(alpha: number, phi: number): P3 {
  const sa = Math.sin(alpha)
  const ca = Math.cos(alpha)
  return [sa * Math.cos(phi), sa * Math.sin(phi), ca]
}

/**
 * 母线与切平面的交点：即切口（椭圆）上方位角 φ 处的点。
 *
 * 解 dot(t·dir − planePoint, n) = 0 得 t = dot(planePoint, n) / dot(dir, n)。
 */
export function cutPoint(cut: ConeCut, phi: number): P3 | null {
  const dir = generatrixDir(cut.alpha, phi)
  const n = planeNormal(cut)
  const denom = dot(dir, n)
  if (Math.abs(denom) < 1e-12) return null
  const t = dot(planePoint(cut), n) / denom
  if (t <= 0) return null
  return scale(dir, t)
}

/** 切口曲线采样 */
export function cutCurve(cut: ConeCut, steps = 180): P3[] {
  const out: P3[] = []
  for (let i = 0; i < steps; i++) {
    const p = cutPoint(cut, (2 * Math.PI * i) / steps)
    if (p) out.push(p)
  }
  return out
}

/**
 * 球与锥面的切圆：球心高度 c 处，切圆在高度 c·cos²α 的平面上，
 * 半径 c·sin α·cos α。（对锥面上的切点做垂足计算即得）
 *
 * 返回切圆的圆心高度与半径。
 */
export function tangentCircle(s: Sphere, alpha: number): {
  z: number; radius: number
} {
  const c = s.center[2]
  const ca = Math.cos(alpha)
  const sa = Math.sin(alpha)
  return { z: c * ca * ca, radius: c * sa * ca }
}

/**
 * 母线上被两切圆截出的线段长 T₁T₂ —— 证明的关键量。
 * 沿母线的参数 t 就是到顶点的距离，切点处 t = c·cos α。
 * 所以 T₁T₂ = |c_upper − c_lower|·cos α，**与方位角 φ 无关**。
 */
export function generatrixSegment(cut: ConeCut): number {
  const [up, low] = dandelinSpheres(cut)
  return Math.abs(up.center[2] - low.center[2]) * Math.cos(cut.alpha)
}

/** 切点在母线 φ 上的位置（到顶点距离 c·cos α） */
export function tangentPointOnGeneratrix(
  s: Sphere, alpha: number, phi: number,
): P3 {
  const t = s.center[2] * Math.cos(alpha)
  return scale(generatrixDir(alpha, phi), t)
}

/**
 * 焦距和：切口上点 P 到两焦点的距离之和。
 * Dandelin 的结论是它恒等于 generatrixSegment，与 P 无关。
 */
export function focalSum(cut: ConeCut, phi: number): number {
  const p = cutPoint(cut, phi)
  if (!p) return NaN
  const [f1, f2] = foci(cut)
  return dist(p, f1) + dist(p, f2)
}

/** 焦距和在整条曲线上的最大偏差（应为 0） */
export function focalSumSpread(cut: ConeCut, steps = 240): number {
  const vals: number[] = []
  for (let i = 0; i < steps; i++) {
    const v = focalSum(cut, (2 * Math.PI * i) / steps)
    if (Number.isFinite(v)) vals.push(v)
  }
  if (vals.length === 0) return Infinity
  return Math.max(...vals) - Math.min(...vals)
}

/**
 * 切线段等长：从切口上点 P 到球的两条切线段
 * （一条到平面切点 F，一条到锥面切点 T）应等长。
 * 返回 |PF − PT|，应为 0。
 */
export function tangentLengthGap(
  cut: ConeCut, phi: number, upper: boolean,
): number {
  const p = cutPoint(cut, phi)
  if (!p) return NaN
  const [up, low] = dandelinSpheres(cut)
  const s = upper ? up : low
  const f = tangencyPoint(s, cut)
  const t = tangentPointOnGeneratrix(s, cut.alpha, phi)
  return Math.abs(dist(p, f) - dist(p, t))
}

/**
 * 切线段长度的解析值：√(|PO|² − r²)，O 是球心。
 * 用它独立校验上面两条切线段。
 */
export function tangentLengthAnalytic(p: P3, s: Sphere): number {
  const d2 = dist(p, s.center) ** 2 - s.radius ** 2
  return Math.sqrt(Math.max(0, d2))
}

/** 椭圆的长半轴 a = 焦距和 / 2 */
export function semiMajor(cut: ConeCut): number {
  return generatrixSegment(cut) / 2
}

/** 两焦点距离的一半 c */
export function focalHalfDistance(cut: ConeCut): number {
  const [f1, f2] = foci(cut)
  return dist(f1, f2) / 2
}

/** 短半轴 b = √(a² − c²) */
export function semiMinor(cut: ConeCut): number {
  const a = semiMajor(cut)
  const c = focalHalfDistance(cut)
  return Math.sqrt(Math.max(0, a * a - c * c))
}

/** 离心率 e = c / a */
export function eccentricity(cut: ConeCut): number {
  return focalHalfDistance(cut) / semiMajor(cut)
}

/**
 * 离心率的解析式：e = sin θ / cos α。
 * θ = 0 给 e = 0（圆）；θ → π/2 − α 时 e → 1（抛物线临界）。
 */
export function eccentricityAnalytic(cut: ConeCut): number {
  return Math.sin(cut.theta) / Math.cos(cut.alpha)
}

/** 预设配置 */
export const PRESETS = [
  { id: 'circle', label: '水平切（圆）', alpha: 0.42, theta: 0, h: 3 },
  { id: 'mild', label: '轻微倾斜', alpha: 0.42, theta: 0.3, h: 3 },
  { id: 'strong', label: '明显倾斜', alpha: 0.42, theta: 0.7, h: 3 },
  { id: 'extreme', label: '接近抛物线', alpha: 0.42, theta: 1.05, h: 3 },
  { id: 'narrow', label: '窄圆锥', alpha: 0.25, theta: 0.6, h: 3 },
  { id: 'wide', label: '宽圆锥', alpha: 0.6, theta: 0.5, h: 3 },
] as const

export type PresetId = (typeof PRESETS)[number]['id']

export function presetOf(id: PresetId): ConeCut {
  const p = PRESETS.find((x) => x.id === id) ?? PRESETS[1]
  return { alpha: p.alpha, theta: p.theta, h: p.h }
}

/** 证明的三个步骤（用于讲解与面板） */
export const PROOF_STEPS = [
  {
    step: 1,
    claim: '从锥外一点到球的所有切线段等长',
    detail: '初等立体几何：切线段 = √(|PO|² − r²)，只依赖 P 与球心距离',
  },
  {
    step: 2,
    claim: 'PF₁ = PT₁ 且 PF₂ = PT₂',
    detail: 'F 是球与平面的切点，T 是球与锥面的切点，都是从 P 出发的切线段',
  },
  {
    step: 3,
    claim: 'PF₁ + PF₂ = T₁T₂ 与 P 无关',
    detail: 'T₁T₂ 是母线被两切圆截出的段，对每条母线都等长 ⟹ 切口是椭圆',
  },
] as const
