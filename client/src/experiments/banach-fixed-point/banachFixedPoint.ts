/**
 * Banach 不动点定理（压缩映射原理）
 *
 * 项目里「不动点迭代」那课讲了一维的收敛条件 |g'(x*)| < 1, 画了蛛网图,
 * 但停在那儿了。它没说三件更要紧的事:
 *
 *   1. 不动点**存在**吗? (那课默认它存在, 只讨论迭代收不收敛)
 *   2. 不动点**唯一**吗?
 *   3. 迭代 n 步之后, 误差**至多**是多少? 能不能事先算出来?
 *
 * Banach 定理一次回答全部三个。设 T 是完备度量空间到自身的映射, 且
 *
 *   d(Tx, Ty) ≤ q · d(x, y)   对某个 q < 1 恒成立   ——「压缩」
 *
 * 则 T 有且仅有一个不动点 x*, 任何初值迭代都收敛到它, 而且
 *
 *   d(x_n, x*) ≤ q^n / (1−q) · d(x_1, x_0)        ——**先验**误差界
 *
 * 最后这条是它最实用的地方: 只要量出第一步走了多远, 就能事先算出
 * "迭代多少次够用", 不必真的迭代完再看。本课实测这个界成立且不松:
 * q=0.42 时 n=10 的实际误差 4.88e−4, 界给 7.34e−4。
 *
 * ⚠️ **压缩是充分条件, 不是必要条件**。这一点课里明说, 因为很容易
 * 记反。线性映射 T(x)=Ax+b 收不收敛, 由**谱半径** ρ(A) 决定, 而
 * 压缩要求的是**范数** ‖A‖ < 1。两者可以差很多:
 *
 *   A = [[0.5, 3], [0, 0.5]]  ‖A‖₂ = 3.08 > 1（不是压缩）
 *                             ρ(A) = 0.5 < 1（照样收敛）
 *
 * 实测这个例子 60 步后误差精确为 0。所以"不满足压缩条件"不等于
 * "不收敛" —— 只是 Banach 定理用不上, 得换别的工具。
 *
 * 3D 用在哪: 二维映射的迭代轨迹是平面上的折线, 但**误差随步数的衰减**
 * 是第三个维度。把 (x, y, 步数) 画成空间折线, 就能同时看到"往哪走"
 * 和"走多快"; 再叠上 q^n 的理论包络, 界紧不紧一眼可辨。
 */

export type Vec2 = [number, number];
export type Mat2 = [[number, number], [number, number]];

export function matVec(A: Mat2, v: Vec2): Vec2 {
  return [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]];
}

export function add2(a: Vec2, b: Vec2): Vec2 {
  return [a[0] + b[0], a[1] + b[1]];
}

export function sub2(a: Vec2, b: Vec2): Vec2 {
  return [a[0] - b[0], a[1] - b[1]];
}

export function norm2(v: Vec2): number {
  return Math.hypot(v[0], v[1]);
}

/** 仿射映射 T(x) = A x + b。 */
export function applyMap(A: Mat2, b: Vec2, x: Vec2): Vec2 {
  return add2(matVec(A, x), b);
}

/**
 * 谱范数 ‖A‖₂ = 最大奇异值 = √(λ_max(AᵀA))。
 * 2×2 时有闭式, 不必上迭代法。
 */
export function spectralNorm(A: Mat2): number {
  const a = A[0][0];
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1];
  // AᵀA 的两个特征值
  const m00 = a * a + c * c;
  const m01 = a * b + c * d;
  const m11 = b * b + d * d;
  const tr = m00 + m11;
  const det = m00 * m11 - m01 * m01;
  const disc = Math.max(0, (tr * tr) / 4 - det);
  return Math.sqrt(Math.max(0, tr / 2 + Math.sqrt(disc)));
}

/**
 * 谱半径 ρ(A) = 特征值模长的最大值。
 * 2×2 的特征值由 λ² − tr·λ + det = 0 给出, 判别式为负时是共轭复根,
 * 此时两根模长都是 √det。
 */
export function spectralRadius(A: Mat2): number {
  const tr = A[0][0] + A[1][1];
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  const disc = (tr * tr) / 4 - det;
  if (disc >= 0) {
    const r = Math.sqrt(disc);
    return Math.max(Math.abs(tr / 2 + r), Math.abs(tr / 2 - r));
  }
  // 复根: 模长 = √|det|
  return Math.sqrt(Math.abs(det));
}

/** 是否满足 Banach 的压缩条件(在 2-范数下)。 */
export function isContraction(A: Mat2): boolean {
  return spectralNorm(A) < 1;
}

/**
 * 不动点 x* = (I − A)⁻¹ b。
 * I−A 奇异时无解(或有无穷多解), 返回 null。
 */
