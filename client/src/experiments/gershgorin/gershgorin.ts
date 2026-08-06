/**
 * Gershgorin 圆盘定理
 *
 * 上一课(Jordan 型)最后说到: 浮点运算下你永远无法确定特征值到底在哪,
 * 亏损与"挨得很近"分不开。那还能说什么确定的话吗?
 *
 * 能。Gershgorin 定理不算特征值, 却能把它们**圈起来**:
 *
 *   每个特征值 λ 至少落在一个圆盘里:
 *     D_i = { z : |z − a_ii| ≤ R_i },  R_i = Σ_{j≠i} |a_ij|
 *
 * 圆心是对角元, 半径是该行其余元素的绝对值之和。一眼就能画出来,
 * 不需要解任何方程。
 *
 * 证明只有三行, 值得写下来: 设 Ax = λx, 取 |x_i| 最大的那个分量 i,
 * 由第 i 行 Σ_j a_ij x_j = λ x_i 得
 *   (λ − a_ii) x_i = Σ_{j≠i} a_ij x_j
 * 两边除以 x_i(它最大, 非零)并取模:
 *   |λ − a_ii| ≤ Σ_{j≠i} |a_ij| · |x_j/x_i| ≤ Σ_{j≠i} |a_ij| = R_i
 *
 * **加强版**(本课也验证): 若 k 个圆盘连成一片、与其余圆盘不相交,
 * 那一片里**恰好**有 k 个特征值(按重数计)。这一条比"至少落在某个
 * 圆盘里"有用得多 —— 它能把特征值一个个隔离开。
 *
 * 两个直接推论:
 *   - 严格对角占优(|a_ii| > R_i 对所有 i)⇒ 所有圆盘不含原点 ⇒ 可逆。
 *   - 列版本同样成立(对 Aᵀ 用一遍), 取行、列两组圆盘的**交**更紧。
 *
 * ⚠️ 本课用实矩阵但特征值可能是复的, 所以整个可视化在**复平面**上,
 * 第三维用来堆叠"行圆盘 / 列圆盘 / 交集"三层 —— 这是它用 3D 的理由,
 * 不是硬套。
 */

export type Mat3 = number[][];
export interface Complex {
  re: number;
  im: number;
}

export interface Disc {
  /** 圆心(对角元, 实数) */
  center: number;
  radius: number;
  /** 第几行/列 */
  index: number;
}

export function trace3(A: Mat3): number {
  return A[0][0] + A[1][1] + A[2][2];
}

export function det3(A: Mat3): number {
  return (
    A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
    A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
    A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
  );
}

export function transpose(A: Mat3): Mat3 {
  return [
    [A[0][0], A[1][0], A[2][0]],
    [A[0][1], A[1][1], A[2][1]],
    [A[0][2], A[1][2], A[2][2]],
  ];
}

/** 行圆盘: 圆心 a_ii, 半径 = 该行非对角元绝对值之和。 */
export function rowDiscs(A: Mat3): Disc[] {
  return [0, 1, 2].map((i) => ({
    center: A[i][i],
    radius: [0, 1, 2].reduce((s, j) => (j === i ? s : s + Math.abs(A[i][j])), 0),
    index: i,
  }));
}

/** 列圆盘 = 对 Aᵀ 取行圆盘。特征值同样落在其并集里。 */
export function colDiscs(A: Mat3): Disc[] {
  return rowDiscs(transpose(A));
}

/** 点 z 是否落在圆盘内(含边界, 留一点容差)。 */
export function inDisc(d: Disc, z: Complex, tol = 1e-9): boolean {
  return Math.hypot(z.re - d.center, z.im) <= d.radius + tol;
}

/** 是否落在圆盘并集里。 */
export function inUnion(discs: Disc[], z: Complex, tol = 1e-9): boolean {
  return discs.some((d) => inDisc(d, z, tol));
}

/**
 * 三次特征多项式的**全部**根(含复根)。
 *
 * 上一课只取实根就够了, 这门课不行 —— 圆盘定理的整个意义就在于
 * 它同时圈住实的和复的特征值, 只画实根等于把定理最有说服力的部分
 * 扔掉。所以这里用完整的 Cardano。
 *
 * 特征多项式: λ³ − c₂λ² + c₁λ − c₀
 *   c₂ = tr(A), c₁ = 二阶主子式之和, c₀ = det(A)
 */
