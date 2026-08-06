/**
 * Moore-Penrose 伪逆
 *
 * 项目里已有「最小二乘法」和「奇异值分解」两课, 但最小二乘那课只讲了
 * **超定且列满秩**的情形(方程比未知数多、解唯一)。其余三种情况没碰:
 *
 *   欠定(方程少于未知数) —— 解有无穷多个, 该取哪个?
 *   秩亏(列不独立)       —— AᵀA 不可逆, 正规方程整个失效
 *   两者兼有
 *
 * 伪逆 A⁺ 把四种情形统一成一句话:
 *
 *   x = A⁺b 总是**残差最小**的解; 若这样的解不止一个, 它还是其中
 *   **范数最小**的那个。
 *
 * 由 SVD 构造极其简单: A = UΣVᵀ 时
 *
 *   A⁺ = VΣ⁺Uᵀ,  Σ⁺ 把非零奇异值取倒数、零奇异值**仍取零**
 *
 * "零仍取零"是全部关窍。1/0 是无穷, 但这里直接置零 —— 几何意义是:
 * 被 A 压扁到零的那些方向, 反解时不去恢复(恢复不了, 也不该乱猜),
 * 而是取该方向上分量为零的那个解, 于是范数最小。
 *
 * 四条 Penrose 条件唯一刻画了 A⁺(本课全部验证):
 *   ① A A⁺ A = A      ② A⁺ A A⁺ = A⁺
 *   ③ (A A⁺)ᵀ = A A⁺   ④ (A⁺ A)ᵀ = A⁺ A
 * 满足这四条的矩阵存在且唯一, 所以 A⁺ 不依赖于 SVD 的具体取法。
 *
 * 几何图像(本课要看的东西):
 *   A A⁺ 是到**列空间**的正交投影 —— b 够不着列空间时, 先投影再解。
 *   A⁺ A 是到**行空间**的正交投影 —— 解里落在零空间的部分被丢掉,
 *          这正是"范数最小"的来源。
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

export function transpose(A: Mat3): Mat3 {
  return [
    [A[0][0], A[1][0], A[2][0]],
    [A[0][1], A[1][1], A[2][1]],
    [A[0][2], A[1][2], A[2][2]],
  ];
}

export function identity3(): Mat3 {
  return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
}

export function sub3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function add3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function scale3(v: Vec3, k: number): Vec3 {
  return [v[0] * k, v[1] * k, v[2] * k];
}

export function dot3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function norm3(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2]);
}

export function normalize3(v: Vec3): Vec3 {
  const n = norm3(v);
  return n < 1e-14 ? [0, 0, 0] : scale3(v, 1 / n);
}

export function maxDiff(A: Mat3, B: Mat3): number {
  let m = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) m = Math.max(m, Math.abs(A[i][j] - B[i][j]));
  }
  return m;
}

/**
 * 对称矩阵的特征分解(Jacobi 旋转法), 与条件数那课同一套。
 * 用 Jacobi 而非解特征多项式: 本课要处理秩亏矩阵(有精确的零奇异值),
 * 三次求根在重根处相消误差大, Jacobi 对对称阵无条件收敛。
 */
export function symmetricEigen(M: Mat3): { values: number[]; vectors: Mat3 } {
  const a: Mat3 = M.map((r) => [...r]);
  let V: Mat3 = identity3();
  for (let sweep = 0; sweep < 80; sweep++) {
    let p = 0;
    let q = 1;
    let off = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = i + 1; j < 3; j++) {
        if (Math.abs(a[i][j]) > off) {
          off = Math.abs(a[i][j]);
          p = i;
          q = j;
        }
      }
    }
    if (off < 1e-18) break;
    const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
    const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const c = 1 / Math.sqrt(t * t + 1);
    const s = t * c;
    const R: Mat3 = identity3();
    R[p][p] = c;
    R[q][q] = c;
    R[p][q] = s;
    R[q][p] = -s;
    const A2 = matMul(matMul(transpose(R), a), R);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) a[i][j] = A2[i][j];
    V = matMul(V, R);
  }
  const idx = [0, 1, 2].sort((i, j) => a[j][j] - a[i][i]);
  return {
    values: idx.map((i) => a[i][i]),
    vectors: [0, 1, 2].map((r) => idx.map((i) => V[r][i])),
  };
}

