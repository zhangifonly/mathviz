/**
 * 平均曲率流（纯函数，便于测试）
 *
 * 让曲面上每一点沿法向以平均曲率 H 的速度移动：
 *   ∂X/∂t = −H·N
 *
 * 这是几何中的「热方程」：它把曲面越磨越光滑。Huisken 1984 年证明
 * 凸闭曲面在有限时间内收缩成一点，且形状趋于球形。
 *
 * 本实验用旋转曲面（母线 r(z)）做演示，此时流方程退化为母线上的一维演化：
 *   ∂r/∂t = r''/(1+r'²) − 1/r
 * 右端两项分别来自母线自身的弯曲与旋转带来的弯曲。
 *
 * 三条可验证性质：
 *   1. **球面自相似收缩**：半径为 R 的球面 H=2/R，故 dR/dt = −2/R，
 *      解得 R(t) = √(R₀²−4t)，在 t = R₀²/4 时缩成一点。
 *   2. **圆柱面在有限时间坍塌**：半径 R 的圆柱 H=1/R，dR/dt = −1/R，
 *      R(t) = √(R₀²−2t)，t = R₀²/2 时坍塌成一条线。
 *   3. **体积单调减少**：流总是让封闭曲面的体积变小。
 */

/** 球面在平均曲率流下的半径 R(t) = √(R₀²−4t) */
export function sphereRadius(t: number, r0 = 1): number {
  const v = r0 * r0 - 4 * t
  return v <= 0 ? 0 : Math.sqrt(v)
}

/** 球面收缩到点的时刻 t* = R₀²/4 */
export function sphereExtinctionTime(r0 = 1): number {
  return (r0 * r0) / 4
}

/** 圆柱面在平均曲率流下的半径 R(t) = √(R₀²−2t) */
export function cylinderRadius(t: number, r0 = 1): number {
  const v = r0 * r0 - 2 * t
  return v <= 0 ? 0 : Math.sqrt(v)
}

/** 圆柱坍塌成线的时刻 t* = R₀²/2 */
export function cylinderCollapseTime(r0 = 1): number {
  return (r0 * r0) / 2
}

/** 球面的平均曲率 H = 2/R（两个主曲率都是 1/R） */
export function sphereMeanCurvature(r: number): number {
  return r <= 0 ? Infinity : 2 / r
}

/** 圆柱的平均曲率 H = 1/R（一个主曲率 1/R，另一个为 0） */
export function cylinderMeanCurvature(r: number): number {
  return r <= 0 ? Infinity : 1 / r
}

export const PROFILE_POINTS = 96

/**
 * 母线的一步显式演化：∂r/∂t = r''/(1+r'²) − 1/r。
 * 用中心差分算 r' 与 r''，两端用单侧差分。
 * 半径被夹在一个下限以上，避免 1/r 在坍塌处发散。
 */
export function stepProfile(
  profile: number[], dz: number, dt: number, minR = 0.02,
): number[] {
  const n = profile.length
  const out = new Array<number>(n)
  for (let i = 0; i < n; i++) {
    const r = Math.max(minR, profile[i])
    const rm = Math.max(minR, profile[Math.max(0, i - 1)])
    const rp = Math.max(minR, profile[Math.min(n - 1, i + 1)])
    const d1 = (rp - rm) / (2 * dz)
    const d2 = (rp - 2 * r + rm) / (dz * dz)
    const speed = d2 / (1 + d1 * d1) - 1 / r
    out[i] = Math.max(0, r + dt * speed)
  }
  return out
}

/** 初始母线形状 */
export const INITIAL_SHAPES = ['sphere', 'cylinder', 'dumbbell', 'peanut'] as const
export type ShapeKind = (typeof INITIAL_SHAPES)[number]

export interface ShapeInfo {
  kind: ShapeKind
  label: string
  note: string
}

export const SHAPE_INFO: ShapeInfo[] = [
  { kind: 'sphere', label: '球面', note: '自相似收缩 · 形状不变' },
  { kind: 'cylinder', label: '圆柱面', note: '匀速细化 · 坍塌成线' },
  { kind: 'dumbbell', label: '哑铃', note: '细腰先断 · 奇点形成' },
  { kind: 'peanut', label: '花生', note: '腰部渐圆 · 趋于球形' },
]

/** 生成初始母线。z 从 -1 到 1，返回各点的半径 */
export function initialProfile(kind: ShapeKind, n = PROFILE_POINTS): number[] {
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    const z = -1 + (2 * i) / (n - 1)
    switch (kind) {
      case 'sphere':
        out.push(Math.sqrt(Math.max(0, 1 - z * z)))
        break
      case 'cylinder':
        out.push(0.6)
        break
      case 'dumbbell':
        // 两端粗中间极细 —— 会先在腰部形成奇点
        out.push(0.15 + 0.5 * z * z)
        break
      case 'peanut':
        // 腰部略细: z=0 处取 0.45−0.18=0.27, 两端取 0.45+0.18=0.63。
        // ⚠️ 符号写成 +0.2cos 会得到「中间粗两端细」的纺锤形, 不是花生。
        out.push(0.45 - 0.18 * Math.cos(Math.PI * z))
        break
    }
  }
  return out
}

/** 母线绕 z 轴旋转所得曲面的体积 V = π∫r²dz */
export function profileVolume(profile: number[], dz: number): number {
  return Math.PI * profile.reduce((s, r) => s + r * r * dz, 0)
}

/** 母线所得曲面的侧面积 A = 2π∫r√(1+r'²)dz */
export function profileArea(profile: number[], dz: number): number {
  let s = 0
  for (let i = 0; i < profile.length; i++) {
    const rm = profile[Math.max(0, i - 1)]
    const rp = profile[Math.min(profile.length - 1, i + 1)]
    const d1 = (rp - rm) / (2 * dz)
    s += profile[i] * Math.sqrt(1 + d1 * d1) * dz
  }
  return 2 * Math.PI * s
}

export function infoOf(kind: ShapeKind): ShapeInfo {
  return SHAPE_INFO.find((s) => s.kind === kind) ?? SHAPE_INFO[0]
}
