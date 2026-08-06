/**
 * 共焦二次曲面与椭球坐标
 *
 * 固定三个常数 a > b > c > 0, 让 λ 跑遍实数, 得到一族曲面:
 *
 *   x²/(a²−λ) + y²/(b²−λ) + z²/(c²−λ) = 1
 *
 * 这一族叫**共焦二次曲面**。λ 只改分母、不改分子, 于是所有曲面共用
 * 同一组焦点(焦线), 就像平面上共焦的椭圆与双曲线共用两个焦点。
 *
 * 随 λ 落在哪一段, 曲面换一种类型:
 *   λ < c²          三个分母全正 → **椭球面**
 *   c² < λ < b²     只有 z 项分母变负 → **单叶双曲面**
 *   b² < λ < a²     y、z 两项分母为负 → **双叶双曲面**
 *   λ > a²          三项全负, 无实点
 *
 * 本课要说明的是 Jacobi 的结论:
 *
 *   空间中任取一点(不在坐标平面上), 恰好有**三张**共焦曲面过它,
 *   一张椭球、一张单叶、一张双叶, 而且这三张面**两两正交**。
 *
 * 于是 (λ₁, λ₂, λ₃) 可以当作一套坐标用 —— 椭球坐标。它是三维里
 * 除直角/柱/球之外最重要的正交坐标系, 因为拉普拉斯方程在其中可分离。
 *
 * 二维里没有可看的对应物: 平面上过一点只有两条共焦曲线, 正交是
 * 一句就能验完的事; 三张曲面两两正交, 必须真的在空间里看。
 */

export interface Confocal {
  /** a > b > c > 0 */
  a: number;
  b: number;
  c: number;
}

export type QuadricKind = 'ellipsoid' | 'hyperboloid1' | 'hyperboloid2' | 'empty';

export const KIND_LABEL: Record<QuadricKind, string> = {
  ellipsoid: '椭球面',
  hyperboloid1: '单叶双曲面',
  hyperboloid2: '双叶双曲面',
  empty: '无实点',
};

/** 由 λ 判定曲面类型。 */
export function kindOf(q: Confocal, lambda: number): QuadricKind {
  const { a, b, c } = q;
  if (lambda < c * c) return 'ellipsoid';
  if (lambda < b * b) return 'hyperboloid1';
  if (lambda < a * a) return 'hyperboloid2';
  return 'empty';
}

/**
 * 定义式左边减 1。零点即曲面上的点。
 * 分母为零时返回 ±∞ —— 调用方靠符号变化定位根, 不能当 NaN 丢掉。
 */
export function residual(q: Confocal, p: [number, number, number], lambda: number): number {
  const [x, y, z] = p;
  const { a, b, c } = q;
  const da = a * a - lambda;
  const db = b * b - lambda;
  const dc = c * c - lambda;
  return (x * x) / da + (y * y) / db + (z * z) / dc - 1;
}

/**
 * 解出过点 p 的三个 λ。
 *
 * 把定义式通分, 得到关于 λ 的**三次方程**, 故最多三个根。而三个根
 * 必然分别落在三个区间里:
 *
 *   λ₁ < c² < λ₂ < b² < λ₃ < a²
 *
 * 理由是符号: 令 f(λ) = 残量。在 λ→c²⁻ 时 z²/(c²−λ) → +∞, 在
 * λ→c²⁺ 时 → −∞, 所以 f 在 c² 两侧异号; b²、a² 处同理。于是每个
 * 区间里恰有一个根 —— 三张曲面各一张, 类型也就定死了。
 *
 * ⚠️ 用**二分**而不是解析求根公式。三次求根公式在判别式接近 0 时
 * 会有严重的相消误差, 而这里根被区间夹住、f 在区间内单调, 二分
 * 又稳又准, 60 次迭代就到机器精度。
 *
 * 端点要往里缩一点(eps): λ 精确等于 c² 时分母为零。
 */
