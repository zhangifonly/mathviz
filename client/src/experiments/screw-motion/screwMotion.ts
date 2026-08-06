/**
 * 螺旋运动与 Chasles 定理 (SE(3))
 *
 * 上一课(李代数 so(3))结尾提了一句"机器人学里每个关节对应一个旋量",
 * 但旋量是什么没讲。这门课补上, 并给出它背后的定理:
 *
 *   **Chasles 定理**: 任何刚体运动(旋转 + 平移)都可以写成
 *   "绕某条轴旋转 θ 角, 同时沿**同一条轴**平移 d" —— 一个螺旋运动。
 *
 * 这不是显然的。一般的刚体运动是 x ↦ Rx + t, 旋转轴过原点而平移
 * 方向任意, 看上去与螺旋(轴与平移方向必须重合)是两回事。定理说:
 * 换一条平行的轴(即把轴挪到合适位置), 两者就统一了。
 *
 * 分解方法(本课的核心计算):
 *   1. 由 R 取出转轴 ω̂ 与转角 θ(即上一课的 log)。
 *   2. 把平移 t 分解成**沿轴**与**垂直于轴**两部分:
 *        d = t · ω̂                    (螺距: 沿轴平移量, 无法被消去)
 *        t⊥ = t − d·ω̂                 (垂直分量: 可以靠挪轴消去)
 *   3. 垂直分量对应绕一条**平行轴**的纯旋转。该轴上一点 c 满足
 *        (I − R) c = t⊥
 *      在垂直于 ω̂ 的平面内, (I − R) 可逆(θ ≠ 0), 解出 c 即轴的位置。
 *
 * 于是 (ω̂, θ, d, c) 就是螺旋参数: 轴的方向、转角、螺距、轴的位置。
 *
 * 两个退化情形必须单独处理, 否则 (I − R) 不可逆:
 *   θ = 0     纯平移。轴方向取平移方向, 螺距 = |t|, 轴位置不唯一。
 *   θ = π     R 是对合, (I−R) 在垂直平面上仍可逆, 但取轴要换公式
 *             (与上一课 log 的 θ≈π 分支同一个原因)。
 */

export type Vec3 = [number, number, number];
export type Mat3 = number[][];

export function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function norm(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2]);
}

export function scale(v: Vec3, k: number): Vec3 {
  return [v[0] * k, v[1] * k, v[2] * k];
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function normalize(v: Vec3): Vec3 {
  const n = norm(v);
  if (n < 1e-15) return [0, 0, 0];
  return scale(v, 1 / n);
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

/** Rodrigues: 绕单位轴 k 转 θ。与上一课一致。 */
export function rotationMatrix(axis: Vec3, theta: number): Mat3 {
  const k = normalize(axis);
  if (norm(k) < 1e-15) return identity3();
  const [x, y, z] = k;
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const v = 1 - c;
  return [
    [c + x * x * v, x * y * v - z * s, x * z * v + y * s],
    [y * x * v + z * s, c + y * y * v, y * z * v - x * s],
    [z * x * v - y * s, z * y * v + x * s, c + z * z * v],
  ];
}

/** 刚体运动 x ↦ Rx + t */
export interface RigidMotion {
  R: Mat3;
  t: Vec3;
}

export function applyMotion(m: RigidMotion, p: Vec3): Vec3 {
  return add(matVec(m.R, p), m.t);
}

/** 由转轴/转角/平移直接构造 */
export function makeMotion(axis: Vec3, theta: number, t: Vec3): RigidMotion {
  return { R: rotationMatrix(axis, theta), t };
}

/** 从旋转矩阵取出轴与角(与上一课 log 同一套, 含 θ≈π 分支)。 */
export function axisAngleOf(R: Mat3): { axis: Vec3; theta: number } {
  const tr = R[0][0] + R[1][1] + R[2][2];
  const cosT = Math.max(-1, Math.min(1, (tr - 1) / 2));
  const theta = Math.acos(cosT);
  if (theta < 1e-10) return { axis: [0, 0, 1], theta: 0 };
  if (Math.PI - theta < 1e-6) {
    // θ≈π: (R−Rᵀ) 退化, 改从 R+I = 2 n nᵀ 取轴
    const M: Mat3 = R.map((row, i) => row.map((v, j) => v + (i === j ? 1 : 0)));
    let best = 0;
    let bn = -1;
    for (let j = 0; j < 3; j++) {
      const c: Vec3 = [M[0][j], M[1][j], M[2][j]];
      if (norm(c) > bn) {
        bn = norm(c);
        best = j;
      }
    }
    return { axis: normalize([M[0][best], M[1][best], M[2][best]]), theta };
  }
  const s = 2 * Math.sin(theta);
  return {
    axis: normalize([
      (R[2][1] - R[1][2]) / s,
      (R[0][2] - R[2][0]) / s,
      (R[1][0] - R[0][1]) / s,
    ]),
    theta,
  };
}

/** 螺旋参数: 轴方向、轴上一点、转角、沿轴平移(螺距)。 */
export interface Screw {
  axis: Vec3;       // 单位向量
  point: Vec3;      // 轴上一点
  theta: number;    // 转角
  d: number;        // 沿轴平移量
  isPureTranslation: boolean;
}

/**
 * Chasles 分解: 把任意刚体运动写成螺旋运动。
 *
 * 关键一步是解 (I − R) c = t⊥ 求轴的位置 c。这个方程在整个 ℝ³ 上
 * **无解**(I−R 奇异, 零空间正是轴方向), 但限制到垂直于轴的平面上
 * 就可逆。这里用一个封闭公式绕开解线性方程组:
 *
 *   c = ( t⊥ + cot(θ/2) · (ω̂ × t⊥) ) / 2
 *
 * 由来: 在垂直平面内, (I−R) 作用相当于"转 θ 再相减", 其逆可以用
 * 半角余切表出。θ→0 时 cot(θ/2)→∞ —— 正对应"纯平移时轴跑到无穷远",
 * 所以必须先把 θ=0 单独挑出去。
 */
export function chaslesDecompose(m: RigidMotion, eps = 1e-9): Screw {
  const { axis, theta } = axisAngleOf(m.R);

  // 纯平移: 没有转轴可言, 取平移方向当轴
  if (theta < eps) {
    const n = norm(m.t);
    return {
      axis: n > eps ? normalize(m.t) : [0, 0, 1],
      point: [0, 0, 0],
      theta: 0,
      d: n,
      isPureTranslation: true,
    };
  }

  const d = dot(m.t, axis);              // 沿轴分量: 消不掉
  const tPerp = sub(m.t, scale(axis, d)); // 垂直分量: 靠挪轴消掉

  const cot = 1 / Math.tan(theta / 2);
  const c = scale(add(tPerp, scale(cross(axis, tPerp), cot)), 0.5);

  return { axis, point: c, theta, d, isPureTranslation: false };
}

/**
 * 由螺旋参数重建刚体运动 —— 用于**验证分解是否正确**。
 * 绕过 point 的轴转 θ, 再沿轴平移 d:
 *   x ↦ R(x − c) + c + d·ω̂
 * 展开即 R x + (c − R c + d·ω̂), 于是 t = c − R c + d·ω̂。
 */
export function screwToMotion(s: Screw): RigidMotion {
  if (s.isPureTranslation) {
    return { R: identity3(), t: scale(s.axis, s.d) };
  }
  const R = rotationMatrix(s.axis, s.theta);
  const t = add(sub(s.point, matVec(R, s.point)), scale(s.axis, s.d));
  return { R, t };
}

/** 两个刚体运动的差距(R 的最大元素差, 与 t 的距离), 用于验证往返。 */
export function motionDiff(a: RigidMotion, b: RigidMotion): { rot: number; trans: number } {
  let rot = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) rot = Math.max(rot, Math.abs(a.R[i][j] - b.R[i][j]));
  }
  return { rot, trans: norm(sub(a.t, b.t)) };
}

