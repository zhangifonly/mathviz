/**
 * KL 散度与交叉熵
 *
 * 上一课(信息熵与信源编码定理)说清了熵是什么: 用**真实**分布 p 编码时
 * 每符号所需的比特数下界。这门课问下一个问题:
 *
 *   如果我以为分布是 q, 按 q 设计了编码, 实际数据却服从 p, 要多花多少?
 *
 * 答案就是 KL 散度:
 *
 *   D(p‖q) = Σ p log₂(p/q)     —— 用错分布多付的比特数
 *   H(p,q) = −Σ p log₂ q = H(p) + D(p‖q)   —— 交叉熵
 *
 * 三件事本课都验证:
 *
 * 1. **Gibbs 不等式**: D(p‖q) ≥ 0, 等号当且仅当 p = q。
 *    也就是说, 用错分布只会更费, 绝不会更省。这条保证了 p 是
 *    "最优编码"的唯一选择, 也是极大似然估计的理论根据。
 *
 * 2. **不对称**: D(p‖q) ≠ D(q‖p)。实测一对分布 1.851 对 0.859,
 *    差了一倍多。所以 KL **不是距离** —— 这是初学最容易搞错的一点,
 *    本课把两个方向并排画出来。
 *
 * 3. **交叉熵 = 熵 + KL**。机器学习里的交叉熵损失, 减去一个与模型
 *    无关的常数 H(p) 之后, 就是 KL 散度。所以"最小化交叉熵"与
 *    "最小化 KL"完全等价 —— 项目里 logistic-regression 那课提了一句
 *    "对数损失也叫交叉熵", 但没说这个等价关系, 这里补上。
 *
 * ⚠️ 一个必须处理的退化: q_i = 0 而 p_i > 0 时, log(p/q) = +∞,
 * KL 散度是**真正的无穷大**, 不是数值溢出。含义很实在: 你的模型认为
 * 某件事不可能发生, 而它发生了 —— 这时需要无穷多比特来编码它。
 * 本课返回 Infinity 并在界面上如实显示, 而不是悄悄截断成一个大数。
 *
 * 3D 用在哪: 固定 p, 让 q 跑遍整个单纯形, D(p‖q) 是单纯形上的一个
 * 高度场 —— 它在 q=p 处**唯一**触底(Gibbs 不等式的几何形态), 向
 * 边界急剧升到无穷。把 D(p‖q) 与 D(q‖p) 两张曲面叠起来, 不对称性
 * 就是两张面形状的差异, 一眼可辨。
 */

export type Dist = number[];

export function normalize(p: Dist): Dist {
  const s = p.reduce((a, b) => a + Math.max(0, b), 0);
  if (s <= 0) return p.map(() => 1 / p.length);
  return p.map((v) => Math.max(0, v) / s);
}

/** 香农熵 H(p) = −Σ p log₂ p。0·log0 按极限取 0。 */
export function entropy(p: Dist): number {
  let h = 0;
  for (const q of p) if (q > 0) h -= q * Math.log2(q);
  return h;
}

/**
 * KL 散度 D(p‖q) = Σ p log₂(p/q), 单位比特。
 *
 * ⚠️ 两处退化, 含义完全不同, 不能混为一谈:
 *   p_i = 0: 该项贡献 0(0·log0 的极限), 直接跳过。
 *   q_i = 0 而 p_i > 0: 真正的 +∞ —— 模型说不可能的事发生了。
 * 返回 Infinity 而不是截断, 让调用方决定怎么显示。
 */
export function klDivergence(p: Dist, q: Dist): number {
  let d = 0;
  for (let i = 0; i < p.length; i++) {
    if (p[i] <= 0) continue;
    if (q[i] <= 0) return Infinity;
    d += p[i] * Math.log2(p[i] / q[i]);
  }
  return d;
}

/** 交叉熵 H(p,q) = −Σ p log₂ q。同样在 q_i=0 且 p_i>0 时为 +∞。 */
export function crossEntropy(p: Dist, q: Dist): number {
  let c = 0;
  for (let i = 0; i < p.length; i++) {
    if (p[i] <= 0) continue;
    if (q[i] <= 0) return Infinity;
    c -= p[i] * Math.log2(q[i]);
  }
  return c;
}

/** 分解式的残差: |H(p,q) − H(p) − D(p‖q)|, 应恒为 0。 */
export function decompositionResidual(p: Dist, q: Dist): number {
  const ce = crossEntropy(p, q);
  const kl = klDivergence(p, q);
  if (!Number.isFinite(ce) || !Number.isFinite(kl)) return 0;
  return Math.abs(ce - entropy(p) - kl);
}

