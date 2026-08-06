/**
 * 四元数与三维旋转
 *
 * 本项目已有「三维旋转矩阵」一课, 讲欧拉角与万向锁, 结尾只留了一句
 * 「工程上常改用四元数来绕开这个麻烦」就收了。这门课接着那句往下讲:
 * 四元数到底是什么, 为什么它能转, 以及"绕开麻烦"具体绕开的是什么。
 *
 * 一个四元数写作 q = w + xi + yj + zk, 乘法由 i² = j² = k² = ijk = −1
 * 定出。关键的三件事:
 *
 * 1. **单位四元数编码旋转**: 绕单位轴 n 转 θ 角, 对应
 *        q = (cos(θ/2), sin(θ/2)·n)
 *    注意是**半角**。作用方式是共轭 v' = q v q⁻¹, 转一圈用了两次 q,
 *    半角正好补回来 —— 半角不是凑出来的, 是共轭作用的必然结果。
 *
 * 2. **双重覆盖**: q 与 −q 给出**同一个**旋转(共轭式里 q 出现两次,
 *    负号相消)。所以单位四元数球面 S³ 是旋转群 SO(3) 的双重覆盖。
 *    这解释了"转 720° 才回到原状"这类现象。
 *
 * 3. **插值**: 两个姿态之间做球面线性插值(SLERP), 得到的是匀速的、
 *    最短路径的旋转。欧拉角逐分量线性插值做不到这一点 —— 这才是
 *    工程上真正换用四元数的原因, 万向锁只是其中一个症状。
 */

export type Quat = [number, number, number, number]; // [w, x, y, z]
export type Vec3 = [number, number, number];

export function qMul(a: Quat, b: Quat): Quat {
  const [aw, ax, ay, az] = a;
  const [bw, bx, by, bz] = b;
  return [
    aw * bw - ax * bx - ay * by - az * bz,
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
  ];
}

export function qConj(q: Quat): Quat {
  return [q[0], -q[1], -q[2], -q[3]];
}

export function qNorm(q: Quat): number {
  return Math.hypot(q[0], q[1], q[2], q[3]);
}

export function qNormalize(q: Quat): Quat {
  const n = qNorm(q);
  if (n < 1e-15) return [1, 0, 0, 0];
  return [q[0] / n, q[1] / n, q[2] / n, q[3] / n];
}

export function qDot(a: Quat, b: Quat): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

export function qNeg(q: Quat): Quat {
  return [-q[0], -q[1], -q[2], -q[3]];
}

/** 由轴角构造单位四元数。⚠️ 用的是**半角**, 见文件头说明。 */
export function fromAxisAngle(axis: Vec3, angle: number): Quat {
  const n = Math.hypot(axis[0], axis[1], axis[2]);
  if (n < 1e-15) return [1, 0, 0, 0];
  const h = angle / 2;
  const s = Math.sin(h) / n;
  return [Math.cos(h), axis[0] * s, axis[1] * s, axis[2] * s];
}

/**
 * 反解轴角。
 *
 * ⚠️ 角度用 atan2(|向量部|, w) 而不是 acos(w): θ 接近 0 或 2π 时
 * acos 的相对误差放大到 √ε; atan2 版本全程稳定。
 */
export function toAxisAngle(q: Quat): { axis: Vec3; angle: number } {
  const u = qNormalize(q);
  const vLen = Math.hypot(u[1], u[2], u[3]);
  const angle = 2 * Math.atan2(vLen, u[0]);
  if (vLen < 1e-12) return { axis: [0, 0, 1], angle: 0 };
  return { axis: [u[1] / vLen, u[2] / vLen, u[3] / vLen], angle };
}

/** 用共轭作用旋转一个向量: v' = q v q⁻¹(单位四元数时 q⁻¹ = q̄)。 */
export function rotate(q: Quat, v: Vec3): Vec3 {
  const u = qNormalize(q);
  const p: Quat = [0, v[0], v[1], v[2]];
  const r = qMul(qMul(u, p), qConj(u));
  return [r[1], r[2], r[3]];
}

/** 四元数 → 3×3 旋转矩阵(行优先)。用于与旋转矩阵那一课对照。 */
export function toMatrix(q: Quat): number[][] {
  const [w, x, y, z] = qNormalize(q);
  return [
    [1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y)],
    [2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x)],
    [2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y)],
  ];
}

/** 欧拉角(ZYX 顺序, 偏航-俯仰-滚转) → 四元数。用于与 SLERP 做对照。 */
export function fromEuler(yaw: number, pitch: number, roll: number): Quat {
  const qz = fromAxisAngle([0, 0, 1], yaw);
  const qy = fromAxisAngle([0, 1, 0], pitch);
  const qx = fromAxisAngle([1, 0, 0], roll);
  return qMul(qMul(qz, qy), qx);
}

/** 四元数 → 欧拉角(ZYX)。万向锁处 pitch=±90°, 此时 yaw/roll 不唯一。 */
export function toEuler(q: Quat): { yaw: number; pitch: number; roll: number } {
  const [w, x, y, z] = qNormalize(q);
  const sinPitch = 2 * (w * y - z * x);
  // |sinPitch| 达到 1 即万向锁: 此时只有 yaw±roll 有意义, 取 roll=0
  if (Math.abs(sinPitch) >= 1 - 1e-12) {
    const pitch = Math.sign(sinPitch) * (Math.PI / 2);
    return { yaw: 2 * Math.atan2(x, w), pitch, roll: 0 };
  }
  return {
    yaw: Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z)),
    pitch: Math.asin(sinPitch),
    roll: Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y)),
  };
}