/**
 * 沿螺旋运动插值: u∈[0,1] 时转 u·θ、沿轴移 u·d。
 * u=0 是原位, u=1 是终位。这条路径就是**螺旋线** ——
 * 刚体运动的"最自然"的走法, 也是机器人做直线-旋转复合插补的依据。
 */
export function screwInterpolate(s: Screw, u: number): RigidMotion {
  if (s.isPureTranslation) {
    return { R: identity3(), t: scale(s.axis, s.d * u) };
  }
  return screwToMotion({ ...s, theta: s.theta * u, d: s.d * u });
}

/** 点 p 在螺旋运动下扫出的轨迹(一条螺旋线)。 */
export function screwTrajectory(s: Screw, p: Vec3, samples = 80): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i <= samples; i++) {
    out.push(applyMotion(screwInterpolate(s, i / samples), p));
  }
  return out;
}

/**
 * 点到螺旋轴的距离。轴上的点距离为 0 —— 它们只沿轴平移, 不绕转,
 * 这是"轴"这个词的实际含义, 也是画面上最该看出来的一件事。
 */
export function distanceToAxis(s: Screw, p: Vec3): number {
  const v = sub(p, s.point);
  return norm(cross(v, s.axis));
}

/** 螺距(每转一整圈沿轴前进的距离), 工程上的 pitch。 */
export function pitchPerTurn(s: Screw): number {
  if (Math.abs(s.theta) < 1e-12) return Infinity;
  return (s.d / s.theta) * Math.PI * 2;
}

export interface Preset {
  id: string;
  label: string;
  axis: Vec3;
  theta: number;
  t: Vec3;
  note: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'general', label: '一般刚体运动',
    axis: [0, 0, 1], theta: Math.PI / 2, t: [1, 2, 3],
    note: '轴挪到 (−0.5, 1.5)，螺距 3',
  },
  {
    id: 'perp', label: '平移完全垂直于轴',
    axis: [0, 0, 1], theta: Math.PI / 2, t: [1, 2, 0],
    note: '螺距 0：挪轴后成纯旋转',
  },
  {
    id: 'along', label: '平移完全沿轴',
    axis: [0, 0, 1], theta: Math.PI / 2, t: [0, 0, 5],
    note: '轴不用挪，本来就是螺旋',
  },
  {
    id: 'tilted', label: '斜轴',
    axis: [1, 1, 1], theta: 1.6, t: [0.3, -1, 2],
    note: '轴与坐标轴无关',
  },
  {
    id: 'tiny', label: '转角极小',
    axis: [0, 0, 1], theta: 0.08, t: [1, 2, 0.4],
    note: '轴跑得很远 —— 逼近纯平移',
  },
];