export function fixedPoint(A: Mat2, b: Vec2): Vec2 | null {
  const m00 = 1 - A[0][0];
  const m01 = -A[0][1];
  const m10 = -A[1][0];
  const m11 = 1 - A[1][1];
  const det = m00 * m11 - m01 * m10;
  if (Math.abs(det) < 1e-12) return null;
  return [
    (m11 * b[0] - m01 * b[1]) / det,
    (-m10 * b[0] + m00 * b[1]) / det,
  ];
}

/** 迭代轨迹 x₀, x₁, …, x_n。 */
export function orbit(A: Mat2, b: Vec2, x0: Vec2, steps: number): Vec2[] {
  const out: Vec2[] = [x0];
  let x = x0;
  for (let i = 0; i < steps; i++) {
    x = applyMap(A, b, x);
    if (!Number.isFinite(x[0]) || !Number.isFinite(x[1]) || norm2(x) > 1e12) break;
    out.push(x);
  }
  return out;
}

/** 每一步到不动点的距离。不动点不存在时返回空数组。 */
export function errorSequence(A: Mat2, b: Vec2, x0: Vec2, steps: number): number[] {
  const star = fixedPoint(A, b);
  if (!star) return [];
  return orbit(A, b, x0, steps).map((x) => norm2(sub2(x, star)));
}

/**
 * Banach 的**先验**误差界: d(x_n, x*) ≤ q^n/(1−q) · d(x₁, x₀)。
 *
 * "先验"的意思是: 只用第一步的位移就能算出来, 不需要知道不动点在哪,
 * 也不需要真的迭代下去。这正是它在工程上最有用的地方 ——
 * 事先就能回答"要迭代多少次"。
 *
 * ⚠️ q ≥ 1 时定理不适用, 返回 Infinity 而不是硬算一个数。
 */
export function aPrioriBound(A: Mat2, b: Vec2, x0: Vec2, n: number): number {
  const q = spectralNorm(A);
  if (q >= 1) return Infinity;
  const d1 = norm2(sub2(applyMap(A, b, x0), x0));
  return (Math.pow(q, n) / (1 - q)) * d1;
}

/**
 * 达到给定精度所需的步数, 由先验界反解:
 *   q^n/(1−q)·d₁ ≤ tol  ⇒  n ≥ log(tol(1−q)/d₁) / log q
 */
/*
 * ⚠️ 这个估计是**保守**的, q 越接近 1 越保守。
 * 实测「弱压缩」(q=0.9919)要 tol=1e−3 时算出 n=1400, 而实际误差在
 * n=387 就已跌破 1e−3 —— 保守了 3.6 倍。
 * 原因是先验界只用了第一步的位移, 看不到后面实际收得更快。想要更紧
 * 就得用后验界, 但那必须先迭代到第 n 步才算得出来。
 */
export function stepsNeeded(A: Mat2, b: Vec2, x0: Vec2, tol: number): number | null {
  const q = spectralNorm(A);
  if (q >= 1 || q <= 0) return null;
  const d1 = norm2(sub2(applyMap(A, b, x0), x0));
  if (d1 <= tol) return 0;
  return Math.ceil(Math.log((tol * (1 - q)) / d1) / Math.log(q));
}

/**
 * 后验误差界: d(x_n, x*) ≤ q/(1−q) · d(x_n, x_{n−1})。
 * 比先验界紧得多, 但要迭代到第 n 步才知道。两者本课都给出对照。
 */
export function aPosterioriBound(A: Mat2, b: Vec2, x0: Vec2, n: number): number {
  const q = spectralNorm(A);
  if (q >= 1 || n < 1) return Infinity;
  const path = orbit(A, b, x0, n);
  if (path.length <= n) return Infinity;
  return (q / (1 - q)) * norm2(sub2(path[n], path[n - 1]));
}

export interface Preset {
  id: string;
  label: string;
  A: Mat2;
  b: Vec2;
  x0: Vec2;
  note: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'strong', label: '强压缩 q≈0.42',
    A: [[0.3, 0.1], [0.0, 0.4]], b: [1, 2], x0: [0, 0],
    note: '收敛很快，界也紧',
  },
  {
    id: 'rotate', label: '旋转收缩 q≈0.71',
    A: [[0.5, -0.5], [0.5, 0.5]], b: [1, 0], x0: [0, 0],
    note: '螺旋着收进去',
  },
  {
    id: 'weak', label: '弱压缩 q≈0.95',
    A: [[0.9, 0.15], [0.05, 0.88]], b: [0.5, -0.5], x0: [0, 0],
    note: '收敛很慢，要几百步',
  },
  {
    id: 'shear', label: '范数>1 但仍收敛',
    A: [[0.5, 3.0], [0.0, 0.5]], b: [1, 1], x0: [0, 0],
    note: '‖A‖=3.08 而 ρ=0.5：压缩只是充分条件',
  },
  {
    id: 'diverge', label: '真的发散',
    A: [[1.1, 0.0], [0.0, 0.5]], b: [1, 1], x0: [0.5, 0.5],
    note: 'ρ=1.1>1，迭代跑掉',
  },
];
