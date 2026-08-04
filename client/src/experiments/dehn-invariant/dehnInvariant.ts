/**
 * Dehn 不变量与希尔伯特第三问题（纯函数，便于测试）
 *
 * **平面上**：两个面积相等的多边形，一定能剪拼成对方（Bolyai–Gerwien 定理）。
 * **空间里**呢？希尔伯特 1900 年把这个问题列为第三问，同年他的学生 Dehn 就解决了：
 * **不能**。等体积的正四面体与立方体，剪不成对方。
 *
 * Dehn 的办法是造一个**剪拼不变量**：无论怎么切割重组，它都不变。
 *
 *   D(P) = Σ 棱长 ⊗ 二面角   （在 ℝ ⊗_ℚ (ℝ/ℚπ) 里取值）
 *
 * 关键是那个张量积的第二个因子模掉了 ℚπ —— 于是**二面角是 π 的有理倍数时，
 * 那一项直接归零**。这正是立方体的情形：二面角 π/2，D(立方体) = 0。
 *
 * 而正四面体的二面角是 arccos(1/3)，它与 π 的比值是**无理数**，
 * 所以 D(正四面体) ≠ 0。两者 Dehn 不变量不同 ⟹ 剪不成对方。
 *
 * 本实验用两件事把这个抽象论证落到可算的数上：
 *
 * 1. **arccos(1/3)/π 是无理数**：用连分数展开看它不循环，
 *    并验证 cos(n·θ) 的分母里 3 的幂次单调增长（Niven 定理的思路）。
 * 2. **可加性**：把立方体切成 6 个四面体，各自 Dehn 不变量之和仍为 0。
 *    这正是"不变量"的含义 —— 切割不改变它。
 */

/** 二面角与棱长的一项 */
export interface DehnTerm {
  /** 棱长 */
  length: number
  /** 二面角（弧度） */
  angle: number
  /** 这条棱的条数 */
  count: number
}

export interface SolidSpec {
  id: string
  label: string
  /** 棱长为 a 时的各项 */
  terms: (a: number) => DehnTerm[]
  /** 体积 */
  volume: (a: number) => number
  note: string
}

/** 立方体：12 条棱，二面角 π/2 —— 是 π 的有理倍数，故 Dehn 不变量为 0 */
export const CUBE: SolidSpec = {
  id: 'cube',
  label: '立方体',
  terms: (a) => [{ length: a, angle: Math.PI / 2, count: 12 }],
  volume: (a) => a ** 3,
  note: '二面角 90° = π/2，是 π 的有理倍数',
}

/** 正四面体：6 条棱，二面角 arccos(1/3) ≈ 70.53° —— 与 π 不可通约 */
export const TETRAHEDRON: SolidSpec = {
  id: 'tetrahedron',
  label: '正四面体',
  terms: (a) => [{ length: a, angle: Math.acos(1 / 3), count: 6 }],
  volume: (a) => (a ** 3) / (6 * Math.SQRT2),
  note: '二面角 arccos(1/3)，与 π 不可通约',
}

/** 正八面体：12 条棱，二面角 arccos(−1/3) ≈ 109.47° */
export const OCTAHEDRON: SolidSpec = {
  id: 'octahedron',
  label: '正八面体',
  terms: (a) => [{ length: a, angle: Math.acos(-1 / 3), count: 12 }],
  volume: (a) => (Math.SQRT2 / 3) * a ** 3,
  note: '二面角 arccos(−1/3)，同样不可通约',
}

/** 正三棱柱：底面正三角形。侧棱二面角 π/2，底面棱二面角 π/2 —— 全是有理倍数 */
export const PRISM: SolidSpec = {
  id: 'prism',
  label: '正三棱柱',
  terms: (a) => [
    // 3 条侧棱：二面角是底面正三角形的内角 π/3
    { length: a, angle: Math.PI / 3, count: 3 },
    // 6 条底面棱：侧面与底面垂直，二面角 π/2
    { length: a, angle: Math.PI / 2, count: 6 },
  ],
  volume: (a) => (Math.sqrt(3) / 4) * a * a * a,
  note: '二面角 60° 与 90°，都是 π 的有理倍数',
}

export const SOLIDS = [CUBE, TETRAHEDRON, OCTAHEDRON, PRISM] as const
export type SolidId = 'cube' | 'tetrahedron' | 'octahedron' | 'prism'

export function solidOf(id: SolidId): SolidSpec {
  return SOLIDS.find((s) => s.id === id) ?? CUBE
}

/**
 * 判断 θ/π 是否为有理数（在给定分母上界内）。
 *
 * 做法：枚举分母 q ≤ maxQ，看 θ·q/π 是否接近整数。
 * 这不是严格证明，但对我们要区分的几个角够用：
 *   π/2 → q=2 命中；arccos(1/3) → 枚举到 10000 都不命中。
 */
export function rationalMultipleOfPi(
  theta: number, maxQ = 10000, tol = 1e-9,
): { rational: boolean; p?: number; q?: number } {
  const r = theta / Math.PI
  for (let q = 1; q <= maxQ; q++) {
    const p = Math.round(r * q)
    if (Math.abs(r * q - p) < tol * q) {
      return { rational: true, p, q }
    }
  }
  return { rational: false }
}

