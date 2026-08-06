/**
 * Perron-Frobenius 定理
 *
 * 项目里已有「马氏链稳态」和「PageRank」两课, 都**断言**了"反复迭代
 * 收敛到唯一稳态", 却没说为什么, 也没说什么时候会失败。这门课补上。
 *
 * 定理(本原情形): 若非负方阵 A 的某个幂 A^k 处处为正, 则
 *   ① 存在一个实特征值 r > 0(Perron 根), 它严格大于其余所有特征值的模;
 *   ② r 是单根, 对应的特征向量可取为**处处为正**;
 *   ③ 任何非负初始向量迭代后都收敛到该特征向量的方向。
 *
 * 关键量是**谱隙** |λ₁| − |λ₂|。收敛速度由 |λ₂|/|λ₁| 决定: 每迭代
 * 一次, 偏离稳态的成分就乘以这个比值。谱隙为零则不收敛。
 *
 * 两种失败模式(本课都画出来):
 *
 *   **周期**: 循环置换矩阵的三个特征值全在单位圆上(1 和两个原根),
 *     谱隙为 0。迭代永远在几个状态间打转, 不收敛。它不可约但不本原。
 *
 *   **可约**: 分块三角矩阵有两个独立的闭合子链, 特征值 1 的重数为 2,
 *     稳态**不唯一** —— 从不同初值出发会收敛到不同的分布。
 *
 * PageRank 的"阻尼因子"正是为了绕开这两个坑: 给每个元素加上一点
 * 均匀的正值, 强行把矩阵变成正矩阵, 于是定理条件满足, 收敛且唯一。
 * 这门课把那个 0.85 的来历讲清楚。
 */

export type Mat3 = number[][];
export type Vec3 = [number, number, number];
export interface Complex {
  re: number;
  im: number;
}

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

export function transpose(A: Mat3): Mat3 {
  return [
    [A[0][0], A[1][0], A[2][0]],
    [A[0][1], A[1][1], A[2][1]],
    [A[0][2], A[1][2], A[2][2]],
  ];
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

export function norm1(v: Vec3): number {
  return Math.abs(v[0]) + Math.abs(v[1]) + Math.abs(v[2]);
}

/** 归一化到概率分布(各分量和为 1)。 */
export function normalizeProb(v: Vec3): Vec3 {
  const s = v[0] + v[1] + v[2];
  if (Math.abs(s) < 1e-15) return [1 / 3, 1 / 3, 1 / 3];
  return [v[0] / s, v[1] / s, v[2] / s];
}

/** 行随机: 每行之和为 1 且元素非负。马氏链的转移矩阵就是这种。 */
export function isRowStochastic(A: Mat3, tol = 1e-9): boolean {
  return A.every((row) =>
    row.every((v) => v >= -tol) &&
    Math.abs(row.reduce((s, v) => s + v, 0) - 1) < tol);
}

/** 非负矩阵。 */
export function isNonnegative(A: Mat3, tol = 1e-12): boolean {
  return A.every((row) => row.every((v) => v >= -tol));
}

/** 处处为正。 */
export function isPositive(A: Mat3, tol = 1e-12): boolean {
  return A.every((row) => row.every((v) => v > tol));
}

/**
 * 可达性矩阵: reach[i][j] 为真表示从 i 经若干步可到 j。
 * 用布尔幂闭包(Floyd-Warshall 的传递闭包版本)。
 */
export function reachability(A: Mat3, tol = 1e-12): boolean[][] {
  const R = A.map((row) => row.map((v) => Math.abs(v) > tol));
  for (let k = 0; k < 3; k++) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (R[i][k] && R[k][j]) R[i][j] = true;
      }
    }
  }
  return R;
}

/**
 * 不可约 = 任意两状态互相可达(有向图强连通)。
 * 注意要包含 i→i: 单个状态自己到自己算可达(零步)。
 */
export function isIrreducible(A: Mat3, tol = 1e-12): boolean {
  const R = reachability(A, tol);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i !== j && !R[i][j]) return false;
    }
  }
  return true;
}

/**
 * 本原 = 某个幂处处为正。
 *
 * 对 n×n 矩阵, 若本原则 A^(n²−2n+2) 必正(Wielandt 界), n=3 时是 A⁵。
 * 这里保险起见试到 A¹².
 *
 * ⚠️ 直接连乘会让元素指数增长/衰减导致溢出或下溢, 所以每步按最大元
 * 归一化 —— 我们只关心"是否为正", 不关心大小。
 */
export function primitivePower(A: Mat3, maxPow = 12, tol = 1e-12): number | null {
  let P: Mat3 = A.map((r) => [...r]);
  for (let k = 1; k <= maxPow; k++) {
    if (isPositive(P, tol)) return k;
    P = matMul(P, A);
    const m = Math.max(...P.flat().map(Math.abs), 1e-300);
    P = P.map((r) => r.map((v) => v / m));
  }
  return null;
}

export function isPrimitive(A: Mat3): boolean {
  return primitivePower(A) !== null;
}

