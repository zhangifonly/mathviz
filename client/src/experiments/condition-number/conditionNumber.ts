/**
 * 矩阵条件数与数值稳定性
 *
 * 项目里已经有 SVD、LU、QR、Cholesky、最小二乘一整套分解课, 但都在讲
 * "怎么算"; 唯独没有讲"什么时候算不准"。numerical-analysis 那课只留了
 * 一句"条件数衡量问题对输入扰动的敏感度", 没有展开。这门课补上。
 *
 * 核心问题: 解 Ax = b 时, 若 b 有一点点误差(测量误差、舍入误差),
 * 解 x 会差多少?
 *
 *   相对误差放大倍数 ≤ κ(A) = ‖A‖·‖A⁻¹‖
 *
 * 用 2-范数时 κ(A) = σ_max / σ_min, 即最大奇异值比最小奇异值。
 *
 * **几何图像**(这门课要看的东西): A 把单位球面映成一个椭球, 三条半轴
 * 长正是三个奇异值。于是
 *
 *   κ = 最长半轴 / 最短半轴 = 椭球有多扁
 *
 * 球是各向同性的, 输入误差往哪个方向都一样; 椭球把某些方向压扁了,
 * 那些方向上的信息几乎丢光 —— 反过来解的时候就要把误差放大回去。
 * κ 大 = 椭球扁 = 病态。这比任何范数不等式都直观。
 *
 * ⚠️ 一个常见误解: 行列式小 ≠ 病态。det 是三个奇异值之**积**,
 * 而 κ 是最大与最小之**比**。0.001·I 的行列式是 1e-9, 但 κ=1,
 * 完美良态。本课用 detVsCond() 把这件事摆出来。
 */

export type Vec3 = [number, number, number];
export type Mat3 = number[][];

export function matVec(A: Mat3, v: Vec3): Vec3 {
  return [
    A[0][0] * v[0] + A[0][1] * v[1] + A[0][2] * v[2],
    A[1][0] * v[0] + A[1][1] * v[1] + A[1][2] * v[2],
    A[2][0] * v[0] + A[2][1] * v[1] + A[2][2] * v[2],
  ];
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

export function norm3(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2]);
}

export function sub3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function identity3(): Mat3 {
  return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
}

/**
 * 对称矩阵的特征分解, 用 Jacobi 旋转法。
 *
 * 为什么用 Jacobi 而不是解特征多项式: 三次方程的根公式在有重根或
 * 接近重根时相消误差很大, 而本课偏偏要处理接近奇异(σ 相差 10⁸ 倍)
 * 的矩阵。Jacobi 是逐次消去非对角元, 对对称阵**无条件收敛**且精度
 * 与条件数无关 —— 讲数值稳定的课, 自己的实现不能是不稳定的。
 *
 * 返回特征值(降序)与对应的正交特征向量(按列)。
 */