export function solveLambdas(
  q: Confocal,
  p: [number, number, number],
): [number, number, number] | null {
  const { a, b, c } = q;
  const [x, y, z] = p;
  // 落在坐标平面上时某个根退化到区间端点, 三张面不再两两横截
  if (Math.abs(x) < 1e-9 || Math.abs(y) < 1e-9 || Math.abs(z) < 1e-9) return null;

  const A = a * a;
  const B = b * b;
  const C = c * c;
  // 椭球那一段左端没有天然界限, 取一个足够负的下界:
  // λ → −∞ 时 f → −1 < 0, 而 λ → C⁻ 时 f → +∞, 故根一定在里面
  const lo0 = -(x * x + y * y + z * z) - A - 1;

  const bisect = (lo: number, hi: number): number => {
    let l = lo;
    let h = hi;
    let fl = residual(q, p, l);
    for (let i = 0; i < 80; i++) {
      const m = (l + h) / 2;
      const fm = residual(q, p, m);
      if (fm === 0 || !Number.isFinite(fm)) return m;
      if (fl * fm < 0) {
        h = m;
      } else {
        l = m;
        fl = fm;
      }
    }
    return (l + h) / 2;
  };

  const eps = 1e-12;
  const l1 = bisect(lo0, C - eps);
  const l2 = bisect(C + eps, B - eps);
  const l3 = bisect(B + eps, A - eps);
  return [l1, l2, l3];
}

/**
 * 曲面在点 p 处的梯度(法向量, 未单位化):
 *   ∇f = 2( x/(a²−λ), y/(b²−λ), z/(c²−λ) )
 * 常数因子 2 对正交性检验无影响, 这里省掉。
 */
export function gradient(
  q: Confocal,
  p: [number, number, number],
  lambda: number,
): [number, number, number] {
  const [x, y, z] = p;
  const { a, b, c } = q;
  return [x / (a * a - lambda), y / (b * b - lambda), z / (c * c - lambda)];
}

export function dot3(u: [number, number, number], v: [number, number, number]): number {
  return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
}

export function norm3(u: [number, number, number]): number {
  return Math.hypot(u[0], u[1], u[2]);
}

/**
 * 两两正交检验。返回三对法向量夹角与 90° 的偏差(弧度)。
 *
 * 用**归一化后的点积**再取 acos, 而不是直接看点积绝对值 ——
 * 点积本身带量纲, 曲面参数一变数量级就跟着变, 看不出"多接近正交"。
 * 角度偏差是无量纲的, 才好断言。
 */
export function orthogonality(
  q: Confocal,
  p: [number, number, number],
): { pairs: Array<{ i: number; j: number; angleDev: number }>; maxDev: number } | null {
  const ls = solveLambdas(q, p);
  if (!ls) return null;
  const gs = ls.map((l) => gradient(q, p, l)) as Array<[number, number, number]>;
  const pairs: Array<{ i: number; j: number; angleDev: number }> = [];
  let maxDev = 0;
  for (const [i, j] of [[0, 1], [0, 2], [1, 2]] as Array<[number, number]>) {
    const cosA = dot3(gs[i], gs[j]) / (norm3(gs[i]) * norm3(gs[j]));
    const ang = Math.acos(Math.max(-1, Math.min(1, cosA)));
    const dev = Math.abs(ang - Math.PI / 2);
    pairs.push({ i, j, angleDev: dev });
    maxDev = Math.max(maxDev, dev);
  }
  return { pairs, maxDev };
}

/** 三个半轴平方值 (a²−λ, b²−λ, c²−λ)。负值表示该方向是"虚轴"。 */
export function semiAxesSq(q: Confocal, lambda: number): [number, number, number] {
  return [q.a * q.a - lambda, q.b * q.b - lambda, q.c * q.c - lambda];
}

/**
 * 参数化采样一张共焦曲面, 返回 (u,v) 网格。三种类型各有各的参数化:
 *
 *   椭球面     x=A cos v cos u, y=B cos v sin u, z=C sin v
 *   单叶双曲面 x=A cosh v cos u, y=B cosh v sin u, z=|C| sinh v
 *              (z 项分母为负, 写成 −z²/|c²−λ|, 故用双曲函数)
 *   双叶双曲面 x=±A cosh v, y=|B| sinh v cos u, z=|C| sinh v sin u
 *              (y、z 两项都变负, 只有 x 方向是实轴, 两叶靠符号分开)
 *
 * 双叶返回两片, 其余一片。
 */
