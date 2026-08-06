/**
 * 集中不等式: Markov → Chebyshev → Hoeffding
 *
 * 项目里已有「大数定律」一课, 它展示了样本均值会收敛到期望, 也画了
 * "波动随 n 减小"。但它没回答两个真正要紧的问题:
 *
 *   偏离超过 t 的概率**到底有多大**?
 *   要多少样本才能保证误差不超过 t 的把握达到 95%?
 *
 * 集中不等式就是干这个的。三个界层层收紧, 每一步都需要更多的假设:
 *
 *   Markov     P(X ≥ a) ≤ E[X]/a            只要 X ≥ 0
 *   Chebyshev  P(|X−μ| ≥ t) ≤ σ²/t²          还要知道方差
 *   Hoeffding  P(|X̄−μ| ≥ t) ≤ 2e^(−2nt²/(b−a)²)  还要有界
 *
 * 对 n 个独立同分布、取值在 [a,b] 的变量, 后两个用在样本均值上:
 *   Chebyshev: σ²/(n t²)     —— 随 n **线性**衰减
 *   Hoeffding: 2e^(−2nt²/(b−a)²) —— 随 n **指数**衰减
 *
 * ⚠️ 但"指数一定更好"是错的。实测 n=10、t=0.2 时 Chebyshev 给
 * 0.625, Hoeffding 给 0.899 —— 反而是 Chebyshev 更紧。指数衰减
 * 要到 n 够大才体现出来(这个例子里 n≈25 之后)。本课把交叉点画出来,
 * 而不是笼统说"Hoeffding 更好"。
 *
 * 3D 用在哪: 界是 (n, t) 两个变量的函数, 画成**曲面**才看得出
 * "沿 n 怎么衰减"和"沿 t 怎么衰减"是两种不同的形状 —— 线性衰减的
 * 缓坡与指数衰减的陡崖并排, 一眼可辨。真实概率也画成第三张曲面,
 * 三者的高低关系就是"界有多松"。
 */

/** 伯努利分布参数 */
export interface Setup {
  /** 成功概率 */
  p: number;
  /** 取值下界(伯努利是 0) */
  a: number;
  /** 取值上界(伯努利是 1) */
  b: number;
}

export const DEFAULT_SETUP: Setup = { p: 0.5, a: 0, b: 1 };

/** 组合数 C(n,k), 用对数避免大 n 溢出。 */
export function logChoose(n: number, k: number): number {
  if (k < 0 || k > n) return -Infinity;
  return lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);
}

/**
 * log Γ(x) 的 Lanczos 近似。
 * 直接算阶乘在 n>170 就溢出成 Infinity, 而本课要画到 n=500,
 * 所以整条二项分布都在对数域里算。
 */