export interface SVD {
  U: Mat3;
  sigma: number[];
  V: Mat3;
  rank: number;
}

/**
 * SVD: A = U Σ Vᵀ。
 *
 * 做法: 对 AᵀA 做特征分解得到 V 与 σ²; 再由 u_i = A v_i / σ_i 得 U。
 *
 * ⚠️ σ_i = 0 时 u_i 无法这样算(除以零)。此时该列可以是任何与前面
 * 各列正交的单位向量 —— 它对应 A 的**左零空间**, 乘 Σ⁺ 时会被零掉,
 * 取哪个都不影响 A⁺。这里用 Gram-Schmidt 补一个正交向量, 保证 U
 * 仍是正交阵(否则后面验证 U 正交性的断言会失败)。
 *
 * 秩由 σ 相对最大奇异值的比值判定: σ_i > σ_max·tol。判秩本质上是
 * "多小算零", 这个阈值是全部主观性所在, 显式暴露而不是藏起来。
 *
 * ⚠️ tol 不能取 1e-10 那么小。本课经 AᵀA 求奇异值, 这一步把条件数
 * **平方**, 于是精度减半: 数学上精确为零的奇异值, 实际算出来在
 * √ε ≈ 1e-8 量级。实测 [[1,2,3],[2,4,6],[1,1,1]](真实秩 2)算出
 * σ₃=2.24e-8, 用 1e-10 会被判成满秩, 于是 A⁺ 里出现 1/2.24e-8 这个
 * 巨大的数 —— Penrose 第④条偏差 1.1e+1, 伪逆整个是错的, 最小范数解
 * 也大了十倍。取 1e-7 才能把这种"数值零"正确归零。
 */
export function svd(A: Mat3, tol = 1e-7): SVD {
  const { values, vectors: V } = symmetricEigen(matMul(transpose(A), A));
  const sigma = values.map((v) => Math.sqrt(Math.max(0, v)));
  const sMax = Math.max(...sigma, 0);
  const rank = sigma.filter((s) => s > sMax * tol && s > 1e-14).length;

  const U: Mat3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const cols: Vec3[] = [];
  for (let k = 0; k < 3; k++) {
    const v: Vec3 = [V[0][k], V[1][k], V[2][k]];
    let u: Vec3;
    if (k < rank) {
      u = scale3(matVec(A, v), 1 / sigma[k]);
    } else {
      // 左零空间: 补一个与已有列正交的单位向量
      u = orthoComplement(cols);
    }
    cols.push(u);
    for (let i = 0; i < 3; i++) U[i][k] = u[i];
  }
  return { U, sigma, V, rank };
}

