/**
 * SO(3) 的拓扑: 提升、双重覆盖与 π₁(SO(3)) = ℤ₂
 *
 * 上一课(四元数与三维旋转)说到 q 与 −q 是同一个旋转, 顺带提了一句
 * "转 360° 不复原、转 720° 才复原"。这门课把那句话兑现成可以看、
 * 可以量的东西。
 *
 * 核心对象是**提升**: 绕固定轴从 0 转到 turns·2π, 在旋转群 SO(3) 里
 * 画出一条道路; 因为首尾姿态相同, 它是一条**环路**。把它提到双重覆盖
 * S³ 上, 得到四元数道路
 *
 *   q(s) = (cos(s·turns·π), sin(s·turns·π)·n)     s ∈ [0,1]
 *
 * 起点恒为 1, 终点是 **(−1)^turns**:
 *   turns 奇数 → 终点 −1, 提升**不闭合**
 *   turns 偶数 → 终点 +1, 提升闭合
 *
 * 这一个符号就是全部内容。S³ 单连通, 所以 SO(3) 里的环路能否收缩,
 * 完全取决于它的提升闭不闭合; 于是环路只分两类, 加法是模 2 ——
 * 这就是 π₁(SO(3)) = ℤ₂。物理上它叫旋量: 电子转一圈变号, 转两圈才复原。
 *
 * ⚠️ 本课**不**试图动画演示腰带把戏。那个同伦(Dirac 把戏)的显式构造
 * 相当微妙, 我几次尝试写出的版本要么端点会漂、要么拧转根本不减少,
 * 与其放一个自己都验不过的"示意动画", 不如老实展示能算准的东西:
 * 提升道路本身。它才是把戏成立的真正原因, 而且每个数字都可检验。
 */

export type Quat = [number, number, number, number]; // [w, x, y, z]
export type Vec3 = [number, number, number];

/** 绕单位轴 n 转 angle 的单位四元数(半角, 见上一课)。 */
export function quatAxisAngle(axis: Vec3, angle: number): Quat {
  const n = Math.hypot(axis[0], axis[1], axis[2]) || 1;
  const h = angle / 2;
  const s = Math.sin(h) / n;
  return [Math.cos(h), axis[0] * s, axis[1] * s, axis[2] * s];
}

export function qNorm(q: Quat): number {
  return Math.hypot(q[0], q[1], q[2], q[3]);
}

export function qNormalize(q: Quat): Quat {
  const n = qNorm(q);
  if (n < 1e-15) return [1, 0, 0, 0];
  return [q[0] / n, q[1] / n, q[2] / n, q[3] / n];
}

/** 用共轭作用旋转向量。 */
export function rotateVec(q: Quat, v: Vec3): Vec3 {
  const [w, x, y, z] = qNormalize(q);
  const t: Vec3 = [
    2 * (y * v[2] - z * v[1]),
    2 * (z * v[0] - x * v[2]),
    2 * (x * v[1] - y * v[0]),
  ];
  return [
    v[0] + w * t[0] + (y * t[2] - z * t[1]),
    v[1] + w * t[1] + (z * t[0] - x * t[2]),
    v[2] + w * t[2] + (x * t[1] - y * t[0]),
  ];
}

/** 提升道路上的一点。 */
export interface LiftPoint {
  s: number;   // 环路参数 0..1
  q: Quat;     // S³ 上的提升
  angle: number; // 对应的旋转角 = s·turns·2π
}

/**
 * 把"转 turns 圈"这条 SO(3) 环路提升到 S³。
 * 起点恒为 1; 终点是 (−1)^turns —— 全课的关键就在这个符号。
 *
 * `wobble` 让转轴沿途缓缓摆动(仍绕回原方向, 所以依旧是环路)。
 *
 * ⚠️ wobble=0(轴固定)时提升是 S³ 上的一条**测地线**, 立体投影后
 * 是一条直线 —— 转 1 圈和转 2 圈画出来是同一条竖线, "回到原点"
 * 完全看不出来。截图里两种情形长得一模一样, 就是这个原因。
 * 让轴摆一点, 提升成为真正的空间曲线, 闭不闭合才一眼可辨。
 * 这不改变任何拓扑结论: 终点仍是 (−1)^turns。
 */
