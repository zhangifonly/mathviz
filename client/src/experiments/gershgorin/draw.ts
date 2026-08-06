/**
 * Gershgorin 圆盘的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 为什么这门课要 3D: 圆盘本身住在**复平面**(二维)上, 但行圆盘与列圆盘
 * 是两套不同的估计, 平铺在一起会糊成一团。这里把它们分层堆在 z 方向:
 *   z = 0    行圆盘
 *   z = −h   列圆盘
 *   特征值同时投到两层上, 一眼看出"两套圆盘都圈住了它"。
 *
 * 画面元素:
 *   - 复平面网格与实轴/虚轴
 *   - 圆盘(填充半透明 + 描边), 圆心用小十字标出
 *   - 特征值(亮黄点); 复特征值明显离开实轴
 *   - 连通分量用不同颜色区分, 并标注"k 盘 / k 值"
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import {
  colDiscs, componentCounts, eigenvalues, gershgorinBound, rowDiscs,
  spectralRadius, isStrictlyDiagonallyDominant, type Disc, type Mat3,
} from './gershgorin';

export interface DrawOpts {
  A: Mat3;
  camYaw?: number;
  camPitch?: number;
  /** 显示列圆盘那一层 */
  showCols?: boolean;
  /** 用颜色区分连通分量 */
  showComponents?: boolean;
}

const COL = {
  bg: '#0b1020',
  grid: '#1e293b',
  axis: '#475569',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  bad: '#f87171',
  eig: '#fde047',
  row: '#38bdf8',
  col: '#a78bfa',
};

/** 连通分量配色 */
const COMP_COLORS = ['#38bdf8', '#4ade80', '#fb923c'];

export function drawGershgorin(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
}

function line3(ctx: CanvasRenderingContext2D, cam: Camera, a: Vec3, b: Vec3, col: string, w = 1): void {
  const p = project(a, cam);
  const q = project(b, cam);
  ctx.strokeStyle = col;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(q.x, q.y);
  ctx.stroke();
}

