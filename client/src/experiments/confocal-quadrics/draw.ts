/**
 * 共焦二次曲面的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d/draw3d), 不引 WebGL —— 讲解层同时
 * 有多个场景在跑, WebGL 上下文有数量上限。
 *
 * 画面构成:
 *   - 三张共焦曲面(椭球 / 单叶 / 双叶), 半透明, 各一种颜色
 *   - 交点 P
 *   - P 处三条法向量, 两两垂直 —— 这是全课的结论
 *   - 左下读数: 三个 λ、三种类型、三对法向量的夹角
 *
 * ⚠️ 半透明叠加必须**整体按深度排序**, 不能一张一张地画:
 * 三张面互相穿插, 逐张绘制会让后画的整张压在先画的上面, 看上去
 * 像三张面没有相交。故这里把三张面的四边形合并成一个列表再排序。
 */

import {
  depthSortQuads,
  makeCamera,
  project,
  shade,
  type Camera,
  type Quad,
  type Vec3,
} from '../../lib/proj3d';
import { drawAxes3D } from '../../lib/draw3d';
import {
  DEFAULT_CONFOCAL,
  DISPLAY_RADIUS,
  KIND_LABEL,
  gradient,
  insideDisplay,
  kindOf,
  norm3,
  orthogonality,
  sampleQuadric,
  solveLambdas,
  type Confocal,
  type QuadricKind,
} from './confocalQuadrics';

export interface DrawOpts {
  confocal?: Confocal;
  /** 交点 */
  point: [number, number, number];
  yaw: number;
  pitch: number;
  /** 三张面各自的显示开关, 顺序 = [椭球, 单叶, 双叶] */
  show?: [boolean, boolean, boolean];
  /** 显示三条法向量 */
  showNormals?: boolean;
  alpha?: number;
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  point: '#fde047',
};

/** 三种曲面各一个色相, 与读数、图例一致。 */
const SURF: Record<Exclude<QuadricKind, 'empty'>, { base: [number, number, number]; css: string }> = {
  ellipsoid: { base: [56, 189, 248], css: '#38bdf8' },
  hyperboloid1: { base: [251, 146, 60], css: '#fb923c' },
  hyperboloid2: { base: [167, 139, 250], css: '#a78bfa' },
};

/** 入口 */
export function drawConfocalQuadrics(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
}

/** 带类型标记的四边形, 便于合并排序后仍知道该用哪个颜色。 */
interface TaggedQuad {
  q: Quad;
  kind: Exclude<QuadricKind, 'empty'>;
}

function buildQuadsFromGrid(grid: Vec3[][]): Quad[] {
  const out: Quad[] = [];
  for (let i = 0; i + 1 < grid.length; i++) {
    for (let j = 0; j + 1 < grid[i].length; j++) {
      const a = grid[i][j];
      const b = grid[i][j + 1];
      const c = grid[i + 1][j + 1];
      const d = grid[i + 1][j];
      const center: Vec3 = [
        (a[0] + b[0] + c[0] + d[0]) / 4,
        (a[1] + b[1] + c[1] + d[1]) / 4,
        (a[2] + b[2] + c[2] + d[2]) / 4,
      ];
      const u1: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const u2: Vec3 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      const n: Vec3 = [
        u1[1] * u2[2] - u1[2] * u2[1],
        u1[2] * u2[0] - u1[0] * u2[2],
        u1[0] * u2[1] - u1[1] * u2[0],
      ];
      const len = Math.hypot(n[0], n[1], n[2]) || 1;
      out.push({
        corners: [a, b, c, d],
        center,
        normal: [n[0] / len, n[1] / len, n[2] / len],
        u: j,
        v: i,
      } as Quad);
    }
  }
  return out;
}