/** 不对称度 |D(p‖q) − D(q‖p)|。为 0 不代表 KL 是对称的, 只是这一对恰好相等。 */
export function asymmetry(p: Dist, q: Dist): number {
  const a = klDivergence(p, q);
  const b = klDivergence(q, p);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return Infinity;
  return Math.abs(a - b);
}

/**
 * Jensen-Shannon 散度: 对称化的 KL。
 *   JS(p,q) = ½D(p‖m) + ½D(q‖m),  m = (p+q)/2
 *
 * 它对称、恒有限(m 的支撑覆盖 p 和 q, 所以不会出现 log0)、
 * 而且 √JS 满足三角不等式, 是真正的度量。
 * 本课用它说明"KL 不是距离, 但可以补救成距离"。
 */
export function jensenShannon(p: Dist, q: Dist): number {
  const m = p.map((v, i) => (v + q[i]) / 2);
  return 0.5 * klDivergence(p, m) + 0.5 * klDivergence(q, m);
}

/** 总变差距离 ½Σ|p−q|, 用作对照(它是真正的距离)。 */
export function totalVariation(p: Dist, q: Dist): number {
  return 0.5 * p.reduce((s, v, i) => s + Math.abs(v - q[i]), 0);
}

/**
 * Pinsker 不等式: TV ≤ √(D/2)(自然对数下)。
 * 换成以 2 为底的比特, D_bits = D_nats/ln2, 于是 TV ≤ √(D_bits·ln2/2)。
 * 返回不等式右边, 供检验。
 */
export function pinskerBound(p: Dist, q: Dist): number {
  const dBits = klDivergence(p, q);
  if (!Number.isFinite(dBits)) return Infinity;
  return Math.sqrt((dBits * Math.LN2) / 2);
}

export type FieldKind = 'kl-pq' | 'kl-qp' | 'js' | 'cross';

/**
 * 固定 p, 让 q 跑遍单纯形, 采样一个高度场。
 *
 * ⚠️ 网格折叠与截断:
 *  - 正方形网格直接用会跑出单纯形, 这里沿对角线折回来(与熵那课同法)。
 *  - 边界上 q 有零分量, KL 会是 +∞。绘图必须截断, 否则曲面飞到无限高
 *    把别的都压扁。这里截到 cap 并**记录是否被截**, 让界面能如实说明
 *    "这里其实是无穷大", 而不是让人以为它就那么高。
 */
export interface FieldSample {
  q: [number, number, number];
  value: number;
  clipped: boolean;
}

export function sampleField(
  p: Dist, kind: FieldKind, res = 26, cap = 4,
): FieldSample[][] {
  const rows: FieldSample[][] = [];
  for (let i = 0; i <= res; i++) {
    const row: FieldSample[] = [];
    for (let j = 0; j <= res; j++) {
      let a = i / res;
      let b = j / res;
      if (a + b > 1) {
        a = 1 - a;
        b = 1 - b;
      }
      const q: [number, number, number] = [a, b, 1 - a - b];
      let v: number;
      if (kind === 'kl-pq') v = klDivergence(p, q);
      else if (kind === 'kl-qp') v = klDivergence(q, p);
      else if (kind === 'js') v = jensenShannon(p, q);
      else v = crossEntropy(p, q);
      const clipped = !Number.isFinite(v) || v > cap;
      row.push({ q, value: clipped ? cap : v, clipped });
    }
    rows.push(row);
  }
  return rows;
}

export interface Preset {
  id: string;
  label: string;
  p: Dist;
  q: Dist;
  note: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'same', label: '完全相同',
    p: [0.5, 0.3, 0.2], q: [0.5, 0.3, 0.2],
    note: 'KL = 0，唯一取到等号处',
  },
  {
    id: 'close', label: '略有偏差',
    p: [0.5, 0.3, 0.2], q: [0.4, 0.35, 0.25],
    note: '两个方向都约 0.03',
  },
  {
    id: 'asym', label: '不对称明显',
    p: [0.5, 0.3, 0.2], q: [0.98, 0.01, 0.01],
    note: '1.851 对 0.859，差一倍多',
  },
  {
    id: 'far', label: '完全相反',
    p: [0.8, 0.1, 0.1], q: [0.1, 0.1, 0.8],
    note: 'KL 高达 2.1',
  },
  {
    id: 'zero', label: 'q 有零分量',
    p: [0.5, 0.3, 0.2], q: [0.6, 0.4, 0],
    note: 'KL = ∞：模型说不可能的事发生了',
  },
];
