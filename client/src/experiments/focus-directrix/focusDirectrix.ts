/**
 * 焦点—准线统一定义
 *
 * 一条规则生成全部圆锥曲线:
 *   取定点 F(焦点)、定直线 d(准线)、正数 e(离心率),
 *   轨迹 = { P : |PF| = e · dist(P, d) }
 *
 * e < 1 椭圆   e = 1 抛物线   e > 1 双曲线
 *
 * 只有 e 在变。这门课要说明的是: 三种曲线不是三件东西, 是同一条规则
 * 在参数 e 上的三段取值。
 *
 * 坐标约定: 焦点在原点, 准线是竖直线 x = -p/e 的形式不便统一,
 * 改用极坐标, 这是统一性最干净的写法:
 *
 *   r(θ) = l / (1 + e·cos θ)     l = 半正焦弦(semi-latus rectum)
 *
 * 该式对三种 e 一致成立, 焦点恒在原点 —— 这正是天体力学用它的原因。
 * 准线位于 x = l / e (在焦点右侧, 与开口方向相反)。
 */

/** 曲线类型 */
export type ConicKind = 'ellipse' | 'parabola' | 'hyperbola';

/** 由离心率判定类型。阈值取 1e-9, 保证浮点上的 e=1 落到抛物线。 */
export function classify(e: number): ConicKind {
  if (Math.abs(e - 1) < 1e-9) return 'parabola';
  return e < 1 ? 'ellipse' : 'hyperbola';
}

export const KIND_LABEL: Record<ConicKind, string> = {
  ellipse: '椭圆',
  parabola: '抛物线',
  hyperbola: '双曲线',
};

/**
 * 极坐标半径 r(θ) = l / (1 + e cos θ)。
 *
 * 分母趋零时 r 发散(渐近方向), 返回 null。
 *
 * ⚠️ 分母为负时**不能**当作无点丢掉。e>1 时 1+e cos θ 在
 * |θ| > arccos(-1/e) 区间变负, 此时 r<0 表示"沿反方向量出 |r|",
 * 落点正是双曲线的**远支**。远支同样满足 |PF| = e·dist(P,准线)
 * (远顶点 x=l/(e−1) 处 6.667/5.128 = 1.3 = e), 所以它属于轨迹,
 * 早先把负分母整段丢弃, 等于只画了一半曲线、也让"比值恒为 e"
 * 的检验从未看到远支的点。
 */
export function radiusAt(e: number, l: number, theta: number): number | null {
  const denom = 1 + e * Math.cos(theta);
  if (Math.abs(denom) <= 1e-9) return null;
  return l / denom;
}

/** 准线到焦点的距离。由 r = l/(1+e cos θ) 反推: 准线在 x = l/e。 */
export function directrixX(e: number, l: number): number {
  return l / e;
}

/**
 * 定义式左右两边。返回 { pf, pd, ratio }。
 * 这是全课的核心检验: ratio 必须恒等于 e, 与 θ 无关。
 */
export function focusDirectrixRatio(
  e: number,
  l: number,
  theta: number,
): { pf: number; pd: number; ratio: number } | null {
  const r = radiusAt(e, l, theta);
  if (r === null) return null;
  const x = r * Math.cos(theta);
  // r 可能为负(双曲线远支), 到焦点的距离取模长
  const pf = Math.abs(r);
  // 准线 x = l/e 是竖直线, 距离就是横坐标差的绝对值
  const pd = Math.abs(directrixX(e, l) - x);
  return { pf, pd, ratio: pf / pd };
}

/** 曲线上一点的笛卡尔坐标(焦点在原点)。 */
export function pointAt(e: number, l: number, theta: number): { x: number; y: number } | null {
  const r = radiusAt(e, l, theta);
  if (r === null) return null;
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
}

/**
 * 采样整条轨迹, 返回若干段, 每段内部连续可直接连线。
 *
 * 两个必须处理的断点:
 *  1. **符号翻转(渐近方向)**: e>1 时 1+e cos θ 在 θ=±arccos(-1/e) 变号。
 *     跨过该角时点从近支跳到远支, 若不断开就会出现一条横穿画面的假线。
 *  2. **越界**: 逼近渐近方向时 |r|→∞。保留这些点会让自动取景被
 *     一个 10⁵ 量级的坐标绑架, 曲线缩成一个点(我在 Dandelin 那课
 *     踩过同类取景坑)。故超出 clip 半径即断段。
 *
 * 近支与远支因此自然落在不同段里, 而不是靠"丢掉负分母"来实现 ——
 * 远支是轨迹的一部分, 必须画出来。
 */
