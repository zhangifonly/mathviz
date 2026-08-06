/**
 * 矩阵指数与李代数 so(3)
 *
 * 前三课(四元数、SO(3) 的拓扑)一直在用旋转, 但旋转本身是从哪来的?
 * 这门课回答: 从**无穷小旋转**指数出来的。
 *
 * 核心对象是 so(3) —— 全体 3×3 **反对称矩阵**, 即 Aᵀ = −A。
 * 它是旋转群 SO(3) 在单位元处的切空间: 取一条过单位元的旋转曲线
 * R(t), 求导得 R′(0), 由 RᵀR = I 求导立刻得到 R′(0)ᵀ + R′(0) = 0,
 * 正是反对称。
 *
 * 反对称矩阵只有三个自由参数, 恰好装下一个向量 ω:
 *
 *   ω = (x, y, z)  ↦  [ω]× = [ 0  −z   y ]
 *                            [ z   0  −x ]
 *                            [−y   x   0 ]
 *
 * 这个 hat 映射把向量叉积变成矩阵乘法: [ω]× v = ω × v。
 * 于是"无穷小旋转"就是"绕 ω 方向以 |ω| 的角速度转"。
 *
 * 指数映射把切空间送回群:
 *
 *   exp([ω]×) = I + sin θ ·K + (1 − cos θ)·K²      (Rodrigues 公式)
 *   其中 θ = |ω|, K = [ω̂]× 是单位轴的 hat
 *
 * 这个式子是**有限项**的, 不用真的把级数加到无穷 —— 因为 K³ = −K,
 * 级数每三项就折回去, 收敛成三角函数。本课把它算准并验证。
 *
 * 最后一件事是**李括号**: [A, B] = AB − BA。在 so(3) 上它对应叉积,
 *   [[a]×, [b]×] = [a × b]×
 * 这解释了三维旋转为什么不可交换: 括号非零。
 */

export type Vec3 = [number, number, number];
export type Mat3 = number[][]; // 行优先 3×3

export function matMul(A: Mat3, B: Mat3): Mat3 {
  const C: Mat3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let s = 0;
      for (let k = 0; k < 3; k++) s += A[i][k] * B[k][j];
      C[i][j] = s;
    }
  }
  return C;
}

export function matAdd(A: Mat3, B: Mat3): Mat3 {
  return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}

export function matSub(A: Mat3, B: Mat3): Mat3 {
  return A.map((row, i) => row.map((v, j) => v - B[i][j]));
}

export function matScale(A: Mat3, k: number): Mat3 {
  return A.map((row) => row.map((v) => v * k));
}

export function matVec(A: Mat3, v: Vec3): Vec3 {
  return [
    A[0][0] * v[0] + A[0][1] * v[1] + A[0][2] * v[2],
    A[1][0] * v[0] + A[1][1] * v[1] + A[1][2] * v[2],
    A[2][0] * v[0] + A[2][1] * v[1] + A[2][2] * v[2],
  ];
}

export function identity3(): Mat3 {
  return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
}

export function transpose(A: Mat3): Mat3 {
  return [
    [A[0][0], A[1][0], A[2][0]],
    [A[0][1], A[1][1], A[2][1]],
    [A[0][2], A[1][2], A[2][2]],
  ];
}

export function det3(A: Mat3): number {
  return (
    A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
    A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
    A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
  );
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function norm3(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2]);
}

/** hat 映射 ω ↦ [ω]×。满足 [ω]× v = ω × v。 */
export function hat(w: Vec3): Mat3 {
  return [
    [0, -w[2], w[1]],
    [w[2], 0, -w[0]],
    [-w[1], w[0], 0],
  ];
}

/** vee 映射: hat 的逆, 从反对称矩阵读回向量。 */
export function vee(A: Mat3): Vec3 {
  return [A[2][1], A[0][2], A[1][0]];
}

/** 反对称性偏差(最大 |Aᵀ+A| 元素), 用于检验"确实在 so(3) 里"。 */
export function skewResidual(A: Mat3): number {
  const S = matAdd(transpose(A), A);
  let m = 0;
  for (const row of S) for (const v of row) m = Math.max(m, Math.abs(v));
  return m;
}

/**
 * 指数映射 exp([ω]×), 用 Rodrigues 闭式:
 *
 *   exp = I + sin θ ·K + (1 − cos θ)·K²,   θ = |ω|, K = [ω̂]×
 *
 * 之所以能收成有限项, 是因为 K³ = −K: 幂级数每三项折回, 奇数次幂
 * 攒成 sin, 偶数次幂攒成 (1−cos)。
 *
 * ⚠️ θ→0 时 ω̂ 无定义(除以零)。这里直接返回单位阵 —— 数学上
 * exp(0)=I, 无需特殊近似。若写成 sinθ/θ 的形式反而要小心 0/0。
 */
export function expSO3(w: Vec3): Mat3 {
  const theta = norm3(w);
  if (theta < 1e-12) return identity3();
  const k: Vec3 = [w[0] / theta, w[1] / theta, w[2] / theta];
  const K = hat(k);
  const K2 = matMul(K, K);
  return matAdd(
    matAdd(identity3(), matScale(K, Math.sin(theta))),
    matScale(K2, 1 - Math.cos(theta)),
  );
}