/** 找一个与给定向量组都正交的单位向量(Gram-Schmidt 试三个基向量)。 */
function orthoComplement(existing: Vec3[]): Vec3 {
  for (const e of [[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Vec3[]) {
    let v: Vec3 = [...e];
    for (const u of existing) {
      const d = dot3(v, u);
      v = sub3(v, scale3(u, d));
    }
    if (norm3(v) > 1e-6) return normalize3(v);
  }
  return [0, 0, 1];
}

/**
 * Moore-Penrose 伪逆: A⁺ = V Σ⁺ Uᵀ。
 * Σ⁺ 把非零奇异值取倒数, **零仍取零** —— 这是全部关窍。
 */
export function pinv(A: Mat3, tol = 1e-7): Mat3 {
  const { U, sigma, V, rank } = svd(A, tol);
  const Sp: Mat3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let k = 0; k < rank; k++) Sp[k][k] = 1 / sigma[k];
  return matMul(matMul(V, Sp), transpose(U));
}

/** 四条 Penrose 条件的偏差(都应为 0)。 */
export function penroseResiduals(A: Mat3, P: Mat3 = pinv(A)): number[] {
  const AP = matMul(A, P);
  const PA = matMul(P, A);
  return [
    maxDiff(matMul(AP, A), A),
    maxDiff(matMul(PA, P), P),
    maxDiff(transpose(AP), AP),
    maxDiff(transpose(PA), PA),
  ];
}

/** 伪逆解 x⁺ = A⁺b。 */
export function pinvSolve(A: Mat3, b: Vec3): Vec3 {
  return matVec(pinv(A), b);
}

/** 残差 |Ax − b|。 */
export function residual(A: Mat3, x: Vec3, b: Vec3): number {
  return norm3(sub3(matVec(A, x), b));
}

/** 列空间的一组正交基(U 的前 rank 列)。b 投到这里才解得动。 */
export function columnSpaceBasis(A: Mat3): Vec3[] {
  const { U, rank } = svd(A);
  return [...Array(rank).keys()].map((k) => [U[0][k], U[1][k], U[2][k]] as Vec3);
}

/** 零空间的一组正交基(V 的后 3−rank 列)。解沿这些方向平移不改残差。 */
export function nullSpaceBasis(A: Mat3): Vec3[] {
  const { V, rank } = svd(A);
  return [...Array(3 - rank).keys()].map((i) => {
    const k = rank + i;
    return [V[0][k], V[1][k], V[2][k]] as Vec3;
  });
}

/** 行空间的一组正交基(V 的前 rank 列)。x⁺ 一定落在这里。 */
export function rowSpaceBasis(A: Mat3): Vec3[] {
  const { V, rank } = svd(A);
  return [...Array(rank).keys()].map((k) => [V[0][k], V[1][k], V[2][k]] as Vec3);
}

/** A A⁺ = 到列空间的正交投影; A⁺ A = 到行空间的正交投影。 */
export function projections(A: Mat3): { toCol: Mat3; toRow: Mat3 } {
  const P = pinv(A);
  return { toCol: matMul(A, P), toRow: matMul(P, A) };
}

/** 投影矩阵的验证: P² = P 且 Pᵀ = P。 */
export function projectionResiduals(P: Mat3): { idempotent: number; symmetric: number } {
  return {
    idempotent: maxDiff(matMul(P, P), P),
    symmetric: maxDiff(transpose(P), P),
  };
}

export interface Preset {
  id: string;
  label: string;
  A: Mat3;
  b: Vec3;
  note: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'invertible', label: '满秩可逆',
    A: [[2, 1, 0], [1, 3, 1], [0, 1, 4]], b: [1, 2, 3],
    note: 'A⁺ = A⁻¹，解唯一',
  },
  {
    id: 'rank2', label: '秩 2（两行成比例）',
    A: [[1, 2, 3], [2, 4, 6], [1, 1, 1]], b: [6, 12, 3],
    note: '解有无穷多，取范数最小的',
  },
  {
    id: 'rank2-incons', label: '秩 2 且不相容',
    A: [[1, 2, 3], [2, 4, 6], [1, 1, 1]], b: [6, 1, 3],
    note: 'b 够不着列空间，先投影',
  },
  {
    id: 'rank1', label: '秩 1（全部成比例）',
    A: [[1, 2, 3], [2, 4, 6], [3, 6, 9]], b: [1, 2, 3],
    note: '列空间是一条直线',
  },
  {
    id: 'zerocol', label: '秩 2（有一列全零）',
    A: [[1, 0, 2], [0, 0, 1], [3, 0, 1]], b: [1, 1, 1],
    note: '第二个未知数完全不起作用',
  },
  {
    id: 'zero', label: '零矩阵',
    A: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], b: [1, 2, 3],
    note: 'A⁺ 也是零矩阵，x⁺ = 0',
  },
];