export function samplePolar(
  e: number,
  l: number,
  samples = 1441,
  clip = 40,
): Array<Array<{ x: number; y: number }>> {
  const segs: Array<Array<{ x: number; y: number }>> = [];
  let cur: Array<{ x: number; y: number }> = [];
  let prevSign = 0;

  const flush = () => {
    if (cur.length > 1) segs.push(cur);
    cur = [];
  };

  for (let i = 0; i < samples; i++) {
    const theta = (i / (samples - 1)) * Math.PI * 2;
    const denom = 1 + e * Math.cos(theta);
    const sign = Math.sign(denom);
    // 分母变号 = 跨过渐近方向, 必须断开
    if (prevSign !== 0 && sign !== 0 && sign !== prevSign) flush();
    if (sign !== 0) prevSign = sign;

    const pt = pointAt(e, l, theta);
    if (pt === null || !Number.isFinite(pt.x) || !Number.isFinite(pt.y)) {
      flush();
      continue;
    }
    if (Math.hypot(pt.x, pt.y) > clip) {
      flush();
      continue;
    }
    cur.push(pt);
  }
  flush();
  return segs;
}

/**
 * 从 (e, l) 换算标准参数。
 * 椭圆/双曲线: a = l/|1-e²|, b = l/√|1-e²|, c = a·e
 * 抛物线无 a(退化), 返回 null 的字段用 NaN 表示。
 */
export function standardParams(
  e: number,
  l: number,
): { a: number; b: number; c: number; kind: ConicKind } {
  const kind = classify(e);
  if (kind === 'parabola') {
    return { a: NaN, b: NaN, c: NaN, kind };
  }
  const d = Math.abs(1 - e * e);
  const a = l / d;
  const b = l / Math.sqrt(d);
  return { a, b, c: a * e, kind };
}

/**
 * 第二焦点的位置(第一焦点在原点)。
 *
 * 由两顶点定中心: θ=0 给 x₁ = l/(1+e); θ=π 给 r = l/(1−e),
 * 于是 x₂ = −l/(1−e)。中心是两者中点, 第二焦点 = 2×中心 −(原点):
 *
 *   focus2.x = −2 l e / (1 − e²)
 *
 * ⚠️ **必须用带符号的 (1−e²), 不能写成 −2c**。e<1 时 1−e²>0,
 * 结果为负(第二焦点在左), 与 −2c 一致; 但 e>1 时 1−e²<0, 结果
 * 变正(第二焦点在**右**)。早先按 −2c 一律放左边, 双曲线的
 * |PF₁−PF₂| 就对不上 2a(实测偏差 5.53, 而非 1e-15)。
 */
export function secondFocusX(e: number, l: number): number {
  const d = 1 - e * e;
  if (Math.abs(d) < 1e-12) return Number.POSITIVE_INFINITY; // 抛物线: 退到无穷远
  return (-2 * l * e) / d;
}

/** 椭圆的两焦点距离之和 = 2a; 双曲线的距离之差绝对值 = 2a。用于交叉验证。 */
export function twoFocusCheck(
  e: number,
  l: number,
  theta: number,
): { sumOrDiff: number; expected2a: number } | null {
  const kind = classify(e);
  if (kind === 'parabola') return null;
  const p = pointAt(e, l, theta);
  if (p === null) return null;
  const { a } = standardParams(e, l);
  const f2x = secondFocusX(e, l);
  const pf1 = Math.hypot(p.x, p.y);
  const pf2 = Math.hypot(p.x - f2x, p.y);
  const sumOrDiff = kind === 'ellipse' ? pf1 + pf2 : Math.abs(pf1 - pf2);
  return { sumOrDiff, expected2a: 2 * a };
}

/** 预设配置 */
export interface Preset {
  id: string;
  label: string;
  e: number;
  note: string;
}

export const PRESETS: Preset[] = [
  { id: 'circle', label: '圆 e=0', e: 0, note: '准线退到无穷远' },
  { id: 'ellipse-mild', label: '椭圆 e=0.5', e: 0.5, note: '地球轨道 e≈0.017' },
  { id: 'ellipse-strong', label: '扁椭圆 e=0.9', e: 0.9, note: '哈雷彗星 e≈0.967' },
  { id: 'parabola', label: '抛物线 e=1', e: 1, note: '临界: 恰好不闭合' },
  { id: 'hyperbola-mild', label: '双曲线 e=1.3', e: 1.3, note: '掠过太阳系的天体' },
  { id: 'hyperbola-strong', label: '双曲线 e=2', e: 2, note: '两支张得更开' },
];

/** 天体离心率实例, 用于说明 e 不是抽象参数 */
export const ASTRO: Array<{ name: string; e: number }> = [
  { name: '地球', e: 0.0167 },
  { name: '火星', e: 0.0934 },
  { name: '水星', e: 0.2056 },
  { name: '冥王星', e: 0.2488 },
  { name: '哈雷彗星', e: 0.967 },
  { name: "2I/Borisov(星际)", e: 3.36 },
];
