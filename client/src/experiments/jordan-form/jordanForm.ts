/**
 * 亏损矩阵与 Jordan 标准型
 *
 * 项目里已有「特征值与特征向量」和「谱分解」两课: 前者讲一般情形,
 * 后者讲对称矩阵(总能正交对角化)。但两课都没碰一个基本问题:
 * **什么时候对角化会失败**。这门课补上。
 *
 * 失败的原因只有一个: 特征向量不够用。
 *
 *   代数重数 = 特征值作为特征多项式根的重数
 *   几何重数 = 该特征值的特征空间维数 = dim ker(A − λI)
 *
 * 总有 1 ≤ 几何重数 ≤ 代数重数。两者相等时可对角化; 几何 < 代数时
 * **亏损**(defective), 怎么也凑不出 n 个线性无关的特征向量。
 *
 * 最小的例子是剪切:
 *
 *   J = [1 1]   特征值 1(代数重数 2), 但 A − I = [0 1] 的核只有一维
 *       [0 1]                                    [0 0]
 *
 * 几何上很直白: 剪切只把水平方向的向量保持在原方向上, 竖直方向的
 * 向量会被"推歪"。只有一条特征方向, 撑不满平面。
 *
 * 补救办法是**广义特征向量**: 解 (A − λI)v₂ = v₁ 而不是 = 0。
 * v₂ 不是特征向量, 但 (A − λI)² v₂ = 0。这样凑出的链
 *
 *   v₁ ← v₂ ← v₃ ← …      (每次作用 A − λI 就沿链往回退一步)
 *
 * 叫 Jordan 链, 它给出的基把 A 变成 Jordan 块的样子: 对角线是 λ,
 * 上对角线是 1。那个 1 就是"差一点才对角"的量化。
 *
 * ⚠️ 数值上判定亏损是**病态**的: 亏损矩阵在任意小的扰动下都会变成
 * 可对角化的(特征值分裂开)。所以实际计算中 Jordan 型几乎不可用 ——
 * 这一点本课也说清楚, 见 perturbEigenvalues()。
 */

export type Vec3 = [number, number, number];
export type Mat3 = number[][];

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

export function matVec(A: Mat3, v: Vec3): Vec3 {
  return [
    A[0][0] * v[0] + A[0][1] * v[1] + A[0][2] * v[2],
    A[1][0] * v[0] + A[1][1] * v[1] + A[1][2] * v[2],
    A[2][0] * v[0] + A[2][1] * v[1] + A[2][2] * v[2],
  ];
}

export function matSub(A: Mat3, B: Mat3): Mat3 {
  return A.map((r, i) => r.map((v, j) => v - B[i][j]));
}

export function identity3(): Mat3 {
  return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
}

export function scaleMat(A: Mat3, k: number): Mat3 {
  return A.map((r) => r.map((v) => v * k));
}

export function norm3(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2]);
}