/** 在 z = zLevel 的平面上画一个以 (cx, 0) 为心的圆。 */
function disc3(
  ctx: CanvasRenderingContext2D, cam: Camera, d: Disc, zLevel: number,
  stroke: string, fill: string | null, n = 72,
): void {
  const pts: Vec3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    pts.push([d.center + d.radius * Math.cos(t), d.radius * Math.sin(t), zLevel]);
  }
  ctx.beginPath();
  pts.forEach((p, i) => {
    const s = project(p, cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // 圆心十字
  const c: Vec3 = [d.center, 0, zLevel];
  const r = Math.max(0.08, d.radius * 0.06);
  line3(ctx, cam, [c[0] - r, 0, zLevel], [c[0] + r, 0, zLevel], stroke, 1.6);
  line3(ctx, cam, [c[0], -r, zLevel], [c[0], r, zLevel], stroke, 1.6);
}

/** 复平面网格 */
function grid3(
  ctx: CanvasRenderingContext2D, cam: Camera, half: number, zLevel: number,
  step: number, xMid = 0,
): void {
  const n = Math.ceil(half / step) + 1;
  for (let i = -n; i <= n; i++) {
    const u = i * step;
    line3(ctx, cam, [u, -half, zLevel], [u, half, zLevel], COL.grid, 1);
    line3(ctx, cam, [-half, u, zLevel], [half, u, zLevel], COL.grid, 1);
  }
  /*
   * 实轴永远画(它就是 im=0 那条线)。
   * 虚轴是 re=0 那条 —— 画面已整体平移 xMid, 所以它在 x = −xMid 处;
   * 若已经移出画外就不画, 免得贴着边框误导。
   */
  line3(ctx, cam, [-half, 0, zLevel], [half, 0, zLevel], COL.axis, 1.6);
  if (Math.abs(xMid) <= half) {
    line3(ctx, cam, [-xMid, -half, zLevel], [-xMid, half, zLevel], COL.axis, 1.6);
  }
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    A,
    /*
     * ⚠️ 俯仰角要大(接近俯视)。
     * 圆盘住在复平面上, 圆就该看着像圆。pitch=0.78 时斜看过去圆全成了
     * 扁椭圆, 两层还互相压在一起, 根本分不清哪个盘在哪层 —— 截图里
     * 就是这样。抬到 1.15 接近俯视, 圆是圆, 两层靠上下错开区分。
     * yaw 也压小: 复平面的实轴该基本水平, 别斜着。
     */
    camYaw = 0.12, camPitch = 1.15,
    showCols = true, showComponents = true,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const rows = rowDiscs(A);
  const cols = colDiscs(A);
  const eigs = eigenvalues(A);
  const comps = componentCounts(A, rows);

  /*
   * 取景: 由圆盘的实际范围定, 不写死。
   * 圆盘可能远离原点(对角元大)也可能很大(非对角元大), 固定缩放必然
   * 有一头装不下。
   */
  /*
   * ⚠️ 不能只取到原点的最大距离当半径。
   * 圆盘的圆心是对角元, 常常整体偏在实轴的一侧(比如圆心 2、3、10),
   * 按 |center|+radius 对称铺开的话, 左半张画面全是空的 —— 截图里
   * 圆盘全挤在右边就是这么来的。这里改为算真实的**包围盒**,
   * 再把中心平移到画面中央。
   *
   * 原点仍要进框: 判"圆盘含不含 0"是本课的一个结论, 看不见 0 就没法看。
   */
  const xs = [
    ...rows.map((d) => d.center - d.radius),
    ...rows.map((d) => d.center + d.radius),
    ...(showCols ? cols.flatMap((d) => [d.center - d.radius, d.center + d.radius]) : []),
    ...eigs.map((z) => z.re),
    0,
  ];
  const ys = [
    ...rows.flatMap((d) => [-d.radius, d.radius]),
    ...(showCols ? cols.flatMap((d) => [-d.radius, d.radius]) : []),
    ...eigs.map((z) => z.im),
    0,
  ];
  const xMid = (Math.min(...xs) + Math.max(...xs)) / 2;
  const reach = Math.max(
    (Math.max(...xs) - Math.min(...xs)) / 2,
    (Math.max(...ys) - Math.min(...ys)) / 2,
    1,
  ) * 1.2;

  /*
   * 层间距按 reach 成比例, 不能写死。
   * reach 会随矩阵大小变(对角元 10 的矩阵 reach≈12, 几乎对角的只有 ~9),
   * 固定 2.2 的间距在大矩阵上会小到两层糊在一起。
   */
  const layer = reach * 0.42;

  const cam: Camera = makeCamera({
    yaw: camYaw, pitch: camPitch, cx: w / 2, cy: h * 0.5,
    scale: (Math.min(w, h) * 0.4) / reach,
    dist: reach * 7,
  });

  /*
   * Camera 没有世界原点偏移字段。与其在每处绘制里手动减 xMid(漏一处
   * 就错位), 不如**在数据层一次性平移**: 圆盘的圆心、特征值的实部
   * 各减 xMid, 后面所有代码照常用。网格与坐标轴另算(见下)。
   */
  const shiftDisc = (d: Disc): Disc => ({ ...d, center: d.center - xMid });
  const dRows = rows.map(shiftDisc);
  const dCols = cols.map(shiftDisc);
  const dEigs = eigs.map((z) => ({ re: z.re - xMid, im: z.im }));
  const step = Math.pow(10, Math.round(Math.log10(reach / 4)));

  // ---- 列圆盘层(下层, 先画) ----
  if (showCols) {
    grid3(ctx, cam, reach, -layer, step, xMid);
    for (const d of dCols) {
      disc3(ctx, cam, d, -layer, COL.col, 'rgba(167,139,250,0.13)');
    }
    const lp = project([-reach * 0.75, reach * 0.85, -layer], cam);
    ctx.fillStyle = COL.col;
    ctx.font = '600 13px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('列圆盘（对 Aᵀ）', lp.x, lp.y);
  }

  // ---- 行圆盘层(上层) ----
  grid3(ctx, cam, reach, 0, step, xMid);
  dRows.forEach((d) => {
    // 同一连通分量用同色, 这样"k 个盘连成一片"直接看得出来
    const ci = showComponents
      ? comps.findIndex((c) => c.indices.includes(d.index))
      : -1;
    const stroke = ci >= 0 ? COMP_COLORS[ci % COMP_COLORS.length] : COL.row;
    disc3(ctx, cam, d, 0, stroke, `${stroke}22`);
  });
  const rp = project([-reach * 0.75, reach * 0.85, 0], cam);
  ctx.fillStyle = COL.row;
  ctx.font = '600 13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('行圆盘', rp.x, rp.y);

  // ---- 特征值: 两层都画, 并用竖线连起来 ----
  for (const z of dEigs) {
    const top: Vec3 = [z.re, z.im, 0];
    if (showCols) {
      const bot: Vec3 = [z.re, z.im, -layer];
      ctx.setLineDash([3, 4]);
      line3(ctx, cam, top, bot, COL.eig, 1.2);
      ctx.setLineDash([]);
      const bs = project(bot, cam);
      ctx.fillStyle = COL.eig;
      ctx.beginPath();
      ctx.arc(bs.x, bs.y, 3.4, 0, Math.PI * 2);
      ctx.fill();
    }
    const s = project(top, cam);
    ctx.fillStyle = COL.eig;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0b1020';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    // 复特征值标出虚部
    if (Math.abs(z.im) > 1e-6) {
      ctx.fillStyle = COL.eig;
      ctx.font = '600 11.5px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      // 标签要显示**真实**特征值, 不是平移后的坐标
      const trueRe = z.re + xMid;
      ctx.fillText(`${trueRe.toFixed(2)}${z.im > 0 ? '+' : '−'}${Math.abs(z.im).toFixed(2)}i`, s.x + 8, s.y - 8);
    }
  }

  drawReadout(ctx, h, A, comps);
}

function drawReadout(
  ctx: CanvasRenderingContext2D, hCanvas: number, A: Mat3,
  comps: ReturnType<typeof componentCounts>,
): void {
  const rows = rowDiscs(A);
  const rho = spectralRadius(A);
  const bound = gershgorinBound(A);
  const dominant = isStrictlyDiagonallyDominant(A);

  const lines: Array<[string, string, 'ok' | 'bad' | undefined]> = [];
  rows.forEach((d) => {
    lines.push([`盘 ${d.index + 1}`, `圆心 ${d.center.toFixed(2)}，半径 ${d.radius.toFixed(2)}`, undefined]);
  });
  comps.forEach((c, i) => {
    lines.push([
      `分量 ${i + 1}（盘 ${c.indices.map((x) => x + 1).join(',')}）`,
      `${c.discCount} 盘 / ${c.eigCount} 值`,
      c.discCount === c.eigCount ? 'ok' : 'bad',
    ]);
  });
  lines.push(['谱半径 ρ(A)', rho.toFixed(5), undefined]);
  lines.push(['Gershgorin 上界', bound.toFixed(5), rho <= bound + 1e-9 ? 'ok' : 'bad']);
  lines.push(['估计有多松', `${(bound - rho).toFixed(4)}`, undefined]);
  lines.push([
    '严格对角占优',
    dominant ? '是 ⇒ 必可逆' : '否',
    dominant ? 'ok' : undefined,
  ]);

  const pad = 12;
  const lh = 19;
  ctx.font = '12.5px system-ui, sans-serif';
  ctx.textAlign = 'left';
  const wid = Math.max(...lines.map(([a, b]) => ctx.measureText(`${a}   ${b}`).width)) + pad * 2;
  const x0 = 14;
  const y0 = hCanvas - (lines.length * lh + pad * 2 - 6) - 14;
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x0, y0, wid, lines.length * lh + pad * 2 - 6, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textBaseline = 'middle';
  lines.forEach(([a, b, k], i) => {
    const y = y0 + pad + lh * i + 5;
    const col = k === 'ok' ? COL.ok : k === 'bad' ? COL.bad : undefined;
    ctx.textAlign = 'left';
    ctx.fillStyle = col ?? COL.dim;
    ctx.fillText(a, x0 + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = col ?? COL.text;
    ctx.fillText(b, x0 + wid - pad, y);
  });
}
