/**
 * 互信息与信道容量
 *
 * 前两课把信息论的地基铺好了: #372 说熵是编码下界, #373 说 KL 是
 * 用错分布的代价。这门课把它们用到**两个**随机变量上, 回答:
 *
 *   知道了 Y, 关于 X 的不确定性减少了多少?
 *
 * 答案是互信息 I(X;Y), 它有四个等价写法, 每个都说明一件事:
 *
 *   I = H(X) − H(X|Y)        知道 Y 后, X 的不确定性减少了多少
 *   I = H(Y) − H(Y|X)        对称: 知道 X 后 Y 减少同样多
 *   I = H(X) + H(Y) − H(X,Y) 两个圆的交集(维恩图)
 *   I = D(P_XY ‖ P_X·P_Y)    实际联合分布与"假装独立"之间的 KL
 *
 * 最后一个把它接回上一课: **互信息就是"离独立有多远"的 KL 度量**。
 * 独立时 I = 0, 这也是 I ≥ 0 的来源(Gibbs 不等式)。
 *
 * 项目里「决策树」那课一直在用**信息增益**选分裂, 但从没说它就是
 * 互信息 —— 信息增益 = I(标签; 某个特征)。这门课把这层关系点破。
 *
 * 信道容量: 信道由条件分布 P(Y|X) 描述, 输入分布 P(X) 可以自己选。
 *
 *   C = max_{P(X)} I(X;Y)
 *
 * 对二元对称信道(翻转概率 e), 容量是 1 − H(e), 在输入均匀时取到。
 * 实测: e=0.1 时 a=0.5 给 0.5310 = 1−H(0.1), 而 a=0.3 只有 0.4558。
 * 容量是**最大值**, 不是随便一个输入都能达到 —— 这一点本课画出来。
 *
 * ⚠️ e=0.5 时容量为 0: 信道翻转一半, 输出与输入独立, 一个比特也
 * 传不过去。这不是"传得慢", 是**根本传不了**。
 *
 * 3D 用在哪: I(X;Y) 是 (输入分布 a, 噪声 e) 两个变量的函数, 画成
 * 曲面才看得出"沿 a 有个峰(容量在峰顶)"与"沿 e 单调衰减到 0"是
 * 两种不同的形状。容量曲线就是这张曲面沿 a 方向的**脊线**。
 */

export type Dist = number[];
/** 联合分布, joint[i][j] = P(X=i, Y=j) */
export type Joint = number[][];

export function entropy(p: Dist): number {
  let h = 0;
  for (const q of p) if (q > 0) h -= q * Math.log2(q);
  return h;
}

/** 二元熵函数 H(e) = −e log e − (1−e) log(1−e)。 */
export function binaryEntropy(e: number): number {
  return entropy([e, 1 - e]);
}

/** 联合分布的熵 H(X,Y)。 */
export function jointEntropy(J: Joint): number {
  return entropy(J.flat());
}

/** 边缘分布 P(X)。 */
export function marginalX(J: Joint): Dist {
  return J.map((row) => row.reduce((a, b) => a + b, 0));
}

/** 边缘分布 P(Y)。 */
export function marginalY(J: Joint): Dist {
  const n = J[0].length;
  const out = new Array(n).fill(0);
  for (const row of J) for (let j = 0; j < n; j++) out[j] += row[j];
  return out;
}

/**
 * 条件熵 H(X|Y) = H(X,Y) − H(Y)。
 *
 * 用差值算而不是按定义 Σ P(y)H(X|y) 逐项累加 —— 后者在 P(y)=0 时
 * 要额外判空, 而差值形式天然处理好了(那一行对两个熵的贡献都是 0)。
 */
export function conditionalEntropyXgivenY(J: Joint): number {
  return jointEntropy(J) - entropy(marginalY(J));
}

export function conditionalEntropyYgivenX(J: Joint): number {
  return jointEntropy(J) - entropy(marginalX(J));
}

/**
 * 互信息 I(X;Y) = H(X) + H(Y) − H(X,Y)。
 *
 * ⚠️ 用这个形式而不是 Σ P(x,y) log(P(x,y)/(P(x)P(y))): 后者在
 * P(x,y)=0 时要跳过, 在 P(x)P(y)=0 时又要另判, 边界情形容易写错。
 * 三个熵相减只需各自处理 0·log0, 而 entropy() 已经处理好了。
 */
export function mutualInformation(J: Joint): number {
  return entropy(marginalX(J)) + entropy(marginalY(J)) - jointEntropy(J);
}

/** 互信息的 KL 形式: D(P_XY ‖ P_X·P_Y)。应与上式相等。 */
export function mutualInformationAsKL(J: Joint): number {
  const px = marginalX(J);
  const py = marginalY(J);
  let d = 0;
  for (let i = 0; i < J.length; i++) {
    for (let j = 0; j < J[i].length; j++) {
      const p = J[i][j];
      if (p <= 0) continue;
      const q = px[i] * py[j];
      if (q <= 0) return Infinity;
      d += p * Math.log2(p / q);
    }
  }
  return d;
}

export type ChannelKind = 'bsc' | 'bec' | 'z';