/**
 * 对数映射 log: SO(3) → so(3), 返回 ω(轴×角)。
 *
 * θ 由迹给出: tr(R) = 1 + 2cos θ。
 *
 * ⚠️ 三处退化必须分开处理, 否则会得到 NaN 或错轴:
 * 1. θ≈0: R≈I, 返回零向量。
 * 2. θ≈π: sin θ→0, 常用的 (R−Rᵀ)/(2 sin θ) 公式整个崩掉。此时
 *    R 是对称的, 改从 R+I 提取轴 —— 取其最大的一列再归一化。
 *    符号在 θ=π 处本来就不唯一(转 +π 与 −π 相同), 取任一支即可。
 * 3. 迹因舍入略微越界: 先把 cos θ 夹到 [−1,1] 再取 acos。
 */
export function logSO3(R: Mat3): Vec3 {
  const tr = R[0][0] + R[1][1] + R[2][2];
  const cosT = Math.max(-1, Math.min(1, (tr - 1) / 2));
  const theta = Math.acos(cosT);

  if (theta < 1e-10) return [0, 0, 0];

  if (Math.PI - theta < 1e-6) {
    // θ≈π: 从 R+I 取轴。R+I = 2 n nᵀ, 任一非零列都平行于 n
    const M = matAdd(R, identity3());
    let best = 0;
    let bestNorm = -1;
    for (let j = 0; j < 3; j++) {
      const c: Vec3 = [M[0][j], M[1][j], M[2][j]];
      const n = norm3(c);
      if (n > bestNorm) {
        bestNorm = n;
        best = j;
      }
    }
    const c: Vec3 = [M[0][best], M[1][best], M[2][best]];
    const n = norm3(c) || 1;
    return [(c[0] / n) * theta, (c[1] / n) * theta, (c[2] / n) * theta];
  }

  const s = 2 * Math.sin(theta);
  return [
    ((R[2][1] - R[1][2]) / s) * theta,
    ((R[0][2] - R[2][0]) / s) * theta,
    ((R[1][0] - R[0][1]) / s) * theta,
  ];
}

/** 李括号 [A,B] = AB − BA。 */
export function bracket(A: Mat3, B: Mat3): Mat3 {
  return matSub(matMul(A, B), matMul(B, A));
}

/**
 * 用截断幂级数算 exp, 仅用于**与 Rodrigues 闭式对照**。
 * 项数少时误差明显, 项数够时应与闭式一致 —— 这正是要展示的:
 * 闭式不是近似, 是级数的精确求和。
 */
export function expSeries(w: Vec3, terms = 12): Mat3 {
  const A = hat(w);
  let sum = identity3();
  let term = identity3();
  for (let n = 1; n <= terms; n++) {
    term = matScale(matMul(term, A), 1 / n);
    sum = matAdd(sum, term);
  }
  return sum;
}

/** 两矩阵的最大元素差, 用于报告误差。 */
export function matMaxDiff(A: Mat3, B: Mat3): number {
  let m = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) m = Math.max(m, Math.abs(A[i][j] - B[i][j]));
  }
  return m;
}

/** 正交性偏差 |RᵀR − I| 的最大元素。 */
export function orthogonalityResidual(R: Mat3): number {
  return matMaxDiff(matMul(transpose(R), R), identity3());
}

/**
 * 单参数子群 t ↦ exp(t·[ω]×)。
 *
 * 这是李代数与李群关系最直白的样子: 固定一个"无穷小旋转"ω, 让 t 走,
 * 就在 SO(3) 里划出一条**测地线**, 也是一个子群 —— 因为
 * exp(s[ω])·exp(t[ω]) = exp((s+t)[ω])。注意这条性质**只在轴相同时**
 * 成立, 一般情况下 exp(A)exp(B) ≠ exp(A+B), 差别由李括号度量。
 */
export function oneParamSubgroup(w: Vec3, t: number): Mat3 {
  return expSO3([w[0] * t, w[1] * t, w[2] * t]);
}

/**
 * exp(A)exp(B) 与 exp(A+B) 的差距 —— 不可交换性的直接证据。
 * 返回两者的最大元素差; 只有当 [A,B]=0 时才为 0。
 */
export function bchDefect(a: Vec3, b: Vec3): number {
  const lhs = matMul(expSO3(a), expSO3(b));
  const rhs = expSO3([a[0] + b[0], a[1] + b[1], a[2] + b[2]]);
  return matMaxDiff(lhs, rhs);
}

/**
 * BCH 二阶近似: exp(A)exp(B) ≈ exp(A + B + ½[A,B])。
 * 返回该近似与真值的差, 用来说明"李括号正是一阶修正项"。
 */
export function bchSecondOrderDefect(a: Vec3, b: Vec3): number {
  const lhs = matMul(expSO3(a), expSO3(b));
  const half = cross(a, b).map((v) => v / 2) as Vec3;
  const approx = expSO3([
    a[0] + b[0] + half[0],
    a[1] + b[1] + half[1],
    a[2] + b[2] + half[2],
  ]);
  return matMaxDiff(lhs, approx);
}

export interface Preset {
  id: string;
  label: string;
  omega: Vec3;
  note: string;
}

export const PRESETS: Preset[] = [
  { id: 'z', label: '绕 z 轴', omega: [0, 0, 1], note: '最简单的单参数子群' },
  { id: 'diag', label: '绕 (1,1,1)', omega: [0.577, 0.577, 0.577], note: '斜轴，三个分量都非零' },
  { id: 'pi', label: 'θ = π（半圈）', omega: [0, 0, Math.PI], note: 'log 在这里要换公式' },
  { id: 'tilt', label: '一般 ω', omega: [1.2, -0.6, 0.35], note: '轴与角一起编码在 ω 里' },
];

/** 用于展示李括号的两个向量 */
export const BRACKET_PAIR: { a: Vec3; b: Vec3 } = {
  a: [0.9, 0, 0],
  b: [0, 0.9, 0],
};