export function normalize(v: Vec3): Vec3 {
  const n = norm3(v);
  return n < 1e-14 ? [0, 0, 0] : [v[0] / n, v[1] / n, v[2] / n];
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

/**
 * 行阶梯化, 返回 { rref, rank, pivots }。
 * 用列主元, 阈值 tol —— 判秩本质上是"多小算零", 这个阈值就是全部
 * 主观性所在, 所以显式暴露出来而不是藏在实现里。
 */
export function rref(M: Mat3, tol = 1e-9): { rref: Mat3; rank: number; pivots: number[] } {
  const A: Mat3 = M.map((r) => [...r]);
  const pivots: number[] = [];
  let row = 0;
  for (let col = 0; col < 3 && row < 3; col++) {
    // 列主元
    let best = row;
    for (let i = row + 1; i < 3; i++) {
      if (Math.abs(A[i][col]) > Math.abs(A[best][col])) best = i;
    }
    if (Math.abs(A[best][col]) < tol) continue;
    [A[row], A[best]] = [A[best], A[row]];
    const p = A[row][col];
    for (let j = 0; j < 3; j++) A[row][j] /= p;
    for (let i = 0; i < 3; i++) {
      if (i === row) continue;
      const f = A[i][col];
      if (Math.abs(f) < 1e-300) continue;
      for (let j = 0; j < 3; j++) A[i][j] -= f * A[row][j];
    }
    pivots.push(col);
    row++;
  }
  return { rref: A, rank: pivots.length, pivots };
}

/** 零空间的一组基(维数 = 3 − rank)。 */
export function nullSpace(M: Mat3, tol = 1e-9): Vec3[] {
  const { rref: R, pivots } = rref(M, tol);
  const free = [0, 1, 2].filter((c) => !pivots.includes(c));
  return free.map((f) => {
    const v: Vec3 = [0, 0, 0];
    v[f] = 1;
    pivots.forEach((p, i) => {
      v[p] = -R[i][f];
    });
    return normalize(v);
  });
}

/**
 * 实特征值。三次特征多项式 λ³ − c₂λ² + c₁λ − c₀, 用三角函数解法
 * (Viète), 它在三实根情形下比 Cardano 的复数路径稳。
 *
 * 返回**升序**的实根; 若判别式表明有复根, 只返回那一个实根。
 */
export function eigenvalues(A: Mat3): number[] {
  const c2 = trace3(A);
  // 二阶主子式之和
  const c1 =
    A[0][0] * A[1][1] - A[0][1] * A[1][0] +
    A[0][0] * A[2][2] - A[0][2] * A[2][0] +
    A[1][1] * A[2][2] - A[1][2] * A[2][1];
  const c0 = det3(A);

  // 化为压缩三次 t³ + pt + q, λ = t + c2/3
  const s = c2 / 3;
  const p = c1 - (c2 * c2) / 3;
  const q = (2 * c2 * c2 * c2) / 27 - (c1 * c2) / 3 + c0;
  // 注意: 特征多项式为 λ³ − c2λ² + c1λ − c0, 代入后常数项取负
  const P = p;
  const Q = -q;

  if (Math.abs(P) < 1e-14 && Math.abs(Q) < 1e-14) return [s, s, s];

  const disc = (Q * Q) / 4 + (P * P * P) / 27;
  if (disc > 1e-12) {
    // 一实两复
    const u = Math.cbrt(-Q / 2 + Math.sqrt(disc));
    const v = Math.cbrt(-Q / 2 - Math.sqrt(disc));
    return [u + v + s];
  }
  // 三实根(含重根): 三角解法
  const r = 2 * Math.sqrt(Math.max(0, -P / 3));
  const arg = Math.max(-1, Math.min(1, (3 * Q) / (P * r)));
  const phi = Math.acos(arg) / 3;
  return [0, 1, 2]
    .map((k) => r * Math.cos(phi - (2 * Math.PI * k) / 3) + s)
    .sort((a, b) => a - b);
}

/** 把数值上相同的特征值并成 { value, algebraic } 列表。 */
export function eigenGroups(A: Mat3, tol = 1e-6): Array<{ value: number; algebraic: number }> {
  const out: Array<{ value: number; algebraic: number }> = [];
  for (const v of eigenvalues(A)) {
    const hit = out.find((g) => Math.abs(g.value - v) < tol);
    if (hit) {
      hit.algebraic += 1;
      hit.value = (hit.value * (hit.algebraic - 1) + v) / hit.algebraic;
    } else out.push({ value: v, algebraic: 1 });
  }
  return out;
}

export interface EigenInfo {
  value: number;
  algebraic: number;
  geometric: number;
  eigenvectors: Vec3[];
  defective: boolean;
}

/** 每个特征值的代数重数、几何重数与特征向量。 */
export function analyze(A: Mat3, tol = 1e-6): EigenInfo[] {
  return eigenGroups(A, tol).map((g) => {
    const M = matSub(A, scaleMat(identity3(), g.value));
    const vecs = nullSpace(M, 1e-7);
    return {
      value: g.value,
      algebraic: g.algebraic,
      geometric: vecs.length,
      eigenvectors: vecs,
      defective: vecs.length < g.algebraic,
    };
  });
}

/** 矩阵是否可对角化: 所有特征值的几何重数都等于代数重数, 且实根凑满 3 个。 */
export function isDiagonalizable(A: Mat3, tol = 1e-6): boolean {
  const info = analyze(A, tol);
  const totalAlg = info.reduce((s, i) => s + i.algebraic, 0);
  if (totalAlg < 3) return false; // 有复特征值, 实域上不可对角化
  return info.every((i) => i.geometric === i.algebraic);
}

/**
 * 求 Jordan 链: 从特征向量 v₁ 出发, 解 (A − λI)v₂ = v₁, 再解
 * (A − λI)v₃ = v₂ …… 直到方程无解。
 *
 * 链长就是该 Jordan 块的大小。链上每个向量都满足 (A−λI)^k v = 0,
 * 但 (A−λI)^(k−1) v ≠ 0 —— 这正是"广义特征向量"的定义。
 *
 * ⚠️ 解 (A − λI)x = b 时系数矩阵是**奇异**的(λ 是特征值), 所以不能
 * 用求逆。这里用增广矩阵消元, 并在回代前检查相容性: 若某行左边全零
 * 而右边非零, 方程无解, 链到此为止。
 */
export function jordanChain(A: Mat3, lambda: number, v1: Vec3, maxLen = 3): Vec3[] {
  const chain: Vec3[] = [v1];
  const M = matSub(A, scaleMat(identity3(), lambda));
  let b = v1;
  for (let k = 1; k < maxLen; k++) {
    const x = solveSingular(M, b);
    if (!x) break;
    chain.push(x);
    b = x;
  }
  return chain;
}

/**
 * 解奇异线性方程组 Mx = b。无解返回 null; 有解时返回一个特解
 * (自由变量取 0)。
 */
export function solveSingular(M: Mat3, b: Vec3, tol = 1e-9): Vec3 | null {
  // 增广矩阵
  const aug: number[][] = [
    [M[0][0], M[0][1], M[0][2], b[0]],
    [M[1][0], M[1][1], M[1][2], b[1]],
    [M[2][0], M[2][1], M[2][2], b[2]],
  ];
  const pivots: number[] = [];
  let row = 0;
  for (let col = 0; col < 3 && row < 3; col++) {
    let best = row;
    for (let i = row + 1; i < 3; i++) {
      if (Math.abs(aug[i][col]) > Math.abs(aug[best][col])) best = i;
    }
    if (Math.abs(aug[best][col]) < tol) continue;
    [aug[row], aug[best]] = [aug[best], aug[row]];
    const p = aug[row][col];
    for (let j = 0; j < 4; j++) aug[row][j] /= p;
    for (let i = 0; i < 3; i++) {
      if (i === row) continue;
      const f = aug[i][col];
      if (Math.abs(f) < 1e-300) continue;
      for (let j = 0; j < 4; j++) aug[i][j] -= f * aug[row][j];
    }
    pivots.push(col);
    row++;
  }
  // 相容性: 左边全零而右边非零 ⇒ 无解
  for (let i = row; i < 3; i++) {
    if (Math.abs(aug[i][3]) > 1e-7) return null;
  }
  const x: Vec3 = [0, 0, 0];
  pivots.forEach((c, i) => {
    x[c] = aug[i][3];
  });
  return x;
}

/**
 * 亏损的**数值脆弱性**: 给 A 加一个大小为 eps 的扰动, 看特征值怎么变。
 *
 * 亏损矩阵的特征值对扰动的响应是 **eps^(1/k)** 量级(k 为 Jordan 块大小),
 * 不是 eps。所以 eps=1e−12 时二阶块的特征值能偏离 1e−6 —— 放大一百万倍。
 * 这正是"数值上无法可靠判定亏损"的原因: 任意小的扰动都会把重根劈开。
 */
export function perturbEigenvalues(A: Mat3, eps: number, blockSize = 3): number[] {
  /*
   * ⚠️ 扰动加在哪里很关键。要触发 eps^(1/k) 这个响应, 必须扰动
   * Jordan 块的**左下角**(把链的末端接回开头), 那正是特征多项式里
   * 常数项被改动的位置。加在别处(比如块外的元素)对重根没有影响,
   * 特征值纹丝不动 —— 我第一次就是这么测的, 结果偏离恒为 0,
   * 差点得出"扰动不影响亏损矩阵"的相反结论。
   */
  const P: Mat3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  P[Math.min(2, blockSize - 1)][0] = 1;
  return eigenvalues(A.map((r, i) => r.map((v, j) => v + eps * P[i][j])) as Mat3);
}

/**
 * 扰动后特征值偏离原值的最大距离。
 *
 * ⚠️ 每个新特征值与**离它最近的**原特征值比, 不能拿全体去比某一个:
 * 我第一次直接和第一个特征值比, 结果无关的 λ=5 贡献了 3.0 的"偏离",
 * 把真正要看的 1e−6 量级完全淹没了。
 */
/*
 * ⚠️ 分辨率限制(实测): 2×2 块上这条定律在 eps=1e−3…1e−12 全程比值恒为
 * 1.000; 但 3×3 块只在 eps≳1e−3 时测得出来。原因是我这个三次求根用
 * disc>1e−12 判"是否有复根", 更小的裂开会被当成三重根收回一个值 ——
 * 这是**求根器的分辨率**, 不是矩阵的性质。所以课里用 2×2 块讲这条定律。
 */
export function perturbationSpread(A: Mat3, eps: number, blockSize = 3): number {
  const base = eigenvalues(A);
  const after = perturbEigenvalues(A, eps, blockSize);
  let worst = 0;
  for (const v of after) {
    const near = Math.min(...base.map((b) => Math.abs(v - b)));
    worst = Math.max(worst, near);
  }
  return worst;
}

/**
 * 反复作用 A 得到的轨道 v, Av, A²v, …
 *
 * 亏损矩阵的轨道有个特征形状: 因为 Aⁿ 里会冒出 n·λⁿ⁻¹ 这样的项
 * (来自 Jordan 块上对角线的 1), 轨道会沿着特征方向**线性漂移**,
 * 而不是像可对角化情形那样各分量独立地指数伸缩。画出来就是
 * "螺旋着贴向唯一那条特征方向"。
 */
export function orbit(A: Mat3, v0: Vec3, steps = 12): Vec3[] {
  const out: Vec3[] = [v0];
  let v = v0;
  for (let i = 0; i < steps; i++) {
    v = matVec(A, v);
    if (!v.every(Number.isFinite) || norm3(v) > 1e12) break;
    out.push(v);
  }
  return out;
}

export interface Preset {
  id: string;
  label: string;
  A: Mat3;
  note: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'diag', label: '可对角化（对角阵）',
    A: [[2, 0, 0], [0, 1, 0], [0, 0, 0.5]],
    note: '三个方向各自伸缩',
  },
  {
    id: 'symmetric', label: '对称阵',
    A: [[2, 1, 0], [1, 2, 0], [0, 0, 3]],
    note: '总能正交对角化',
  },
  {
    id: 'jordan2', label: '2×2 Jordan 块（亏损）',
    A: [[2, 1, 0], [0, 2, 0], [0, 0, 5]],
    note: 'λ=2 代数 2、几何 1',
  },
  {
    id: 'jordan3', label: '3×3 Jordan 块（亏损）',
    A: [[1, 1, 0], [0, 1, 1], [0, 0, 1]],
    note: '整个空间只有一条特征方向',
  },
  {
    id: 'shear', label: '纯剪切',
    A: [[1, 1, 0], [0, 1, 0], [0, 0, 1]],
    note: 'λ=1 代数 3、几何 2',
  },
  {
    id: 'complex', label: '含复特征值（旋转）',
    A: [[0, -1, 0], [1, 0, 0], [0, 0, 2]],
    note: '实域上根本没有两条特征方向',
  },
];