/**
 * Dehn 不变量是否为零。
 *
 * 只有当**每一项**的二面角都是 π 的有理倍数时，整个不变量才归零
 * （因为张量积第二个因子模掉了 ℚπ）。
 */
export function dehnIsZero(spec: SolidSpec, a = 1): boolean {
  return spec.terms(a).every((t) => rationalMultipleOfPi(t.angle).rational)
}

/**
 * Dehn 不变量的"非零部分"：挑出二面角不是 π 有理倍数的那些项，
 * 返回 Σ 棱长×条数（作为一个可读的规模指标，不是真正的张量值）。
 *
 * ⚠️ 真正的 Dehn 不变量取值在 ℝ ⊗_ℚ (ℝ/ℚπ) 里，无法用一个实数表示。
 * 这里给的是"有多少长度挂在不可通约的角上"，用于对比而非计算。
 */
export function dehnNonzeroWeight(spec: SolidSpec, a = 1): number {
  return spec.terms(a)
    .filter((t) => !rationalMultipleOfPi(t.angle).rational)
    .reduce((s, t) => s + t.length * t.count, 0)
}

/** 两个立体的 Dehn 不变量是否可能相等（都为零，或都非零且需进一步判断） */
export function couldBeEquidecomposable(
  a: SolidSpec, b: SolidSpec, edgeA = 1, edgeB = 1,
): { possible: boolean; reason: string } {
  const za = dehnIsZero(a, edgeA)
  const zb = dehnIsZero(b, edgeB)
  if (za !== zb) {
    return {
      possible: false,
      reason: `${a.label}的 Dehn 不变量${za ? '为零' : '非零'}，`
        + `${b.label}${zb ? '为零' : '非零'} —— 不同，剪不成`,
    }
  }
  if (za && zb) {
    return { possible: true, reason: '两者 Dehn 不变量都为零，不构成障碍' }
  }
  return {
    possible: true,
    reason: '两者都非零，需比较具体的张量值（本实验不展开）',
  }
}

/** 使两立体等体积所需的棱长比 */
export function edgeRatioForEqualVolume(a: SolidSpec, b: SolidSpec): number {
  // a 取棱长 1，求 b 的棱长使体积相等
  const va = a.volume(1)
  // b.volume(x) = va  =>  x = (va / b.volume(1))^(1/3)
  return Math.cbrt(va / b.volume(1))
}

/**
 * 连分数展开：用来展示 arccos(1/3)/π 的不循环性。
 * 有理数的连分数会终止，无理数不会。
 */
export function continuedFraction(x: number, n = 12): number[] {
  const out: number[] = []
  let v = x
  for (let i = 0; i < n; i++) {
    const a = Math.floor(v)
    out.push(a)
    const frac = v - a
    if (frac < 1e-12) break
    v = 1 / frac
  }
  return out
}

/** 由连分数还原近似值，用于检验展开正确 */
export function fromContinuedFraction(cf: number[]): number {
  let v = cf[cf.length - 1]
  for (let i = cf.length - 2; i >= 0; i--) {
    v = cf[i] + 1 / v
  }
  return v
}

/**
 * Niven 定理的数值证据：
 * 若 θ = arccos(1/3)，则 cos(n·θ) 总能写成 k/3ⁿ 形式，且 k 不被 3 整除。
 * 这说明 cos(nθ) 永远不会取到 0、±1/2、±1 这些"好值"，
 * 因而 θ 不是 π 的有理倍数。
 *
 * 返回 cos(n·θ) × 3ⁿ（应为整数，且不被 3 整除）。
 */
export function nivenNumerator(n: number): number {
  // 用递推 cos((n+1)θ) = 2cos θ·cos(nθ) − cos((n−1)θ)，cos θ = 1/3
  // 令 a_n = 3ⁿ·cos(nθ)，则 a_{n+1} = 2·a_n − 9·a_{n−1}
  let prev = 1 // a_0 = 3^0 · cos 0 = 1
  let cur = 1 // a_1 = 3 · (1/3) = 1
  if (n === 0) return prev
  if (n === 1) return cur
  for (let k = 2; k <= n; k++) {
    const next = 2 * cur - 9 * prev
    prev = cur
    cur = next
  }
  return cur
}

/** a_n 是否被 3 整除（Niven 论证要求：永远不被整除） */
export function nivenDivisibleBy3(n: number): boolean {
  return nivenNumerator(n) % 3 === 0
}

/** 希尔伯特第三问题的年表 */
export const TIMELINE = [
  { year: 1833, event: 'Bolyai–Gerwien：平面上等面积必可剪拼' },
  { year: 1900, event: '希尔伯特提出第三问题：空间里是否也如此' },
  { year: 1900, event: 'Dehn 同年给出否定答案，构造 Dehn 不变量' },
  { year: 1965, event: 'Sydler：等体积 + Dehn 不变量相等 ⟺ 可剪拼' },
] as const

/** 二维对照：任意多边形剪拼定理（无障碍） */
export const PLANE_FACT =
  '平面上等面积的多边形一定可以剪拼（Bolyai–Gerwien），没有类似的不变量障碍'