export function symmetricEigen(M: Mat3): { values: number[]; vectors: Mat3 } {
  const a: Mat3 = M.map((r) => [...r]);
  let V: Mat3 = identity3();

  for (let sweep = 0; sweep < 60; sweep++) {
    // 最大的非对角元
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

/**
 * 奇异值(降序)。σ_i = √λ_i(AᵀA)。
 * 数值上 AᵀA 会把条件数**平方**, 但这里只用于取奇异值的量级,
 * 且 Jacobi 精度足够; 真正要求高精度时应直接对 A 做单边 Jacobi。
 * 这个取舍在课里也说明了 —— 它本身就是数值稳定的一个例子。
 */
export function singularValues(A: Mat3): number[] {
  const { values } = symmetricEigen(matMul(transpose(A), A));
  return values.map((v) => Math.sqrt(Math.max(0, v)));
}

/** A 把单位球面映成椭球: 三条半轴的方向(右奇异向量映过去)与长度(σ)。 */
export function ellipsoidAxes(A: Mat3): Array<{ dir: Vec3; length: number }> {
  const { values, vectors } = symmetricEigen(matMul(transpose(A), A));
  return [0, 1, 2].map((k) => {
    const v: Vec3 = [vectors[0][k], vectors[1][k], vectors[2][k]];
    const img = matVec(A, v);
    const len = Math.sqrt(Math.max(0, values[k]));
    const n = norm3(img);
    return { dir: n > 1e-14 ? ([img[0] / n, img[1] / n, img[2] / n] as Vec3) : v, length: len };
  });
}

/** 2-范数条件数 κ = σ_max / σ_min。奇异时返回 Infinity。 */
export function conditionNumber(A: Mat3): number {
  const s = singularValues(A);
  const smin = s[2];
  if (smin < 1e-15) return Infinity;
  return s[0] / smin;
}

/**
 * 行列式与条件数的对照 —— 澄清"行列式小就是病态"这个常见误解。
 * det 是奇异值之积, κ 是最大与最小之比, 两者可以任意组合。
 */
export function detVsCond(A: Mat3): { det: number; cond: number; sigmas: number[] } {
  return { det: det3(A), cond: conditionNumber(A), sigmas: singularValues(A) };
}

/** 3×3 求逆(伴随矩阵法)。奇异时返回 null。 */
export function inverse3(A: Mat3): Mat3 | null {
  const d = det3(A);
  if (Math.abs(d) < 1e-300) return null;
  const c: Mat3 = [
    [
      A[1][1] * A[2][2] - A[1][2] * A[2][1],
      A[0][2] * A[2][1] - A[0][1] * A[2][2],
      A[0][1] * A[1][2] - A[0][2] * A[1][1],
    ],
    [
      A[1][2] * A[2][0] - A[1][0] * A[2][2],
      A[0][0] * A[2][2] - A[0][2] * A[2][0],
      A[0][2] * A[1][0] - A[0][0] * A[1][2],
    ],
    [
      A[1][0] * A[2][1] - A[1][1] * A[2][0],
      A[0][1] * A[2][0] - A[0][0] * A[2][1],
      A[0][0] * A[1][1] - A[0][1] * A[1][0],
    ],
  ];
  return c.map((row) => row.map((v) => v / d));
}

/** 解 Ax = b。 */
export function solve(A: Mat3, b: Vec3): Vec3 | null {
  const inv = inverse3(A);
  return inv ? matVec(inv, b) : null;
}

/**
 * 扰动实验: 给 b 加一个相对大小为 rel 的扰动, 看解的相对变化。
 *
 *   放大倍数 = (‖Δx‖/‖x‖) / (‖Δb‖/‖b‖)
 *
 * 理论上界正是 κ(A)。扰动方向取**最坏方向**时能取到上界; 随机方向
 * 一般达不到, 所以本函数同时给出两者 —— 让"上界"这个词有实感。
 *
 * 最坏方向的取法: Δb 沿最小奇异值对应的**左**奇异方向, 此时 A⁻¹
 * 把它放大 1/σ_min 倍; 同时 b 取沿最大左奇异方向, 使 ‖x‖ 尽量小。
 */
export function perturbationTest(
  A: Mat3, b: Vec3, dir: Vec3, rel = 1e-6,
): { amplification: number; x: Vec3; xPerturbed: Vec3 } | null {
  const x = solve(A, b);
  if (!x) return null;
  const bn = norm3(b);
  const dn = norm3(dir) || 1;
  const db: Vec3 = [
    (dir[0] / dn) * bn * rel,
    (dir[1] / dn) * bn * rel,
    (dir[2] / dn) * bn * rel,
  ];
  const x2 = solve(A, [b[0] + db[0], b[1] + db[1], b[2] + db[2]]);
  if (!x2) return null;
  const relX = norm3(sub3(x2, x)) / norm3(x);
  return { amplification: relX / rel, x, xPerturbed: x2 };
}

/** 最坏扰动方向(最小奇异值对应的左奇异向量)。 */
export function worstDirection(A: Mat3): Vec3 {
  const axes = ellipsoidAxes(A);
  return axes[2].dir;
}

/** 使放大最接近上界的右端项(最大奇异值对应的左奇异向量)。 */
export function worstRHS(A: Mat3): Vec3 {
  return ellipsoidAxes(A)[0].dir;
}

export interface Preset {
  id: string;
  label: string;
  A: Mat3;
  note: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'identity', label: '单位阵', A: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    note: 'κ=1，球还是球',
  },
  {
    id: 'scaled', label: '整体缩小 1000 倍',
    A: [[0.001, 0, 0], [0, 0.001, 0], [0, 0, 0.001]],
    note: 'det=1e−9 却完全良态',
  },
  {
    id: 'mild', label: '轻度拉伸', A: [[3, 0, 0], [0, 1.5, 0], [0, 0, 1]],
    note: 'κ=3，椭球略扁',
  },
  {
    id: 'ill', label: '病态', A: [[1, 0.999, 0], [0.999, 1, 0], [0, 0, 1]],
    note: '两列几乎平行，椭球压成薄片',
  },
  {
    id: 'severe', label: '重度病态', A: [[1, 1, 1], [1, 1.0001, 1], [1, 1, 1.0001]],
    note: 'κ 上万，解几乎不可信',
  },
  {
    id: 'skew', label: '斜切', A: [[1, 2, 0], [0, 1, 0], [0, 0, 1]],
    note: '非对称也一样看椭球',
  },
];
