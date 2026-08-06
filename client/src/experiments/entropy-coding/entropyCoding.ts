/**
 * 信息熵与信源编码定理
 *
 * 项目里已有两课碰到熵, 但都只是路过:
 *   「决策树」把熵当分裂准则用, 说了"两类各半时熵为 1", 没说为什么是它;
 *   「哈夫曼编码」造出了最优前缀码, 却没说这个"最优"到底能优到哪。
 *
 * 这门课把两头接上: 熵**就是**编码长度的下界, 而哈夫曼**就是**能达到
 * 这个下界的构造。Shannon 信源编码定理:
 *
 *   H(p) ≤ L* < H(p) + 1
 *
 * 左边说谁也不可能比熵更短, 右边说哈夫曼最多浪费不到 1 比特。
 *
 * 三件事本课都验证:
 *
 * 1. **熵是唯一合理的度量**。要求可加性(独立信源的熵相加)、连续性、
 *    以及"等概率时随选项数单调增", 三条就唯一确定了 −Σp log p
 *    (相差一个常数因子, 即对数的底)。
 *
 * 2. **二进制概率时哈夫曼精确达到 H**。p 全是 2 的负整数次幂时,
 *    最优码长恰好是 −log₂p, 平均码长等于熵, 一比特不浪费。
 *    实测 [1/2,1/4,1/8,1/8]: H = L = 1.75。
 *
 * 3. **非二进制概率时有缺口, 分组编码能补上**。实测 [0.9,0.1] 的
 *    H=0.469 而哈夫曼只能给 1.000(单个符号不可能少于一比特),
 *    浪费一倍多。但把 k 个符号打包成一个"超符号"再编码, 每符号的
 *    平均长度趋于 H —— 定理的 "+1" 被摊薄到 "+1/k"。
 *
 * 3D 用在哪: 三元信源的概率分布住在**单纯形**上(p₁+p₂+p₃=1 的三角形),
 * 熵是这张斜面上的一个高度场 —— 中心最高(最不确定), 三个顶点为零
 * (完全确定)。把 H 与哈夫曼码长两张曲面叠在同一个单纯形上, 缺口
 * 在哪里大、哪里为零, 一眼可辨。这是二维平铺画不出来的。
 */

/** 概率分布, 各分量非负且和为 1。 */
export type Dist = number[];

export function normalize(p: Dist): Dist {
  const s = p.reduce((a, b) => a + Math.max(0, b), 0);
  if (s <= 0) return p.map(() => 1 / p.length);
  return p.map((v) => Math.max(0, v) / s);
}

/**
 * 香农熵 H(p) = −Σ p log₂ p, 单位比特。
 *
 * ⚠️ p=0 时 p·log p 的极限是 0, 但直接算是 0·(−∞)=NaN。必须显式跳过。
 * 这不是边角情形 —— 单纯形的边界上就有零分量, 而边界正是熵为零、
 * 最该看清楚的地方。
 */
export function entropy(p: Dist): number {
  let h = 0;
  for (const q of p) {
    if (q > 0) h -= q * Math.log2(q);
  }
  return h;
}

/** 最大熵 = log₂ n, 在均匀分布处取到。 */
export function maxEntropy(n: number): number {
  return Math.log2(n);
}

/**
 * 哈夫曼编码的码长(每个符号一个长度)。
 *
 * 实现用最小堆合并。⚠️ 概率相等时的合并顺序会影响**具体**的码长分配,
 * 但**平均码长**是唯一的 —— 这是哈夫曼最优性的一部分。所以本课只
 * 断言平均码长, 不断言单个符号的码长。
 *
 * 只有一个符号时码长为 0(不需要传任何比特), 这是约定, 也让
 * H ≤ L 在退化情形下仍成立(H 也是 0)。
 */
export function huffmanLengths(p: Dist): number[] {
  const n = p.length;
  if (n === 0) return [];
  if (n === 1) return [0];
  const depth = new Array(n).fill(0);
  // 节点: [概率, 该节点下的符号下标]
  const nodes: Array<{ w: number; ids: number[] }> = p.map((w, i) => ({ w, ids: [i] }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.w - b.w);
    const a = nodes.shift()!;
    const b = nodes.shift()!;
    for (const i of a.ids) depth[i] += 1;
    for (const i of b.ids) depth[i] += 1;
    nodes.push({ w: a.w + b.w, ids: [...a.ids, ...b.ids] });
  }
  return depth;
}

/** 哈夫曼的平均码长 Σ p_i L_i。 */
export function huffmanAverageLength(p: Dist): number {
  const L = huffmanLengths(p);
  return p.reduce((s, q, i) => s + q * L[i], 0);
}

/** 冗余 = 平均码长 − 熵, 恒在 [0, 1)。 */
export function redundancy(p: Dist): number {
  return huffmanAverageLength(p) - entropy(p);
}