export function liftPath(
  turns: number, axis: Vec3 = [0, 0, 1], samples = 240, wobble = 0.55,
): LiftPoint[] {
  const out: LiftPoint[] = [];
  const n = Math.hypot(axis[0], axis[1], axis[2]) || 1;
  const u: Vec3 = [axis[0] / n, axis[1] / n, axis[2] / n];
  // 与 u 正交的两个方向, 用来让轴在锥面上绕一圈
  const helper: Vec3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const e1 = normalizeVec(crossVec(u, helper));
  const e2 = normalizeVec(crossVec(u, e1));
  for (let i = 0; i <= samples; i++) {
    const s = i / samples;
    const angle = s * turns * Math.PI * 2;
    // 轴绕 u 摆动一整圈: s=0 与 s=1 处方向相同, 保证仍是环路
    const w = wobble * Math.sin(s * Math.PI * 2);
    const w2 = wobble * (Math.cos(s * Math.PI * 2) - 1);
    const ax: Vec3 = [
      u[0] + e1[0] * w + e2[0] * w2,
      u[1] + e1[1] * w + e2[1] * w2,
      u[2] + e1[2] * w + e2[2] * w2,
    ];
    out.push({ s, q: quatAxisAngle(ax, angle), angle });
  }
  return out;
}

function crossVec(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function normalizeVec(v: Vec3): Vec3 {
  const n = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / n, v[1] / n, v[2] / n];
}

/** 提升的终点(理论值 (−1)^turns 的 w 分量)。 */
export function liftEndpointW(turns: number): number {
  return Math.cos(turns * Math.PI);
}

/** 提升是否闭合 ⟺ 环路是否可收缩 ⟺ 圈数是否为偶。 */
export function isContractible(turns: number): boolean {
  return Math.abs(Math.round(turns)) % 2 === 0;
}

/** 同伦类: π₁(SO(3)) = ℤ₂, 只看圈数奇偶。 */
export function homotopyClass(turns: number): 0 | 1 {
  return (Math.abs(Math.round(turns)) % 2) as 0 | 1;
}

/**
 * ℤ₂ 的群运算: 两条环路首尾相接, 同伦类相加(模 2)。
 * 这解释了"两次 360° 等于一次 720°, 而 720° 是平凡的"。
 */
export function classAdd(a: number, b: number): 0 | 1 {
  return ((homotopyClass(a) + homotopyClass(b)) % 2) as 0 | 1;
}

/**
 * 把 S³ 上的四元数投影到三维便于观看。
 *
 * 用**立体投影**(从 (−1,0,0,0) 打出), 它把 S³∖{−1} 一一映到 ℝ³:
 *   (w, v) ↦ v / (1 + w)
 *
 * 选它的理由: 单位元 1 映到原点, 而对跖点 −1 跑到无穷远 —— 于是
 * "提升终点是 +1 还是 −1"在画面上极其醒目: 闭合的道路回到原点,
 * 不闭合的道路一路奔向画外。这正是本课要看的那件事。
 *
 * 靠近 −1 时坐标发散, 由 clip 截断(返回 null), 调用方断开线段。
 */
export function stereographic(q: Quat, clip = 6): Vec3 | null {
  const [w, x, y, z] = qNormalize(q);
  const d = 1 + w;
  if (d < 1e-6) return null;
  const p: Vec3 = [x / d, y / d, z / d];
  if (Math.hypot(p[0], p[1], p[2]) > clip) return null;
  return p;
}

/** 投影后的提升道路, 按 null 断成若干段(逼近 −1 处会断开)。 */
export function projectedLift(
  turns: number, axis: Vec3 = [0, 0, 1], samples = 240, clip = 6, wobble = 0.55,
): Vec3[][] {
  const segs: Vec3[][] = [];
  let cur: Vec3[] = [];
  for (const pt of liftPath(turns, axis, samples, wobble)) {
    const p = stereographic(pt.q, clip);
    if (p === null) {
      if (cur.length > 1) segs.push(cur);
      cur = [];
      continue;
    }
    cur.push(p);
  }
  if (cur.length > 1) segs.push(cur);
  return segs;
}

export interface Preset {
  id: string;
  label: string;
  turns: number;
  note: string;
}

export const PRESETS: Preset[] = [
  { id: 't1', label: '转 360°（1 圈）', turns: 1, note: '提升到 −1，不闭合' },
  { id: 't2', label: '转 720°（2 圈）', turns: 2, note: '提升回到 +1，闭合' },
  { id: 't3', label: '转 1080°（3 圈）', turns: 3, note: '又是 −1，与 1 圈同类' },
  { id: 't4', label: '转 1440°（4 圈）', turns: 4, note: '回到 +1，平凡' },
];