/**
 * 球面线性插值(SLERP)。
 *
 * 在单位四元数球面 S³ 上沿大圆匀速走, 于是姿态变化是**匀角速度**的,
 * 并且走的是两个姿态之间的最短旋转路径。
 *
 * ⚠️ 两处必须处理:
 * 1. **取近路**: q 与 −q 是同一个旋转。若 dot < 0, 直接插值会绕远路
 *    (走大圆的长弧), 表现为物体"反着转一大圈"。故先把 b 取反。
 * 2. **夹角极小时退化**: sin(Ω) → 0, 除法失效。此时两姿态几乎相同,
 *    退回线性插值再归一化, 误差可忽略。
 */
export function slerp(a: Quat, b: Quat, t: number): Quat {
  const ua = qNormalize(a);
  let ub = qNormalize(b);
  let d = qDot(ua, ub);
  if (d < 0) {
    ub = qNeg(ub);
    d = -d;
  }
  if (d > 1 - 1e-9) {
    // 几乎重合: 线性插值 + 归一化
    return qNormalize([
      ua[0] + (ub[0] - ua[0]) * t,
      ua[1] + (ub[1] - ua[1]) * t,
      ua[2] + (ub[2] - ua[2]) * t,
      ua[3] + (ub[3] - ua[3]) * t,
    ]);
  }
  const omega = Math.acos(Math.min(1, d));
  const so = Math.sin(omega);
  const k0 = Math.sin((1 - t) * omega) / so;
  const k1 = Math.sin(t * omega) / so;
  return [
    k0 * ua[0] + k1 * ub[0],
    k0 * ua[1] + k1 * ub[1],
    k0 * ua[2] + k1 * ub[2],
    k0 * ua[3] + k1 * ub[3],
  ];
}

/** 两个姿态之间的旋转角(取近路后的实际转角)。 */
export function angleBetweenQuats(a: Quat, b: Quat): number {
  const d = Math.abs(qDot(qNormalize(a), qNormalize(b)));
  return 2 * Math.acos(Math.min(1, d));
}

/**
 * 欧拉角逐分量线性插值 —— 用作**对照组**。
 *
 * 这是很多人下意识的做法: 三个角各自从起点线性走到终点。它的问题是
 * 角速度不匀, 而且路径不是最短的; 靠近万向锁时还会突然甩动。
 * 本课把它与 SLERP 并排画出来, 差别一眼可见。
 */
export function eulerLerp(
  from: { yaw: number; pitch: number; roll: number },
  to: { yaw: number; pitch: number; roll: number },
  t: number,
): Quat {
  const lerpAngle = (x: number, y: number) => {
    // 角度按最短弧插值, 否则 179° → −179° 会绕一整圈
    let d = y - x;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return x + d * t;
  };
  return fromEuler(
    lerpAngle(from.yaw, to.yaw),
    lerpAngle(from.pitch, to.pitch),
    lerpAngle(from.roll, to.roll),
  );
}

/**
 * 沿一条插值路径统计每步转角, 用来量化"匀不匀"。
 * 返回 min/max/total 与 max/min 之比 —— SLERP 的比恒为 1。
 */
export function pathStats(
  f: (t: number) => Quat,
  steps = 24,
): { min: number; max: number; total: number; ratio: number } {
  let prev = f(0);
  let min = Infinity;
  let max = 0;
  let total = 0;
  for (let i = 1; i <= steps; i++) {
    const cur = f(i / steps);
    const d = angleBetweenQuats(prev, cur);
    min = Math.min(min, d);
    max = Math.max(max, d);
    total += d;
    prev = cur;
  }
  return { min, max, total, ratio: min > 1e-12 ? max / min : 1 };
}

export interface Preset {
  id: string;
  label: string;
  from: { yaw: number; pitch: number; roll: number };
  to: { yaw: number; pitch: number; roll: number };
  note: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'wide',
    label: '大角度姿态变化',
    from: { yaw: 0, pitch: 0, roll: 0 },
    to: { yaw: 2.2, pitch: 1.1, roll: -1.6 },
    note: '欧拉插值多走 15%',
  },
  {
    /*
     * 万向锁的真实样子。
     *
     * ⚠️ 起止 pitch 都取 ~90° 还不够 —— 若 pitch 全程不变, 欧拉插值
     * 依然接近测地线(实测只多走 0.3%), 讲不出问题。关键是让 yaw 与
     * roll **反向**变化: 在 pitch=90° 附近这两个角是冗余的(转 yaw 与
     * 转 roll 效果相同), 各自独立线性插值就会互相抵消再绕回来。
     * 实测 SLERP 走 18.1°, 欧拉插值走 343.6° —— 多走近 18 倍。
     */
    id: 'gimbal',
    label: '万向锁附近',
    from: { yaw: -1.5, pitch: 1.5, roll: 1.5 },
    to: { yaw: 1.5, pitch: 1.5, roll: -1.5 },
    note: '18° 的活，欧拉插值转了 343°',
  },
  {
    id: 'small',
    label: '小角度',
    from: { yaw: 0, pitch: 0, roll: 0 },
    to: { yaw: 0.35, pitch: 0.2, roll: 0.1 },
    note: '差别很小，两者都够用',
  },
  {
    id: 'far',
    label: '接近 180°',
    from: { yaw: 0, pitch: 0, roll: 0 },
    to: { yaw: 3.0, pitch: 0.2, roll: 0.1 },
    note: '最短路径的选择开始要紧',
  },
];