/** 概率是否全为 2 的负整数次幂(此时哈夫曼精确达到 H)。 */
export function isDyadic(p: Dist, tol = 1e-9): boolean {
  return p.every((q) => {
    if (q <= 0) return true;
    const k = -Math.log2(q);
    return Math.abs(k - Math.round(k)) < tol;
  });
}

/**
 * k 阶乘积分布: 把 k 个独立同分布符号打包成一个"超符号"。
 * 字母表从 n 涨到 n^k, 概率是各分量之积。
 *
 * ⚠️ n^k 增长极快(3 元信源 k=6 就是 729 个超符号), 调用方必须限制 k。
 */
export function productDist(p: Dist, k: number): Dist {
  let cur: Dist = [1];
  for (let i = 0; i < k; i++) {
    const next: Dist = [];
    for (const a of cur) for (const q of p) next.push(a * q);
    cur = next;
  }
  return cur;
}

/**
 * 分组编码: 把 k 个符号打包后再哈夫曼, 返回**每个原始符号**的平均码长。
 *
 * 定理说这个值落在 [H, H + 1/k)。也就是说 "+1" 的浪费被 k 摊薄 ——
 * 这是信源编码定理里"渐近可达"的确切含义。
 *
 * ⚠️ 但它**不是单调下降**的。实测 p=[0.7,0.2,0.1]:
 *   k=1 → 1.3000, k=2 → 1.1650, k=3 → 1.1753, k=4 → 1.1639
 * k=3 反而比 k=2 差。原因是码长必须取整数, 而 n^k 个超符号的概率
 * 落在哪些"整数格"上并不随 k 平滑变化。定理保证的是**上界随 k 收紧**,
 * 不是每一步都更好。
 */
export function blockCodeLength(p: Dist, k: number): number {
  return huffmanAverageLength(productDist(p, k)) / k;
}

/** 熵的可加性: H(独立乘积) = k·H。这是熵"唯一合理"的核心要求之一。 */
export function additivityResidual(p: Dist, k: number): number {
  return Math.abs(entropy(productDist(p, k)) - k * entropy(p));
}

/**
 * Kraft 不等式 Σ 2^(−L_i) ≤ 1。
 * 前缀码存在的充要条件; 哈夫曼取到等号(把码树填满)。
 */
export function kraftSum(lengths: number[]): number {
  return lengths.reduce((s, L) => s + Math.pow(2, -L), 0);
}

/**
 * 三元信源: 在单纯形上采样熵或码长, 返回三角网格。
 *
 * 用重心坐标: 顶点是三个纯分布, 内部点是混合。返回的每个格点带
 * (p1,p2,p3) 与对应的值, 供 3D 绘制。
 */
export interface SimplexSample {
  p: [number, number, number];
  value: number;
}

export function sampleSimplex(
  kind: 'entropy' | 'huffman' | 'redundancy',
  res = 24,
): SimplexSample[][] {
  const rows: SimplexSample[][] = [];
  for (let i = 0; i <= res; i++) {
    const row: SimplexSample[] = [];
    for (let j = 0; j <= res; j++) {
      /*
       * ⚠️ 网格取法: 直接用 (i/res, j/res) 会跑出单纯形之外(和 >1)。
       * 这里把正方形折进三角形: 超出的部分沿对角线翻折回来, 保证
       * 每个格点都是合法的概率分布, 同时网格仍是规则的四边形阵,
       * 可以直接拿去做曲面。
       */
      let a = i / res;
      let b = j / res;
      if (a + b > 1) {
        a = 1 - a;
        b = 1 - b;
      }
      const p: [number, number, number] = [a, b, 1 - a - b];
      const h = entropy(p);
      const L = huffmanAverageLength(p);
      const value = kind === 'entropy' ? h : kind === 'huffman' ? L : L - h;
      row.push({ p, value });
    }
    rows.push(row);
  }
  return rows;
}

export interface Preset {
  id: string;
  label: string;
  p: Dist;
  note: string;
}

export const PRESETS: Preset[] = [
  { id: 'uniform', label: '均匀 [1/3,1/3,1/3]', p: [1 / 3, 1 / 3, 1 / 3], note: '熵最大 1.585' },
  { id: 'dyadic', label: '二进制 [1/2,1/4,1/4]', p: [0.5, 0.25, 0.25], note: '哈夫曼精确达到 H' },
  { id: 'skew', label: '偏斜 [0.7,0.2,0.1]', p: [0.7, 0.2, 0.1], note: '有缺口' },
  { id: 'extreme', label: '极偏 [0.9,0.07,0.03]', p: [0.9, 0.07, 0.03], note: '缺口最大' },
  { id: 'nearly', label: '几乎确定 [0.98,0.01,0.01]', p: [0.98, 0.01, 0.01], note: '熵接近 0，浪费最多' },
];