/**
 * 由输入分布与信道构造联合分布。
 *
 * BSC(二元对称): 以概率 e 翻转。输出仍是 2 元。
 * BEC(二元擦除): 以概率 e 变成"擦除"符号(第 3 个输出), 否则原样传。
 *   它的容量是 1−e, 与 BSC 的 1−H(e) 形状完全不同 —— 擦除比翻转
 *   温和得多, 因为接收方**知道**自己丢了哪一位。
 * Z 信道(非对称): 0 一定传对, 1 以概率 e 变成 0。现实里常见于
 *   "只会漏检、不会误报"的场合。
 */
export function makeJoint(a: number, e: number, kind: ChannelKind): Joint {
  const px = [a, 1 - a];
  if (kind === 'bsc') {
    return [
      [px[0] * (1 - e), px[0] * e],
      [px[1] * e, px[1] * (1 - e)],
    ];
  }
  if (kind === 'bec') {
    // 输出: 0, 1, 擦除
    return [
      [px[0] * (1 - e), 0, px[0] * e],
      [0, px[1] * (1 - e), px[1] * e],
    ];
  }
  // Z 信道: 输入 0 必得 0; 输入 1 以 e 变成 0
  return [
    [px[0], 0],
    [px[1] * e, px[1] * (1 - e)],
  ];
}

/** 给定信道与输入分布, 直接算互信息。 */
export function channelMI(a: number, e: number, kind: ChannelKind): number {
  return mutualInformation(makeJoint(a, e, kind));
}

/**
 * 信道容量 C = max_a I(a, e), 以及取到最大的输入分布 a*。
 *
 * 用细网格扫描 + 局部细化。二元输入只有一个自由参数 a, 而 I 关于 a
 * 是凹函数(信息论的标准结论), 所以扫描能稳稳找到全局最大。
 * 不用解析式是为了让三种信道走同一套代码 —— 而且能顺便验证
 * "BSC 的容量确实等于 1−H(e)"这个解析结论。
 */
export function channelCapacity(
  e: number, kind: ChannelKind, coarse = 200,
): { capacity: number; aStar: number } {
  let best = -Infinity;
  let aStar = 0.5;
  for (let i = 0; i <= coarse; i++) {
    const a = i / coarse;
    const v = channelMI(a, e, kind);
    if (v > best) {
      best = v;
      aStar = a;
    }
  }
  // 在最优点附近细化
  const step = 1 / coarse;
  for (let r = 0; r < 3; r++) {
    const lo = Math.max(0, aStar - step / Math.pow(10, r));
    const hi = Math.min(1, aStar + step / Math.pow(10, r));
    for (let i = 0; i <= 40; i++) {
      const a = lo + ((hi - lo) * i) / 40;
      const v = channelMI(a, e, kind);
      if (v > best) {
        best = v;
        aStar = a;
      }
    }
  }
  /*
   * ⚠️ 容量为 0 时 a* 无意义。
   * BSC 在 e=0.5 时对**所有** a 都有 I=0, 扫描只会挑到一个任意的
   * 并列最大值(实测报了 0.1150), 那不是"最优输入", 只是浮点比较的
   * 偶然结果。这种情形统一返回 0.5 并让调用方知道容量为零 ——
   * 报一个看似精确的 0.1150 会误导人以为存在最优选择。
   */
  const capacity = Math.max(0, best);
  return { capacity, aStar: capacity < 1e-12 ? 0.5 : aStar };
}

/** BSC 的解析容量 1−H(e), 用于与数值搜索对照。 */
export function bscCapacityAnalytic(e: number): number {
  return Math.max(0, 1 - binaryEntropy(e));
}

/** BEC 的解析容量 1−e。 */
export function becCapacityAnalytic(e: number): number {
  return Math.max(0, 1 - e);
}

/** 采样 I(a, e) 曲面。 */
export function sampleSurface(
  kind: ChannelKind, aSteps = 30, eSteps = 30,
): number[][] {
  const g: number[][] = [];
  for (let i = 0; i <= aSteps; i++) {
    const a = i / aSteps;
    const row: number[] = [];
    for (let j = 0; j <= eSteps; j++) {
      row.push(channelMI(a, j / eSteps, kind));
    }
    g.push(row);
  }
  return g;
}

export interface Preset {
  id: string;
  label: string;
  kind: ChannelKind;
  a: number;
  e: number;
  note: string;
}

export const PRESETS: Preset[] = [
  { id: 'clean', label: '无噪声 BSC', kind: 'bsc', a: 0.5, e: 0, note: 'I = 1，满信道' },
  { id: 'noisy', label: 'BSC 噪声 0.1', kind: 'bsc', a: 0.5, e: 0.1, note: '容量 1−H(e)=0.531' },
  { id: 'suboptimal', label: '输入不均匀', kind: 'bsc', a: 0.3, e: 0.1, note: '只有 0.456 < 容量' },
  { id: 'useless', label: 'BSC 噪声 0.5', kind: 'bsc', a: 0.5, e: 0.5, note: 'I = 0，一个比特也传不了' },
  { id: 'erasure', label: '擦除信道 0.3', kind: 'bec', a: 0.5, e: 0.3, note: '容量 1−e=0.7，比翻转温和' },
  { id: 'zchan', label: 'Z 信道 0.3', kind: 'z', a: 0.5, e: 0.3, note: '不对称，最优输入不是 0.5' },
];