export function sampleQuadric(
  q: Confocal,
  lambda: number,
  uSteps = 48,
  vSteps = 24,
  vSpan = 1.35,
): Array<Array<Array<[number, number, number]>>> {
  const kind = kindOf(q, lambda);
  if (kind === 'empty') return [];
  const [sa, sb, sc] = semiAxesSq(q, lambda);
  const A = Math.sqrt(Math.abs(sa));
  const B = Math.sqrt(Math.abs(sb));
  const C = Math.sqrt(Math.abs(sc));

  const grid = (
    f: (u: number, v: number) => [number, number, number],
    vLo: number,
    vHi: number,
  ) => {
    const g: Array<Array<[number, number, number]>> = [];
    for (let i = 0; i <= vSteps; i++) {
      const v = vLo + ((vHi - vLo) * i) / vSteps;
      const row: Array<[number, number, number]> = [];
      for (let j = 0; j <= uSteps; j++) {
        row.push(f((j / uSteps) * Math.PI * 2, v));
      }
      g.push(row);
    }
    return g;
  };

  if (kind === 'ellipsoid') {
    return [grid((u, v) => [A * Math.cos(v) * Math.cos(u), B * Math.cos(v) * Math.sin(u), C * Math.sin(v)], -Math.PI / 2, Math.PI / 2)];
  }
  if (kind === 'hyperboloid1') {
    return [grid((u, v) => [A * Math.cosh(v) * Math.cos(u), B * Math.cosh(v) * Math.sin(u), C * Math.sinh(v)], -vSpan, vSpan)];
  }
  // 双叶: 两片各自参数化, 靠 x 的符号分开
  return [1, -1].map((s) =>
    grid((u, v) => [s * A * Math.cosh(v), B * Math.sinh(v) * Math.cos(u), C * Math.sinh(v) * Math.sin(u)], 0, vSpan),
  );
}

/**
 * 显示半径。三张面里只有椭球是有界的, 两张双曲面都能一直延伸出去,
 * 画多远完全取决于参数区间 —— 实测双曲面跑到 4.04 和 3.50, 而椭球
 * 只有 2.93, 于是双曲面把椭球整个吞掉, "三张面交于一点"这件事
 * 反而看不见了。
 *
 * 所以统一裁到一个球内: 三张面在**同一块区域**上比较, 相交关系
 * 才读得出来。这也是画无界二次曲面的通行做法。
 */
/*
 * ⚠️ 半径不能取得太小。单叶双曲面的**腰**已经在 x=2.42 处, 若裁到
 * 3.2, 只剩 |v|<0.65 的一薄条 —— 曲面来不及张开, 画出来是一片
 * 平帘子, 看不出"细腰上下张开"这个特征形状。取 4.6 时腰和喇叭口
 * 都在, 而椭球(最大半轴 2.93)仍完整。
 */
export const DISPLAY_RADIUS = 4.6;

/** 点是否在显示球内。 */
export function insideDisplay(p: [number, number, number], r = DISPLAY_RADIUS): boolean {
  return Math.hypot(p[0], p[1], p[2]) <= r;
}

export interface Preset {
  id: string;
  label: string;
  point: [number, number, number];
  note: string;
}

export const DEFAULT_CONFOCAL: Confocal = { a: 3, b: 2, c: 1 };

export const PRESETS: Preset[] = [
  { id: 'mid', label: '一般位置', point: [1.2, 0.9, 0.6], note: '三张面斜着相交' },
  { id: 'far', label: '远离原点', point: [4, 3, 2], note: '椭球的 λ 变成负数' },
  { id: 'near', label: '靠近原点', point: [0.5, 0.4, 0.3], note: '三个 λ 都逼近区间端点' },
  { id: 'flat', label: '贴近 xy 平面', point: [1.6, 1.0, 0.15], note: '双叶几乎退化成平面' },
];

