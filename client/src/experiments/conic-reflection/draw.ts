/**
 * 圆锥曲线反射性质的绘图层。
 *
 * 画面构成:
 *   - 曲线本体(双曲线分两支画)
 *   - 焦点 F₁、F₂(抛物线的 F₂ 用轴向箭头代替)
 *   - 入射线 F₁→P、切线、法线、出射线
 *   - 两个夹角的圆弧标注 + 读数 —— 结论就是这两个数字相等
 *   - 台球模式: 从焦点连续弹射的折线
 */

import {
  billiardPath,
  dot,
  focalC,
  foci,
  measureReflection,
  normalize,
  sampleCurve,
  tangentAt,
  type Conic,
  type Vec2,
} from './conicReflection';

export interface DrawOpts {
  conic: Conic;
  /** 反射点的曲线参数 */
  t: number;
  branch?: 1 | -1;
  /** 显示切线/法线 */
  showTangent?: boolean;
  /** 显示两个夹角的弧线与读数 */
  showAngles?: boolean;
  /** 台球模式: 画连续弹射轨迹, 值为弹射次数(0 = 关闭) */
  bounces?: number;
  /** 台球起始方向角 */
  billiardAngle?: number;
  /** 多条光线同时射出(展示"条条都过 F₂") */
  rayFan?: number;
}

const COL = {
  bg: '#0b1020',
  axis: '#334155',
  curve: '#facc15',
  curve2: '#f59e0b',
  focus: '#ef4444',
  focus2: '#fb7185',
  incoming: '#60a5fa',
  outgoing: '#4ade80',
  tangent: '#22d3ee',
  normal: '#a78bfa',
  point: '#fde047',
  text: '#e2e8f0',
  dim: '#94a3b8',
  fan: '#38bdf8',
  billiard: '#f472b6',
};

/**
 * 取景: 由实际采样点定, 不用手推公式(双曲线尾巴会跑很远)。
 *
 * ⚠️ 不能假设图形关于原点对称。抛物线只占 x≥0 的一侧, 早先按
 * |x| 的分位数取一个 reach 再左右对称铺开, 结果曲线挤在左半边、
 * 右半边全是空白。这里改为**分别**取 x/y 的上下分位数, 再按包围盒
 * 的中心平移 —— 三种曲线都能居中。
 *
 * 分位数(而非最值)是为双曲线准备的: 它逼近渐近线时坐标会跑到很大,
 * 取最值会让曲线缩成一团。
 */
function makeTransform(w: number, h: number, k: Conic) {
  const pts = sampleCurve(k, 361).flat();
  const pct = (arr: number[], q: number): number => {
    if (arr.length === 0) return 0;
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.max(0, Math.min(s.length - 1, Math.round(q * (s.length - 1))))];
  };
  const { f1, f2 } = foci(k);
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  // 焦点必须进画面
  const fxs = [f1.x, ...(f2 ? [f2.x] : [])];
  const xMin = Math.min(pct(xs, 0.02), ...fxs);
  const xMax = Math.max(pct(xs, 0.98), ...fxs);
  const yMin = Math.min(pct(ys, 0.02), 0);
  const yMax = Math.max(pct(ys, 0.98), 0);

  const spanX = Math.max(xMax - xMin, 1e-6) * 1.16;
  const spanY = Math.max(yMax - yMin, 1e-6) * 1.18;
  const pad = 52;
  const s = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanY);

  const midX = (xMin + xMax) / 2;
  const midY = (yMin + yMax) / 2;
  const cx = w / 2 - midX * s;
  const cy = h / 2 + midY * s;
  return {
    s,
    toScreen: (x: number, y: number): [number, number] => [cx + x * s, cy - y * s],
  };
}

type ToScreen = (x: number, y: number) => [number, number];