export function lgamma(x: number): number {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  const z = x - 1;
  let a = c[0];
  const t = z + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (z + i);
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

/** 二项分布的单点概率 P(S = k), 对数域计算。 */
export function binomPmf(n: number, k: number, p: number): number {
  if (k < 0 || k > n) return 0;
  if (p <= 0) return k === 0 ? 1 : 0;
  if (p >= 1) return k === n ? 1 : 0;
  return Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
}

/**
 * 真实的双侧尾概率 P(|S/n − p| ≥ t)。
 *
 * ⚠️ 判定用 k/n − p 而不是把 t 换算成 k 的整数界:
 * 二项是离散的, 换算时的取整方向很容易差一格, 那一格在小 n 时
 * 能把概率改掉几个百分点。直接对每个 k 判一次, 没有取整问题。
 */
export function exactTail(n: number, p: number, t: number): number {
  let s = 0;
  for (let k = 0; k <= n; k++) {
    if (Math.abs(k / n - p) >= t - 1e-12) s += binomPmf(n, k, p);
  }
  return Math.min(1, s);
}

/**
 * Markov: P(X ≥ a) ≤ E[X]/a, 只要求 X ≥ 0。
 *
 * 它是三者里最弱的, 但也是另外两个的**来源**: Chebyshev 就是把
 * Markov 用在 (X−μ)² 上, Hoeffding 是用在 e^(λX) 上。所以本课
 * 从它讲起, 而不是当成一个可有可无的引子。
 */
export function markovBound(mean: number, a: number): number {
  if (a <= 0) return 1;
  return Math.min(1, mean / a);
}

/**
 * Chebyshev 用在样本均值上: P(|X̄−μ| ≥ t) ≤ σ²/(n t²)。
 * 随 n **线性**衰减。
 */
export function chebyshevBound(n: number, variance: number, t: number): number {
  if (t <= 0 || n <= 0) return 1;
  return Math.min(1, variance / (n * t * t));
}

/**
 * Hoeffding: P(|X̄−μ| ≥ t) ≤ 2 exp(−2nt²/(b−a)²)。
 * 随 n **指数**衰减, 但只对有界变量成立。
 */
export function hoeffdingBound(n: number, t: number, a: number, b: number): number {
  const range = b - a;
  if (range <= 0 || t <= 0 || n <= 0) return 1;
  return Math.min(1, 2 * Math.exp((-2 * n * t * t) / (range * range)));
}

/** 伯努利的方差 p(1−p)。 */
export function bernoulliVariance(p: number): number {
  return p * (1 - p);
}

export interface BoundSet {
  exact: number;
  chebyshev: number;
  hoeffding: number;
}

export function allBounds(n: number, t: number, s: Setup = DEFAULT_SETUP): BoundSet {
  return {
    exact: exactTail(n, s.p, t),
    chebyshev: chebyshevBound(n, bernoulliVariance(s.p), t),
    hoeffding: hoeffdingBound(n, t, s.a, s.b),
  };
}

/**
 * 两个界的交叉点: 使 Chebyshev 与 Hoeffding 相等的 n。
 *
 * 这是本课要澄清的一个误解 —— "指数界一定更紧"是错的。
 * n 小时 Chebyshev 反而更紧, 过了交叉点 Hoeffding 才领先。
 * 用二分求, 返回 null 表示在给定范围内不交叉。
 */
export function crossoverN(
  t: number, s: Setup = DEFAULT_SETUP, nMax = 5000,
): number | null {
  const cheb = (n: number) => chebyshevBound(n, bernoulliVariance(s.p), t);
  const hoef = (n: number) => hoeffdingBound(n, t, s.a, s.b);
  /*
   * ⚠️ 必须跳过两个界都被 min(1,·) 截到 1 的那一段。
   * 小 n 时两者都等于 1, 差为 0, 二分会一头扎进去返回 n≈1 ——
   * 那不是交叉点, 是"都还没开始下降"。实测 t=0.05/0.1/0.2 全部
   * 返回 1.00 就是这么来的。先扫出第一个两者都 <1 的 n 再开始找。
   */
  let lo = 1;
  while (lo <= nMax && (cheb(lo) >= 1 - 1e-12 || hoef(lo) >= 1 - 1e-12)) lo++;
  if (lo > nMax) return null;
  const diff = (n: number) => cheb(n) - hoef(n);
  const hi = nMax;
  if (diff(lo) * diff(hi) > 0) return null;
  let a = lo;
  let b = hi;
  for (let i = 0; i < 60; i++) {
    const mid = (a + b) / 2;
    if (diff(a) * diff(mid) <= 0) b = mid;
    else a = mid;
  }
  return (a + b) / 2;
}

/**
 * 样本量: 要让 P(|X̄−μ| ≥ t) ≤ δ, 各个界分别要求多少个 n。
 *
 * 这是集中不等式在实践中最常用的方式 —— 反过来解 n。
 *   Chebyshev: n ≥ σ²/(δ t²)
 *   Hoeffding: n ≥ (b−a)²·ln(2/δ)/(2t²)
 * 真实所需的 n 用逐个试出来(二项分布没有闭式反解)。
 */
export function sampleSize(
  t: number, delta: number, s: Setup = DEFAULT_SETUP, nMax = 100000,
): { chebyshev: number; hoeffding: number; exact: number | null } {
  const v = bernoulliVariance(s.p);
  const range = s.b - s.a;
  const cheb = Math.ceil(v / (delta * t * t));
  const hoef = Math.ceil((range * range * Math.log(2 / delta)) / (2 * t * t));
  /*
   * ⚠️ 真实所需的 n **不能**取"第一个满足 δ 的 n"。
   * 尾概率随 n 并非单调: 判据 |k/n − p| ≥ t 里的 k 是整数, n 变化时
   * 满足条件的 k 的集合会跳变, 于是尾概率上下起伏。实测 n=1..120
   * 之间有 48 次回升。取第一个满足的 n, 后面可能又不满足了。
   *
   * 正确做法是取**最后一次违反之后**的那个 n: 从大到小扫, 找到最后
   * 一个仍然超过 δ 的位置, 它之后才真正稳定达标。
   */
  const limit = Math.min(nMax, Math.max(cheb, hoef) + 50);
  let lastBad = 0;
  for (let n = 1; n <= limit; n++) {
    if (exactTail(n, s.p, t) > delta) lastBad = n;
  }
  const exact = lastBad < limit ? lastBad + 1 : null;
  return { chebyshev: cheb, hoeffding: hoef, exact };
}

/** 在 (n, t) 网格上采样一张界的曲面, 供 3D 绘制。 */
export function sampleSurface(
  kind: 'exact' | 'chebyshev' | 'hoeffding',
  nMin: number, nMax: number, tMin: number, tMax: number,
  nSteps = 26, tSteps = 26, s: Setup = DEFAULT_SETUP,
): number[][] {
  const grid: number[][] = [];
  for (let i = 0; i <= nSteps; i++) {
    const n = Math.round(nMin + ((nMax - nMin) * i) / nSteps);
    const row: number[] = [];
    for (let j = 0; j <= tSteps; j++) {
      const t = tMin + ((tMax - tMin) * j) / tSteps;
      const b = allBounds(Math.max(1, n), t, s);
      row.push(kind === 'exact' ? b.exact : kind === 'chebyshev' ? b.chebyshev : b.hoeffding);
    }
    grid.push(row);
  }
  return grid;
}

export interface Preset {
  id: string;
  label: string;
  t: number;
  nMax: number;
  note: string;
}

export const PRESETS: Preset[] = [
  { id: 'wide', label: '宽容差 t=0.2', t: 0.2, nMax: 120, note: '交叉点 n≈27' },
  { id: 'mid', label: '中等 t=0.15', t: 0.15, nMax: 200, note: '交叉点 n≈48' },
  { id: 'tight', label: '严容差 t=0.1', t: 0.1, nMax: 400, note: '交叉点 n≈108' },
  { id: 'verytight', label: '很严 t=0.05', t: 0.05, nMax: 1200, note: '要几百个样本' },
];