/**
 * 三次特征多项式的全部根(含复根), 与 Gershgorin 那课同一套 Cardano。
 * 这门课非要复根不可: 周期矩阵的特征值恰好是单位根, 全在复平面的
 * 单位圆上 —— "谱隙为零"这件事只有在复平面上才看得见。
 */
export function eigenvalues(A: Mat3): Complex[] {
  const c2 = trace3(A);
  const c1 =
    A[0][0] * A[1][1] - A[0][1] * A[1][0] +
    A[0][0] * A[2][2] - A[0][2] * A[2][0] +
    A[1][1] * A[2][2] - A[1][2] * A[2][1];
  const c0 = det3(A);
  const s = c2 / 3;
  const P = c1 - (c2 * c2) / 3;
  const Q = -((2 * c2 * c2 * c2) / 27 - (c1 * c2) / 3 + c0);

  if (Math.abs(P) < 1e-13 && Math.abs(Q) < 1e-13) {
    return [0, 1, 2].map(() => ({ re: s, im: 0 }));
  }
  const disc = (Q * Q) / 4 + (P * P * P) / 27;
  if (disc > 1e-13) {
    const sq = Math.sqrt(disc);
    const u = Math.cbrt(-Q / 2 + sq);
    const v = Math.cbrt(-Q / 2 - sq);
    const re = -(u + v) / 2 + s;
    const im = (Math.sqrt(3) / 2) * (u - v);
    return [{ re: u + v + s, im: 0 }, { re, im }, { re, im: -im }];
  }
  const r = 2 * Math.sqrt(Math.max(0, -P / 3));
  const arg = Math.max(-1, Math.min(1, (3 * Q) / (P * r)));
  const phi = Math.acos(arg) / 3;
  return [0, 1, 2].map((k) => ({
    re: r * Math.cos(phi - (2 * Math.PI * k) / 3) + s,
    im: 0,
  }));
}

export function cAbs(z: Complex): number {
  return Math.hypot(z.re, z.im);
}

/** 特征值按模降序。 */
export function eigenvaluesByModulus(A: Mat3): Complex[] {
  return [...eigenvalues(A)].sort((a, b) => cAbs(b) - cAbs(a));
}

/**
 * 谱隙 |λ₁| − |λ₂|。
 * 这是全课的核心量: 大于零才收敛, 且比值 |λ₂|/|λ₁| 就是每步的收敛率。
 */
export function spectralGap(A: Mat3): number {
  const ev = eigenvaluesByModulus(A);
  return cAbs(ev[0]) - cAbs(ev[1]);
}

/** 收敛率 |λ₂|/|λ₁|。等于 1 表示不收敛。 */
export function convergenceRate(A: Mat3): number {
  const ev = eigenvaluesByModulus(A);
  const m1 = cAbs(ev[0]);
  if (m1 < 1e-15) return 0;
  return cAbs(ev[1]) / m1;
}

/**
 * 分布迭代 vₖ₊₁ = vₖ Aᵀ(行随机矩阵作用在行向量上), 每步归一化。
 * 返回整条轨迹, 用来在 3D 单纯形上画出"走向稳态"或"永远打转"。
 */
export function iterate(A: Mat3, v0: Vec3, steps = 30): Vec3[] {
  const out: Vec3[] = [normalizeProb(v0)];
  let v = out[0];
  const At = transpose(A);
  for (let i = 0; i < steps; i++) {
    v = normalizeProb(matVec(At, v));
    out.push(v);
    if (!v.every(Number.isFinite)) break;
  }
  return out;
}

/**
 * Perron 特征向量: 用幂迭代求主特征向量并归一化成概率分布。
 *
 * ⚠️ 周期矩阵上幂迭代**不收敛**(这正是本课要展示的), 所以这里返回
 * 最后若干步的平均值 —— 它是 Cesàro 极限, 对周期情形也有意义。
 * 是否真正收敛由 converged 字段告知, 不要拿它当"稳态一定存在"的证据。
 */
export function perronVector(
  A: Mat3, steps = 500, tol = 1e-12,
): { vector: Vec3; converged: boolean } {
  /*
   * ⚠️ 起点**不能**取均匀分布 (1/3,1/3,1/3)。
   * 循环置换矩阵把均匀分布原样送回去 —— 它是个不动点, 迭代纹丝不动,
   * 于是"收敛"检测会报 true, 恰好把这门课要展示的失败模式盖住。
   * 我第一版就是这么写的, 诊断里周期矩阵报 converged=true 而末步
   * 变化却是 2.0, 自相矛盾。改用偏心的起点才能暴露周期性。
   */
  const path = iterate(A, [1, 0, 0], steps);
  const last = path[path.length - 1];
  const prev = path[path.length - 2];
  const converged = norm1([
    last[0] - prev[0], last[1] - prev[1], last[2] - prev[2],
  ]) < tol * 100;
  if (converged) return { vector: last, converged: true };
  // 未收敛: 取最后 6 步的平均(Cesàro), 周期情形下这是合理的"平均行为"
  const tailLen = Math.min(6, path.length);
  const tail = path.slice(-tailLen);
  const avg: Vec3 = [0, 0, 0];
  for (const p of tail) {
    avg[0] += p[0] / tailLen;
    avg[1] += p[1] / tailLen;
    avg[2] += p[2] / tailLen;
  }
  return { vector: normalizeProb(avg), converged: false };
}