function line(ctx: CanvasRenderingContext2D, ts: ToScreen, a: Vec2, b: Vec2): void {
  const [x1, y1] = ts(a.x, a.y);
  const [x2, y2] = ts(b.x, b.y);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function dot2(
  ctx: CanvasRenderingContext2D, ts: ToScreen, p: Vec2, r: number, col: string,
): void {
  const [x, y] = ts(p.x, p.y);
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** 在 P 处画一段夹角圆弧, 标出「入射线—切线」或「出射线—切线」。 */
function angleArc(
  ctx: CanvasRenderingContext2D, ts: ToScreen,
  p: Vec2, u: Vec2, v: Vec2, radius: number, col: string,
): void {
  const [px, py] = ts(p.x, p.y);
  // 屏幕 y 轴朝下, 角度要取负
  const a1 = Math.atan2(-u.y, u.x);
  const a2 = Math.atan2(-v.y, v.x);
  let d = a2 - a1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(px, py, radius, a1, a1 + d, d < 0);
  ctx.stroke();
}

/** 画一条曲线段。 */
function polyline(
  ctx: CanvasRenderingContext2D, ts: ToScreen, pts: Vec2[], col: string, width = 2.5,
): void {
  if (pts.length < 2) return;
  ctx.strokeStyle = col;
  ctx.lineWidth = width;
  ctx.setLineDash([]);
  ctx.beginPath();
  pts.forEach((p, i) => {
    const [x, y] = ts(p.x, p.y);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

/** 带箭头的线段, 用于表示光线方向。 */
function arrow(
  ctx: CanvasRenderingContext2D, ts: ToScreen, a: Vec2, b: Vec2, col: string, width = 2,
): void {
  ctx.strokeStyle = col;
  ctx.lineWidth = width;
  ctx.setLineDash([]);
  line(ctx, ts, a, b);
  const [x1, y1] = ts(a.x, a.y);
  const [x2, y2] = ts(b.x, b.y);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const L = 9;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - L * Math.cos(ang - 0.4), y2 - L * Math.sin(ang - 0.4));
  ctx.lineTo(x2 - L * Math.cos(ang + 0.4), y2 - L * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();
}

/** 入口: 接 canvas, 与其他实验的 draw* 约定一致 */
export function drawConicReflection(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    conic: k, t, branch = 1,
    showTangent = true, showAngles = true,
    bounces = 0, billiardAngle = 0.9, rayFan = 0,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);
  const { s, toScreen: ts } = makeTransform(w, h, k);

  // ---- 坐标轴 ----
  ctx.strokeStyle = COL.axis;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  const [ox, oy] = ts(0, 0);
  ctx.beginPath();
  ctx.moveTo(0, oy); ctx.lineTo(w, oy);
  ctx.moveTo(ox, 0); ctx.lineTo(ox, h);
  ctx.stroke();

  // ---- 曲线 ----
  const segs = sampleCurve(k, 481);
  segs.forEach((seg, i) => polyline(ctx, ts, seg, i === 0 ? COL.curve : COL.curve2));

  const { f1, f2 } = foci(k);

  // ---- 台球模式: 只画折线, 不画单次反射的细节 ----
  if (bounces > 0 && k.kind === 'ellipse') {
    const path = billiardPath(k, f1, { x: Math.cos(billiardAngle), y: Math.sin(billiardAngle) }, bounces);
    polyline(ctx, ts, path, COL.billiard, 1.8);
    path.forEach((p, i) => { if (i > 0) dot2(ctx, ts, p, 3, COL.billiard); });
  } else if (rayFan > 0) {
    // ---- 光线扇: 从 F₁ 射出多条, 每条反射一次 ----
    for (const tp of fanParams(k, rayFan)) {
      const m = measureReflection(k, tp, branch);
      ctx.globalAlpha = 0.72;
      arrow(ctx, ts, f1, m.p, COL.fan, 1.4);
      const end = outgoingEnd(k, m.p, m.reflected, f2, w, h, s);
      arrow(ctx, ts, m.p, end, COL.outgoing, 1.4);
      ctx.globalAlpha = 1;
      dot2(ctx, ts, m.p, 2.5, COL.point);
    }
  } else {
    drawSingleRay(ctx, ts, k, t, branch, showTangent, showAngles, w, h, s);
  }

  // ---- 焦点 ----
  dot2(ctx, ts, f1, 6, COL.focus);
  label(ctx, ts, f1, 'F₁', COL.focus, 12, -18);
  if (f2) {
    dot2(ctx, ts, f2, 6, COL.focus2);
    label(ctx, ts, f2, 'F₂', COL.focus2, 12, -18);
  }

  drawReadout(ctx, h, k, t, branch, bounces, rayFan);
}

/**
 * 光线扇用的参数列表。
 *
 * ⚠️ 早先是从「出射方向角」反推参数, 结果抛物线上 11 条光线只有 4 条
 * 落在画出来的那段弧上, 其余打到了框外看不见的地方, 画面上就出现
 * 几条有去无回的蓝线。改成**直接在绘制用的参数区间里均匀取点**,
 * 每条光线必定落在可见曲线上 —— 反射点由参数定, 不由角度定。
 */
function fanParams(k: Conic, n: number, span = 2.2): number[] {
  const out: number[] = [];
  const lo = k.kind === 'ellipse' ? 0 : k.kind === 'parabola' ? -span * 2 * k.a : -span * 0.8;
  const hi = k.kind === 'ellipse' ? Math.PI * 2 : k.kind === 'parabola' ? span * 2 * k.a : span * 0.8;
  for (let i = 0; i < n; i++) {
    // 椭圆闭合, 首尾重合, 故按 n 等分而非 n−1
    const u = k.kind === 'ellipse' ? i / n : i / Math.max(1, n - 1);
    out.push(lo + (hi - lo) * u);
  }
  return out;
}

/**
 * 出射线的终点。
 * 椭圆到 F₂ 为止(光真的走到那里); 抛物线/双曲线射向画面外,
 * 取一个足够长、恰好出框的长度。
 */
function outgoingEnd(
  k: Conic, p: Vec2, dir: Vec2, f2: Vec2 | null, w: number, h: number, s: number,
): Vec2 {
  if (k.kind === 'ellipse' && f2) return f2;
  const len = (Math.hypot(w, h) / s) * 0.6;
  const d = normalize(dir);
  return { x: p.x + d.x * len, y: p.y + d.y * len };
}

function label(
  ctx: CanvasRenderingContext2D, ts: ToScreen, p: Vec2,
  text: string, col: string, dx = 10, dy = -10,
): void {
  const [x, y] = ts(p.x, p.y);
  ctx.fillStyle = col;
  ctx.font = '600 14px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + dx, y + dy);
}

/** 单次反射的完整细节: 入射、切线、法线、出射、两个夹角。 */
function drawSingleRay(
  ctx: CanvasRenderingContext2D, ts: ToScreen, k: Conic, t: number, branch: 1 | -1,
  showTangent: boolean, showAngles: boolean, w: number, h: number, s: number,
): void {
  const m = measureReflection(k, t, branch);
  const { f1, f2 } = foci(k);
  const p = m.p;

  // 切线: 以 P 为中心向两侧各延一段
  if (showTangent) {
    const tg = normalize(tangentAt(k, t, branch));
    const L = Math.min(w, h) / s / 3.4;
    ctx.strokeStyle = COL.tangent;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([7, 5]);
    line(ctx, ts, { x: p.x - tg.x * L, y: p.y - tg.y * L }, { x: p.x + tg.x * L, y: p.y + tg.y * L });
    // 法线(较短, 虚线)
    const n = { x: tg.y, y: -tg.x };
    ctx.strokeStyle = COL.normal;
    ctx.setLineDash([3, 4]);
    line(ctx, ts, { x: p.x - n.x * L * 0.5, y: p.y - n.y * L * 0.5 }, { x: p.x + n.x * L * 0.5, y: p.y + n.y * L * 0.5 });
    ctx.setLineDash([]);
    label(ctx, ts, { x: p.x + tg.x * L, y: p.y + tg.y * L }, '切线', COL.tangent, 6, -6);
  }

  // 入射线 F₁ → P
  arrow(ctx, ts, f1, p, COL.incoming, 2.4);
  // 出射线
  const end = outgoingEnd(k, p, m.reflected, f2, w, h, s);
  arrow(ctx, ts, p, end, COL.outgoing, 2.4);

  // 双曲线: 出射线的反向延长线指向 F₂, 用虚线补出来 —— 「像是从 F₂ 发出」
  if (k.kind === 'hyperbola' && f2) {
    ctx.strokeStyle = COL.focus2;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 5]);
    line(ctx, ts, f2, p);
    ctx.setLineDash([]);
  }

  if (showAngles) {
    const tg = normalize(tangentAt(k, t, branch));
    const inDir = normalize({ x: p.x - f1.x, y: p.y - f1.y });
    // 入射角画在入射线与切线之间, 出射角画在出射线与切线之间。
    // 两条切线方向取相反侧, 两段弧才不会叠在一起。
    /*
     * 两段弧必须各自贴住自己那一对线, 否则会连成一个整圆 ——
     * 双曲线那张图上就是这样, 完全看不出「在比两个角」。
     *
     * 关键在于切线有两个方向, 该取哪一个不能靠手写死: 它随反射点
     * 位置变。这里按「与该光线夹角为锐角」来选边 —— 这正是
     * angleBetween 实际度量的那个角, 于是画出来的弧与读数一致。
     */
    const pickSide = (u: Vec2): Vec2 =>
      dot(u, tg) >= 0 ? tg : { x: -tg.x, y: -tg.y };
    // 入射线在 P 处的「来向」是 −inDir(从 P 指回 F₁)
    const back = { x: -inDir.x, y: -inDir.y };
    const out = normalize(m.reflected);
    angleArc(ctx, ts, p, back, pickSide(back), 26, COL.incoming);
    angleArc(ctx, ts, p, out, pickSide(out), 36, COL.outgoing);
  }

  dot2(ctx, ts, p, 5.5, COL.point);
  label(ctx, ts, p, 'P', COL.point, 10, -14);
}

const KIND_CN: Record<Conic['kind'], string> = {
  ellipse: '椭圆', parabola: '抛物线', hyperbola: '双曲线',
};

/** 右上角读数。核心是两个角的数值 —— 它们必须一样。 */
function drawReadout(
  ctx: CanvasRenderingContext2D, hCanvas: number,
  k: Conic, t: number, branch: 1 | -1, bounces: number, rayFan: number,
): void {
  const deg = (r: number) => ((r * 180) / Math.PI).toFixed(5);
  const lines: Array<[string, string]> = [];

  if (bounces > 0 && k.kind === 'ellipse') {
    const e = focalC(k) / k.a;
    lines.push(['椭圆台球', `弹射 ${bounces} 次`]);
    lines.push(['每次都过另一焦点', '']);
    lines.push(['贴近长轴的比率', `(1−e)/(1+e) = ${((1 - e) / (1 + e)).toFixed(5)}`]);
  } else if (rayFan > 0) {
    lines.push([`${KIND_CN[k.kind]}`, `${rayFan} 条光线`]);
    lines.push(['从 F₁ 各方向射出', '']);
    lines.push([k.kind === 'parabola' ? '反射后全部平行于轴' : '反射后全部过 F₂', '']);
  } else {
    const m = measureReflection(k, t, branch);
    lines.push([`${KIND_CN[k.kind]}`, '']);
    lines.push(['入射角(与切线)', `${deg(m.inAngle)}°`]);
    lines.push(['反射角(与切线)', `${deg(m.outAngle)}°`]);
    lines.push(['差', `${Math.abs(m.gap) < 1e-12 ? '0（相等）' : m.gap.toExponential(2)}`]);
  }

  const pad = 12;
  const lh = 21;
  ctx.font = '13px system-ui, sans-serif';
  const wid = Math.max(
    ...lines.map(([a, b]) => ctx.measureText(a + '  ' + b).width),
  ) + pad * 2;
  // 面板放左下角。原先在右上角, 抛物线与椭圆的曲线本体正好经过那里,
  // 数字压在曲线上; 左下角三种曲线都空着(双曲线左支在左中, 不到底部)。
  const x0 = 14;
  const y0 = hCanvas - (lines.length * lh + pad * 2 - 6) - 14;
  ctx.fillStyle = 'rgba(15,23,42,0.85)';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x0, y0, wid, lines.length * lh + pad * 2 - 6, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  lines.forEach(([a, b], i) => {
    const y = y0 + pad + lh * i + 6;
    // 「差 = 0」是全课结论, 给它高亮色
    const isKey = a === '差';
    ctx.fillStyle = isKey ? '#4ade80' : COL.dim;
    ctx.fillText(a, x0 + pad, y);
    ctx.fillStyle = isKey ? '#4ade80' : COL.text;
    ctx.textAlign = 'right';
    ctx.fillText(b, x0 + wid - pad, y);
    ctx.textAlign = 'left';
  });
}

