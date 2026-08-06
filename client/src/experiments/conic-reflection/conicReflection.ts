/**
 * 圆锥曲线的反射性质
 *
 * 三条互相独立的课本事实:
 *   椭圆   —— 从一个焦点射出的光, 反射后必过另一个焦点
 *   抛物线 —— 从焦点射出的光, 反射后平行于对称轴
 *   双曲线 —— 射向一个焦点的光, 反射后像是从另一个焦点发出
 *
 * 这门课要说的是: 三条其实是同一条, 而且**不必逐个证**。
 *
 * 统一的理由是费马原理的几何版本:
 *   椭圆是函数 S(P) = |PF₁| + |PF₂| 的等值线。
 *   ∇S = û₁ + û₂ (两个从焦点指向 P 的单位向量之和), 它必然沿
 *   ∠F₁PF₂ 的**角平分线**方向。而等值线的切线垂直于梯度,
 *   于是切线与 PF₁、PF₂ 成等角 —— 这正是反射定律。
 *
 * 双曲线只是把和换成差: D(P) = |PF₁| − |PF₂|, ∇D = û₁ − û₂,
 * 落在外角平分线上, 于是「反射向另一焦点」变成「反射自另一焦点」。
 * 抛物线是 e→1 的极限: F₂ 退到无穷远, û₂ 变成一个固定方向(轴向),
 * 「过第二焦点」于是读作「平行于轴」。
 *
 * 所以本课的数值检验只有一条: 入射角 = 反射角, 对三种曲线同一套代码。
 */

export type ConicKind = 'ellipse' | 'parabola' | 'hyperbola';

export interface Vec2 {
  x: number;
  y: number;
}

export const KIND_LABEL: Record<ConicKind, string> = {
  ellipse: '椭圆',
  parabola: '抛物线',
  hyperbola: '双曲线',
};