function rgba(base: [number, number, number], light: number, alpha: number): string {
  const k = 0.45 + 0.55 * light;
  return `rgba(${Math.round(base[0] * k)},${Math.round(base[1] * k)},${Math.round(base[2] * k)},${alpha})`;
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    confocal: q = DEFAULT_CONFOCAL,
    point, yaw, pitch,
    show = [true, true, true],
    showNormals = true,
    alpha = 0.5,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const lambdas = solveLambdas(q, point);
  // 视野按裁剪半径定: 半径改了缩放不跟着改, 曲面就会溢出画布
  const cam: Camera = makeCamera({
    yaw, pitch,
    cx: w / 2, cy: h / 2,
    scale: Math.min(w, h) / (DISPLAY_RADIUS * 2.45),
    dist: DISPLAY_RADIUS * 3.4,
  });

  drawAxes3D(ctx, cam, DISPLAY_RADIUS * 0.82);

  if (!lambdas) {
    ctx.fillStyle = COL.dim;
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('该点落在坐标平面上，三张面退化', w / 2, h / 2);
    return;
  }

  // 合并三张面的四边形再统一排序 —— 逐张画会让半透明叠加失真
  const all: TaggedQuad[] = [];
  lambdas.forEach((l, idx) => {
    if (!show[idx]) return;
    const kind = kindOf(q, l) as Exclude<QuadricKind, 'empty'>;
    for (const sheet of sampleQuadric(q, l, 52, 26)) {
      for (const quad of buildQuadsFromGrid(sheet)) {
        // 统一裁到显示球内: 双曲面无界, 不裁会把椭球整个吞掉。
        // ⚠️ 按**四个角全在球内**判定, 而不是只看中心: 只看中心时
        // 跨边界的四边形会被整块保留或整块丢掉, 边缘出现锯齿状缺口。
        if (!quad.corners.every((c) => insideDisplay(c as [number, number, number]))) continue;
        all.push({ q: quad, kind });
      }
    }
  });
  const sorted = depthSortQuads(all.map((t) => t.q), cam);
  const kindOfQuad = new Map<Quad, Exclude<QuadricKind, 'empty'>>();
  all.forEach((t) => kindOfQuad.set(t.q, t.kind));

  ctx.lineJoin = 'round';
  for (const quad of sorted) {
    const kind = kindOfQuad.get(quad);
    if (!kind) continue;
    ctx.beginPath();
    quad.corners.forEach((c, k) => {
      const p = project(c, cam);
      if (k === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = rgba(SURF[kind].base, shade(quad.normal), alpha);
    ctx.fill();
  }

  drawIntersection(ctx, cam, q, point, lambdas, showNormals);
  drawReadout(ctx, h, q, point, lambdas);
  drawLegend(ctx, w, show);
}

/** 交点 P 与它的三条法向量。三条两两垂直, 这是全课要看的东西。 */
function drawIntersection(
  ctx: CanvasRenderingContext2D, cam: Camera, q: Confocal,
  point: [number, number, number],
  lambdas: [number, number, number], showNormals: boolean,
): void {
  if (showNormals) {
    const LEN = 1.5;
    lambdas.forEach((l) => {
      const g = gradient(q, point, l);
      const n = norm3(g) || 1;
      const tip: Vec3 = [
        point[0] + (g[0] / n) * LEN,
        point[1] + (g[1] / n) * LEN,
        point[2] + (g[2] / n) * LEN,
      ];
      const a = project(point as Vec3, cam);
      const b = project(tip, cam);
      const kind = kindOf(q, l) as Exclude<QuadricKind, 'empty'>;
      ctx.strokeStyle = SURF[kind].css;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      // 箭头
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      ctx.fillStyle = SURF[kind].css;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - 9 * Math.cos(ang - 0.4), b.y - 9 * Math.sin(ang - 0.4));
      ctx.lineTo(b.x - 9 * Math.cos(ang + 0.4), b.y - 9 * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fill();
    });
  }

  const p = project(point as Vec3, cam);
  ctx.fillStyle = COL.point;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0b1020';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = COL.point;
  ctx.font = '600 14px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', p.x + 10, p.y - 12);
}

/** 左下读数: 三个 λ、类型、三对法向量夹角。 */
function drawReadout(
  ctx: CanvasRenderingContext2D, hCanvas: number, q: Confocal,
  point: [number, number, number], lambdas: [number, number, number],
): void {
  const o = orthogonality(q, point);
  const lines: Array<[string, string, boolean?]> = [
    ['P', `(${point.map((v) => v.toFixed(2)).join(', ')})`],
  ];
  lambdas.forEach((l, i) => {
    const kind = kindOf(q, l) as Exclude<QuadricKind, 'empty'>;
    lines.push([`λ${'₁₂₃'[i]} = ${l.toFixed(5)}`, KIND_LABEL[kind]]);
  });
  if (o) {
    const names = ['①②', '①③', '②③'];
    o.pairs.forEach((pr, i) => {
      const d = ((Math.PI / 2 - pr.angleDev) * 180) / Math.PI;
      lines.push([`法向量 ${names[i]} 夹角`, `${d.toFixed(6)}°`, true]);
    });
  }

  const pad = 12;
  const lh = 20;
  ctx.font = '12.5px system-ui, sans-serif';
  const wid = Math.max(...lines.map(([a, b]) => ctx.measureText(`${a}   ${b}`).width)) + pad * 2;
  const x0 = 14;
  const y0 = hCanvas - (lines.length * lh + pad * 2 - 6) - 14;
  ctx.fillStyle = 'rgba(15,23,42,0.86)';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x0, y0, wid, lines.length * lh + pad * 2 - 6, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textBaseline = 'middle';
  lines.forEach(([a, b, key], i) => {
    const y = y0 + pad + lh * i + 6;
    ctx.textAlign = 'left';
    ctx.fillStyle = key ? COL.ok : COL.dim;
    ctx.fillText(a, x0 + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = key ? COL.ok : COL.text;
    ctx.fillText(b, x0 + wid - pad, y);
  });
}

/** 右上图例: 颜色对应哪种曲面。 */
function drawLegend(
  ctx: CanvasRenderingContext2D, w: number, show: [boolean, boolean, boolean],
): void {
  const items: Array<[Exclude<QuadricKind, 'empty'>, string]> = [
    ['ellipsoid', '椭球面 λ₁'],
    ['hyperboloid1', '单叶双曲面 λ₂'],
    ['hyperboloid2', '双叶双曲面 λ₃'],
  ];
  ctx.font = '12.5px system-ui, sans-serif';
  const wid = Math.max(...items.map(([, t]) => ctx.measureText(t).width)) + 44;
  const x0 = w - wid - 14;
  const y0 = 14;
  ctx.fillStyle = 'rgba(15,23,42,0.86)';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x0, y0, wid, items.length * 22 + 16, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  items.forEach(([kind, text], i) => {
    const y = y0 + 8 + 22 * i + 11;
    ctx.globalAlpha = show[i] ? 1 : 0.32;
    ctx.fillStyle = SURF[kind].css;
    ctx.beginPath();
    ctx.roundRect(x0 + 12, y - 5, 16, 10, 3);
    ctx.fill();
    ctx.fillStyle = COL.text;
    ctx.fillText(text, x0 + 34, y);
    ctx.globalAlpha = 1;
  });
}