export function eigenvalues(A: Mat3): Complex[] {
  const c2 = trace3(A);
  const c1 =
    A[0][0] * A[1][1] - A[0][1] * A[1][0] +
    A[0][0] * A[2][2] - A[0][2] * A[2][0] +
    A[1][1] * A[2][2] - A[1][2] * A[2][1];
  const c0 = det3(A);

  // 压缩为 t³ + pt + q, λ = t + c2/3
  const s = c2 / 3;
  const p = c1 - (c2 * c2) / 3;
  const q = (2 * c2 * c2 * c2) / 27 - (c1 * c2) / 3 + c0;
  // 多项式是 λ³ − c2λ² + c1λ − c0, 代入后压缩式的常数项取负
  const P = p;
  const Q = -q;

  if (Math.abs(P) < 1e-13 && Math.abs(Q) < 1e-13) {
    return [0, 1, 2].map(() => ({ re: s, im: 0 }));
  }

  const disc = (Q * Q) / 4 + (P * P * P) / 27;
  if (disc > 1e-13) {
    /*
     * 一实两复。共轭对的实部是 −(u+v)/2, 虚部 ±√3(u−v)/2。
     * ⚠️ 这一支正是本课非要不可的: 旋转型矩阵的特征值全在复平面上,
     * 圆盘定理照样圈得住 —— 那才是它比"实轴上找根"强的地方。
     */
    const sq = Math.sqrt(disc);
    const u = Math.cbrt(-Q / 2 + sq);
    const v = Math.cbrt(-Q / 2 - sq);
    const re = -(u + v) / 2 + s;
    const im = (Math.sqrt(3) / 2) * (u - v);
    return [
      { re: u + v + s, im: 0 },
      { re, im },
      { re, im: -im },
    ];
  }

  // 三实根(含重根): 三角解法
  const r = 2 * Math.sqrt(Math.max(0, -P / 3));
  const arg = Math.max(-1, Math.min(1, (3 * Q) / (P * r)));
  const phi = Math.acos(arg) / 3;
  return [0, 1, 2].map((k) => ({
    re: r * Math.cos(phi - (2 * Math.PI * k) / 3) + s,
    im: 0,
  }));
}

/** 谱半径 = 特征值模长的最大值。 */
export function spectralRadius(A: Mat3): number {
  return Math.max(...eigenvalues(A).map((z) => Math.hypot(z.re, z.im)));
}

/** Gershgorin 给出的谱半径上界: max(|a_ii| + R_i)。 */
export function gershgorinBound(A: Mat3): number {
  return Math.max(...rowDiscs(A).map((d) => Math.abs(d.center) + d.radius));
}

/** 严格对角占优: 每行 |a_ii| > R_i。此时圆盘都不含原点, 矩阵可逆。 */
export function isStrictlyDiagonallyDominant(A: Mat3): boolean {
  return rowDiscs(A).every((d) => Math.abs(d.center) > d.radius);
}

/**
 * 把相交的圆盘并成连通分量。
 *
 * 加强版定理: 一个由 k 个圆盘连成的连通分量里, **恰好**有 k 个特征值。
 * 这里返回每个分量的圆盘下标与它实际含有的特征值个数, 供检验。
 *
 * ⚠️ 判定"相交"用 |c_i − c_j| ≤ R_i + R_j。两圆盘外切(等号)时按相交
 * 处理: 定理要求的是分量与其余部分**不相交**, 外切时特征值可以落在
 * 切点上, 分开算会数错。
 */
export function connectedComponents(discs: Disc[]): number[][] {
  const n = discs.length;
  const parent = [...Array(n).keys()];
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = Math.abs(discs[i].center - discs[j].center);
      if (d <= discs[i].radius + discs[j].radius + 1e-9) {
        parent[find(i)] = find(j);
      }
    }
  }
  const groups = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r)!.push(i);
  }
  return [...groups.values()];
}

/** 每个连通分量: 圆盘下标、圆盘个数、落在其中的特征值个数。 */
export function componentCounts(
  A: Mat3, discs: Disc[] = rowDiscs(A),
): Array<{ indices: number[]; discCount: number; eigCount: number }> {
  const comps = connectedComponents(discs);
  const eigs = eigenvalues(A);
  return comps.map((indices) => {
    const sub = indices.map((i) => discs[i]);
    return {
      indices,
      discCount: indices.length,
      eigCount: eigs.filter((z) => inUnion(sub, z, 1e-7)).length,
    };
  });
}

export interface Preset {
  id: string;
  label: string;
  A: Mat3;
  note: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'dominant', label: '严格对角占优',
    A: [[5, 1, 0], [1, 6, 1], [0, 1, 7]],
    note: '圆盘都不含 0 ⇒ 必可逆',
  },
  {
    id: 'isolated', label: '一个圆盘被孤立',
    A: [[10, 1, 1], [1, 2, 1], [1, 1, 3]],
    note: '孤立盘内恰好 1 个特征值',
  },
  {
    id: 'complex', label: '复特征值（旋转）',
    A: [[0, -2, 0], [2, 0, 0], [0, 0, 5]],
    note: 'λ = ±2i，圆盘照样圈得住',
  },
  {
    id: 'symmetric', label: '对称阵',
    A: [[4, 1, 2], [1, 3, 0], [2, 0, 6]],
    note: '特征值全实，落在实轴上',
  },
  {
    id: 'loose', label: '非对角元很大',
    A: [[1, 4, 3], [4, 2, 1], [3, 1, 5]],
    note: '圆盘很大，界很松',
  },
  {
    id: 'tight', label: '几乎对角',
    A: [[2, 0.05, 0.02], [0.03, 5, 0.04], [0.01, 0.02, 9]],
    note: '圆盘很小，估计非常准',
  },
];