/** 单位化。零向量返回 {0,0}(调用方需自行判断退化)。 */
export function normalize(v: Vec2): Vec2 {
  const n = Math.hypot(v.x, v.y);
  if (n < 1e-15) return { x: 0, y: 0 };
  return { x: v.x / n, y: v.y / n };
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

/** 二维叉积(标量), 用于判断转向 */
export function cross(a: Vec2, b: Vec2): number {
  return a.x * b.y - a.y * b.x;
}

/**
 * 两向量夹角(弧度, 落在 [0, π])。
 * 用 atan2(|叉积|, 点积) 而不是 acos(点积): 夹角接近 0 或 π 时
 * acos 的相对误差会放大到 √ε 量级, 而这门课的全部结论就是
 * 「两个角相等」, 精度必须撑得住 1e-12 的断言。
 */
export function angleBetween(a: Vec2, b: Vec2): number {
  return Math.atan2(Math.abs(cross(a, b)), dot(a, b));
}

/**
 * 曲线配置。三种曲线用同一套参数 (a, b) 表述:
 *   椭圆   x²/a² + y²/b² = 1,  c = √(a²−b²), 焦点 (±c, 0)
 *   双曲线 x²/a² − y²/b² = 1,  c = √(a²+b²), 焦点 (±c, 0)
 *   抛物线 y² = 4 f x,          焦点 (f, 0), 这里用 a 存 f, b 不用
 */
export interface Conic {
  kind: ConicKind;
  a: number;
  b: number;
}

/** 焦距 c。抛物线没有有限的第二焦点, c 取焦点到顶点的距离 f。 */
export function focalC(k: Conic): number {
  if (k.kind === 'parabola') return k.a;
  if (k.kind === 'ellipse') return Math.sqrt(Math.max(0, k.a * k.a - k.b * k.b));
  return Math.sqrt(k.a * k.a + k.b * k.b);
}

/**
 * 两个焦点。抛物线的第二焦点在无穷远, 返回 null 表示
 * 「方向退化为轴向 (−1, 0)」—— 开口朝 +x 时, 反射光朝 −x 走出去。
 */
export function foci(k: Conic): { f1: Vec2; f2: Vec2 | null } {
  const c = focalC(k);
  if (k.kind === 'parabola') return { f1: { x: c, y: 0 }, f2: null };
  return { f1: { x: -c, y: 0 }, f2: { x: c, y: 0 } };
}

/**
 * 参数 t 处的曲线点。
 *   椭圆   t = 离心角,     P = (a cos t, b sin t)
 *   双曲线 t = 双曲参数,   P = (±a cosh t, b sinh t), branch 选支
 *   抛物线 P = (t²/(4f), t) —— 直接用 y 当参数, 避开顶点处的奇性
 */
export function pointAt(k: Conic, t: number, branch: 1 | -1 = 1): Vec2 {
  if (k.kind === 'ellipse') return { x: k.a * Math.cos(t), y: k.b * Math.sin(t) };
  if (k.kind === 'hyperbola') {
    return { x: branch * k.a * Math.cosh(t), y: k.b * Math.sinh(t) };
  }
  return { x: (t * t) / (4 * k.a), y: t };
}

/**
 * 参数 t 处的切向量(未单位化)。对上面的参数化逐项求导:
 *   椭圆   (−a sin t,  b cos t)
 *   双曲线 (±a sinh t, b cosh t)
 *   抛物线 (t/(2f), 1)
 */
export function tangentAt(k: Conic, t: number, branch: 1 | -1 = 1): Vec2 {
  if (k.kind === 'ellipse') return { x: -k.a * Math.sin(t), y: k.b * Math.cos(t) };
  if (k.kind === 'hyperbola') {
    return { x: branch * k.a * Math.sinh(t), y: k.b * Math.cosh(t) };
  }
  return { x: t / (2 * k.a), y: 1 };
}

/** 法向量: 切向量转 90°。方向(内/外)不影响等角结论, 故不作规范化。 */
export function normalAt(k: Conic, t: number, branch: 1 | -1 = 1): Vec2 {
  const tg = tangentAt(k, t, branch);
  return { x: tg.y, y: -tg.x };
}

/**
 * 一次反射测量。这是全课唯一的核心计算, 三种曲线共用。
 *
 * 约定: 光线从 F₁ 射到 P(方向 in = P − F₁), 在 P 处按镜面反射规律
 * 反射出去, 检验反射线是否指向 F₂(抛物线则检验是否平行于轴)。
 *
 * 返回:
 *   inAngle  入射线与切线的夹角
 *   outAngle 出射线(即 P→F₂ 方向, 或轴向)与切线的夹角
 *   gap      两角之差 —— 结论就是它恒为 0
 *   reflected 按镜面公式 d − 2(d·n̂)n̂ 真算出的反射方向, 用于画图
 *   target   出射应当对准的方向(单位向量)
 *
 * ⚠️ 与切线取夹角而不是与法线: 法线的正负号取决于我上面 normalAt
 * 的转向约定, 与法线成的角会因此差一个 π−θ; 与**切线**取夹角
 * 时用 |叉积| 已把方向抹掉, 两侧都落在 [0, π/2] 内, 可直接相减。
 */
export interface ReflectionMeasure {
  p: Vec2;
  inAngle: number;
  outAngle: number;
  gap: number;
  reflected: Vec2;
  target: Vec2;
}

export function measureReflection(
  k: Conic,
  t: number,
  branch: 1 | -1 = 1,
): ReflectionMeasure {
  const p = pointAt(k, t, branch);
  const tg = normalize(tangentAt(k, t, branch));
  const n = normalize(normalAt(k, t, branch));
  const { f1, f2 } = foci(k);

  const inDir = normalize(sub(p, f1));

  /*
   * 出射方向的三种约定。当初我一律写成 normalize(F₂ − P)(「射向第二焦点」),
   * 椭圆对, 另外两个都差一个负号 —— 诊断里 reflected 与 target 恰好反向。
   * 这不是符号笔误, 是三种曲线的光路本来就不同:
   *
   *   椭圆   F₁ 与 F₂ 同在闭合曲线内部, 光从 F₁ 出发**真的**走到 F₂,
   *          出射方向 = F₂ − P。
   *   双曲线 F₁ 在一支的凹侧、F₂ 在另一支那侧, 光反射后是**远离** F₂ 的,
   *          它落在 F₂P 的延长线上 —— 看起来像从 F₂ 发出。故 P − F₂。
   *   抛物线 开口朝 +x、焦点在内部, 从焦点射出的光反射后朝 **+x** 平行射出
   *          (这正是探照灯: 灯泡放在焦点, 光束打向开口方向), 不是 −x。
   */
  let target: Vec2;
  if (k.kind === 'parabola') target = { x: 1, y: 0 };
  else if (k.kind === 'hyperbola') target = normalize(sub(p, f2 as Vec2));
  else target = normalize(sub(f2 as Vec2, p));

  const d = dot(inDir, n);
  const reflected = { x: inDir.x - 2 * d * n.x, y: inDir.y - 2 * d * n.y };

  const inAngle = angleBetween(inDir, tg);
  const outAngle = angleBetween(target, tg);
  return { p, inAngle, outAngle, gap: inAngle - outAngle, reflected, target };
}

/**
 * 梯度即角平分线 —— 反射性质的**理由**, 而不是又一次验证。
 *
 * S(P) = |PF₁| + |PF₂| 的梯度是 û₁ + û₂; 两个单位向量之和落在
 * 它们夹角的平分线上(菱形对角线)。等值线切线 ⟂ 梯度, 所以切线
 * 与两条焦半径等角。双曲线取差 û₁ − û₂, 落在外角平分线上。
 *
 * 返回梯度方向与角平分线方向的夹角(应为 0)以及梯度与切线的夹角
 * (应为 π/2) —— 两个数一起, 才算把这条推理钉住。
 */
export function gradientCheck(
  k: Conic,
  t: number,
  branch: 1 | -1 = 1,
): { bisectorGap: number; perpGap: number } | null {
  if (k.kind === 'parabola') return null;
  const p = pointAt(k, t, branch);
  const { f1, f2 } = foci(k);
  if (f2 === null) return null;
  const u1 = normalize(sub(p, f1));
  const u2 = normalize(sub(p, f2));
  // 椭圆用和(内角平分线), 双曲线用差(外角平分线)
  const grad =
    k.kind === 'ellipse'
      ? { x: u1.x + u2.x, y: u1.y + u2.y }
      : { x: u1.x - u2.x, y: u1.y - u2.y };
  const bis = normalize(grad);
  // 角平分线的**独立**算法: 直接对两个方位角取中点。
  // ⚠️ 不能再写成 u1+u2 —— 那就是 grad 本身, 比对自己恒等于 0,
  // 什么也没验证。这里改用 atan2 取角、按最短弧取中, 与向量加法
  // 是两条不同的路子, 对上了才说明「和向量落在平分线上」成立。
  const a1 = Math.atan2(u1.y, u1.x);
  const s2 = k.kind === 'ellipse' ? u2 : { x: -u2.x, y: -u2.y };
  const a2 = Math.atan2(s2.y, s2.x);
  let delta = a2 - a1;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  const mid = a1 + delta / 2;
  const bisectorGap = angleBetween(bis, { x: Math.cos(mid), y: Math.sin(mid) });
  const tg = normalize(tangentAt(k, t, branch));
  const perpGap = Math.abs(angleBetween(bis, tg) - Math.PI / 2);
  return { bisectorGap, perpGap };
}

/** 采样曲线用于绘制。双曲线返回两段(两支), 其余一段。 */
export function sampleCurve(k: Conic, n = 361, span = 2.2): Vec2[][] {
  if (k.kind === 'ellipse') {
    const pts: Vec2[] = [];
    for (let i = 0; i < n; i++) pts.push(pointAt(k, (i / (n - 1)) * Math.PI * 2));
    return [pts];
  }
  if (k.kind === 'hyperbola') {
    const mk = (br: 1 | -1) => {
      const pts: Vec2[] = [];
      for (let i = 0; i < n; i++) pts.push(pointAt(k, -span + (2 * span * i) / (n - 1), br));
      return pts;
    };
    return [mk(1), mk(-1)];
  }
  const pts: Vec2[] = [];
  const yMax = span * 2 * k.a;
  for (let i = 0; i < n; i++) pts.push(pointAt(k, -yMax + (2 * yMax * i) / (n - 1)));
  return [pts];
}

/**
 * 椭圆台球: 从一个焦点击出的球, 每次撞壁都回到另一个焦点,
 * 于是路径在两焦点之间来回, 并且**很快贴近长轴**。
 *
 * 这是反射性质最直观的后果: 不必解微分方程, 只要「过焦点」这条
 * 性质反复用, 轨迹的极限行为就定了。
 *
 * 求下一个撞击点 = 求射线与椭圆的交点。代入参数方程解二次:
 *   (px+s·dx)²/a² + (py+s·dy)²/b² = 1
 * 取最小正根 s(排除当前点自身)。
 */
export function ellipseBounce(
  k: Conic,
  from: Vec2,
  dir: Vec2,
): { hit: Vec2; next: Vec2 } | null {
  if (k.kind !== 'ellipse') return null;
  const d = normalize(dir);
  const A = (d.x * d.x) / (k.a * k.a) + (d.y * d.y) / (k.b * k.b);
  const B = (2 * from.x * d.x) / (k.a * k.a) + (2 * from.y * d.y) / (k.b * k.b);
  const C = (from.x * from.x) / (k.a * k.a) + (from.y * from.y) / (k.b * k.b) - 1;
  const disc = B * B - 4 * A * C;
  if (disc < 0 || A < 1e-15) return null;
  const sq = Math.sqrt(disc);
  const cands = [(-B - sq) / (2 * A), (-B + sq) / (2 * A)].filter((s) => s > 1e-7);
  if (cands.length === 0) return null;
  const s = Math.min(...cands);
  const hit = { x: from.x + s * d.x, y: from.y + s * d.y };
  // 在撞击点做镜面反射, 得到下一段方向
  const t = Math.atan2(hit.y / k.b, hit.x / k.a);
  const n = normalize(normalAt(k, t));
  const dn = dot(d, n);
  const next = { x: d.x - 2 * dn * n.x, y: d.y - 2 * dn * n.y };
  return { hit, next };
}

/**
 * 连续弹射若干次, 返回折线顶点。
 *
 * 收敛率是个漂亮的闭式: 每弹一次 |y| 乘以 **(1−e)/(1+e)**。
 * a=5,b=3(e=0.8) 实测 0.111111 = (0.2/1.8); a=2,b=1.9(e=0.3122)
 * 实测 0.525434 vs 0.524100。所以椭圆台球从焦点出发, 轨迹以
 * 等比速度贴向长轴 —— e 越大贴得越快。
 *
 * ⚠️ `axisEps`: 轨迹逼近长轴后必须**主动停下**。靠近顶点时椭圆
 * 几乎与轴垂直相交, 撞击点的舍入误差会被法线方向放大 (1+e)/(1−e) 倍
 * (正好是收敛率的倒数)。实测 a=5,b=1.6 时 |y| 掉到 2e-8 后反弹回
 * 1e-2, 画出来就是一条已经压在轴上的折线突然又张开 —— 那是浮点噪声
 * 被逐次放大, 不是真实轨迹。到达分辨率就收手。
 */
export function billiardPath(
  k: Conic,
  start: Vec2,
  dir: Vec2,
  bounces = 8,
  axisEps = 1e-6,
): Vec2[] {
  const pts: Vec2[] = [start];
  let p = start;
  let d = dir;
  for (let i = 0; i < bounces; i++) {
    const r = ellipseBounce(k, p, d);
    if (!r) break;
    pts.push(r.hit);
    if (Math.abs(r.hit.y) < axisEps * k.b) break;
    p = r.hit;
    d = r.next;
  }
  return pts;
}

/** 理论收敛率 (1−e)/(1+e)。用于与实测比对。 */
export function convergenceRatio(k: Conic): number {
  const e = focalC(k) / k.a;
  return (1 - e) / (1 + e);
}

export interface Preset {
  id: string;
  label: string;
  conic: Conic;
  note: string;
}

export const PRESETS: Preset[] = [
  { id: 'ellipse', label: '椭圆 a=5 b=3', conic: { kind: 'ellipse', a: 5, b: 3 }, note: '两焦点互通: 回音壁' },
  { id: 'ellipse-flat', label: '扁椭圆 a=5 b=1.6', conic: { kind: 'ellipse', a: 5, b: 1.6 }, note: '越扁, 焦点越靠近端点' },
  { id: 'parabola', label: '抛物线 f=1.5', conic: { kind: 'parabola', a: 1.5, b: 0 }, note: '焦点↔平行光: 卫星天线' },
  { id: 'hyperbola', label: '双曲线 a=2 b=1.5', conic: { kind: 'hyperbola', a: 2, b: 1.5 }, note: '反射后像是从另一焦点发出' },
];