/**
 * PageRank 阻尼: M' = d·M + (1−d)/n · J(J 是全 1 矩阵)。
 *
 * 这一步把任何非负行随机矩阵**强行变成正矩阵**, 于是 Perron-Frobenius
 * 的条件无条件满足: 主特征值单重、特征向量处处为正、迭代必收敛且唯一。
 * 经典的 d = 0.85 就是在"尊重原始链接结构"与"保证收敛"之间取的折中。
 *
 * 顺带: 加了阻尼后 |λ₂| ≤ d, 所以收敛率有了**与图结构无关**的上界 ——
 * 这才是 0.85 真正买到的东西。
 */
export function damp(A: Mat3, d = 0.85): Mat3 {
  const u = (1 - d) / 3;
  return A.map((row) => row.map((v) => d * v + u));
}

/**
 * 从三个不同初值出发, 终点相差多少。
 *
 * 这是判"稳态唯一不唯一"的**操作性**办法, 与看特征值互相印证:
 *   本原 → 差异 0(殊途同归)
 *   周期 → 差异 2(各转各的圈)
 *   可约 → 差异 2(困在各自的子链里)
 * 可约情形迭代本身是收敛的(末步变化为 0), 只有换初值才暴露问题 ——
 * 所以两种失败模式需要两个不同的检测手段, 缺一不可。
 */
export function limitSpread(A: Mat3, steps = 500): number {
  const ends = ([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Vec3[]).map((v0) => {
    const path = iterate(A, v0, steps);
    return path[path.length - 1];
  });
  let worst = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      worst = Math.max(worst, norm1([
        ends[i][0] - ends[j][0], ends[i][1] - ends[j][1], ends[i][2] - ends[j][2],
      ]));
    }
  }
  return worst;
}

/** 稳态是否唯一: 模等于谱半径的特征值只有一个(计重数)。 */
export function stationaryUnique(A: Mat3, tol = 1e-6): boolean {
  const ev = eigenvaluesByModulus(A);
  const m1 = cAbs(ev[0]);
  if (m1 < 1e-15) return false;
  return cAbs(ev[1]) < m1 - tol;
}

export interface Classification {
  nonnegative: boolean;
  rowStochastic: boolean;
  positive: boolean;
  irreducible: boolean;
  primitive: boolean;
  primitiveAt: number | null;
  gap: number;
  rate: number;
  unique: boolean;
  verdict: string;
}

export function classify(A: Mat3): Classification {
  const irreducible = isIrreducible(A);
  const primitiveAt = primitivePower(A);
  const primitive = primitiveAt !== null;
  const gap = spectralGap(A);
  const unique = stationaryUnique(A);
  let verdict: string;
  if (!isNonnegative(A)) verdict = '有负元素，定理不适用';
  else if (primitive) verdict = '本原 ⇒ 收敛且稳态唯一';
  else if (irreducible) verdict = '不可约但有周期 ⇒ 永远打转，不收敛';
  else verdict = '可约 ⇒ 稳态不唯一，看初值';
  return {
    nonnegative: isNonnegative(A),
    rowStochastic: isRowStochastic(A),
    positive: isPositive(A),
    irreducible,
    primitive,
    primitiveAt,
    gap,
    rate: convergenceRate(A),
    unique,
    verdict,
  };
}

export interface Preset {
  id: string;
  label: string;
  A: Mat3;
  note: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'positive', label: '正矩阵',
    A: [[0.5, 0.3, 0.2], [0.2, 0.6, 0.2], [0.3, 0.3, 0.4]],
    note: '谱隙 0.70，收敛最快',
  },
  {
    id: 'primitive', label: '本原（有零但幂为正）',
    A: [[0, 1, 0], [0, 0, 1], [0.5, 0.5, 0]],
    note: '谱隙 0.29，照样收敛',
  },
  {
    id: 'periodic', label: '周期（循环置换）',
    A: [[0, 1, 0], [0, 0, 1], [1, 0, 0]],
    note: '三个特征值全在单位圆上，谱隙 0',
  },
  {
    id: 'reducible', label: '可约（两个闭合子链）',
    A: [[0.5, 0.5, 0], [0.5, 0.5, 0], [0, 0, 1]],
    note: '特征值 1 是二重根，稳态不唯一',
  },
  {
    id: 'slow', label: '几乎可约（收敛很慢）',
    A: [[0.98, 0.01, 0.01], [0.01, 0.98, 0.01], [0.02, 0.02, 0.96]],
    note: '谱隙极小，要迭代很多步',
  },
];
