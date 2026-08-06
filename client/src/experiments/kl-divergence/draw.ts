/**
 * KL 散度的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 为什么用 3D: 固定 p, 让 q 跑遍单纯形, D(p‖q) 是单纯形上的一个
 * 高度场。它在 q=p 处**唯一**触底(Gibbs 不等式的几何形态), 向边界
 * 急升到无穷。把 D(p‖q) 与 D(q‖p) 两张曲面并排, 不对称性就是两张面
 * 形状的差异 —— 一张在边界急升、另一张平缓, 一眼可辨。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import {
  asymmetry, crossEntropy, entropy, jensenShannon, klDivergence,
  sampleField, totalVariation, type Dist, type FieldKind,
} from './klDivergence';

export interface DrawOpts {
  p: Dist;
  q: Dist;
  camYaw?: number;
  camPitch?: number;
  /** 显示哪些高度场 [D(p‖q), D(q‖p), JS] */
  show?: [boolean, boolean, boolean];
  res?: number;
  /** 截断高度 */
  cap?: number;
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  warn: '#fbbf24',
  bad: '#f87171',
  grid: '#334155',
  vertex: '#64748b',
  pq: '#38bdf8',
  qp: '#f472b6',
  js: '#4ade80',
  pMark: '#fde047',
  qMark: '#fb923c',
};

const KINDS: Array<{ kind: FieldKind; col: string; name: string }> = [
  { kind: 'kl-pq', col: COL.pq, name: 'D(p‖q)' },
  { kind: 'kl-qp', col: COL.qp, name: 'D(q‖p)' },
  { kind: 'js', col: COL.js, name: 'JS 散度' },
];

/*
 * ⚠️ 竖向比例要压得住 cap=4 的墙。
 * 原来 0.38 时 D(p‖q) 那面墙(截断高度 4)在画布上高达 1.52 个单位,
 * 直接顶出画面上沿、还把底面三角形遮住 —— 截图里就是这样。
 * 0.2 时墙高约 0.8, 与三角形半径(1)相当, 既看得见形状又不挡底面。
 */
const Z_SCALE = 0.2;

export function drawKLDivergence(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
}

/** 单纯形铺成等边三角形, 高度轴竖直。 */
function toXYZ(p: Dist, height: number): Vec3 {
  const V: Array<[number, number]> = [
    [0, 1], [-Math.sqrt(3) / 2, -0.5], [Math.sqrt(3) / 2, -0.5],
  ];
  const x = p[0] * V[0][0] + p[1] * V[1][0] + p[2] * V[2][0];
  const y = p[0] * V[0][1] + p[1] * V[1][1] + p[2] * V[2][1];
  return [x, y, height * Z_SCALE];
}

function line3(ctx: CanvasRenderingContext2D, cam: Camera, a: Vec3, b: Vec3, col: string, w = 1): void {
  const s = project(a, cam);
  const t = project(b, cam);
  ctx.strokeStyle = col;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(s.x, s.y);
  ctx.lineTo(t.x, t.y);
  ctx.stroke();
}

function label3(
  ctx: CanvasRenderingContext2D, cam: Camera, p: Vec3, text: string, col: string,
  dx = 8, dy = -8,
): void {
  const s = project(p, cam);
  ctx.fillStyle = col;
  ctx.font = '600 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, s.x + dx, s.y + dy);
}

function drawBase(ctx: CanvasRenderingContext2D, cam: Camera): void {
  const V: Dist[] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  ctx.beginPath();
  V.forEach((v, i) => {
    const s = project(toXYZ(v, 0), cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(51,65,85,0.3)';
  ctx.fill();
  ctx.strokeStyle = COL.grid;
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.globalAlpha = 0.5;
  for (let i = 1; i < 6; i++) {
    const t = i / 6;
    for (const [a, b, c] of [[0, 1, 2], [1, 2, 0], [2, 0, 1]]) {
      const p1: Dist = [0, 0, 0];
      const p2: Dist = [0, 0, 0];
      p1[a] = t; p1[b] = 1 - t;
      p2[a] = t; p2[c] = 1 - t;
      line3(ctx, cam, toXYZ(p1, 0), toXYZ(p2, 0), COL.grid, 0.6);
    }
  }
  ctx.globalAlpha = 1;
  const names = ['q₁=1', 'q₂=1', 'q₃=1'];
  V.forEach((v, i) => label3(ctx, cam, toXYZ(v, 0), names[i], COL.vertex, 6, 9));
}

/** 收集一张高度场的四边形(带深度), 交给调用方统一排序。 */
function collectQuads(
  p: Dist, kind: FieldKind, res: number, cap: number, cam: Camera,
): Array<{ pts: Vec3[]; depth: number; clipped: boolean }> {
  const g = sampleField(p, kind, res, cap);
  const out: Array<{ pts: Vec3[]; depth: number; clipped: boolean }> = [];
  const cell = 2.2 / res;
  for (let i = 0; i + 1 < g.length; i++) {
    for (let j = 0; j + 1 < g[i].length; j++) {
      const cs = [g[i][j], g[i + 1][j], g[i + 1][j + 1], g[i][j + 1]];
      const pts = cs.map((c) => toXYZ(c.q, c.value));
      // 折叠网格的接缝: 底面边长明显超过一格的丢掉(与熵那课同法)
      let seam = false;
      for (let k = 0; k < 4; k++) {
        const a = pts[k];
        const b = pts[(k + 1) % 4];
        if (Math.hypot(a[0] - b[0], a[1] - b[1]) > cell * 2.5) seam = true;
      }
      if (seam) continue;
      const depth = pts.reduce((s, v) => s + project(v, cam).depth, 0) / 4;
      out.push({ pts, depth, clipped: cs.some((c) => c.clipped) });
    }
  }
  return out;
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    p, q, camYaw = 0.7, camPitch = 0.42,
    show = [true, false, false], res = 26, cap = 4,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const cam: Camera = makeCamera({
    yaw: camYaw, pitch: camPitch, cx: w * 0.5, cy: h * 0.56,
    scale: Math.min(w, h) * 0.36, dist: 8,
  });

  drawBase(ctx, cam);

  // 三张面合并后统一深度排序
  const all: Array<{ pts: Vec3[]; depth: number; col: string; clipped: boolean }> = [];
  KINDS.forEach((K, idx) => {
    if (!show[idx]) return;
    for (const quad of collectQuads(p, K.kind, res, cap, cam)) {
      all.push({ ...quad, col: K.col });
    }
  });
  all.sort((a, b) => b.depth - a.depth);
  ctx.lineWidth = 0.4;
  for (const quad of all) {
    /*
     * 被截断的格子画得更透明并且不描边 —— 提示"这里其实是无穷大,
     * 图上只是被压到了 cap"。不这么区分的话, 边界会看着像一堵
     * 有限高的墙, 而它实际上是发散的。
     */
    ctx.globalAlpha = quad.clipped ? 0.16 : 0.46;
    ctx.fillStyle = quad.col;
    ctx.strokeStyle = quad.col;
    ctx.beginPath();
    quad.pts.forEach((pt, k) => {
      const s = project(pt, cam);
      if (k === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.closePath();
    ctx.fill();
    if (!quad.clipped) ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // p 的位置: 高度场的唯一零点
  const pBase = toXYZ(p, 0);
  const ps = project(pBase, cam);
  ctx.fillStyle = COL.pMark;
  ctx.beginPath();
  ctx.arc(ps.x, ps.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COL.bg;
  ctx.lineWidth = 1.6;
  ctx.stroke();
  label3(ctx, cam, pBase, 'p（唯一零点）', COL.pMark, 9, 10);

  // 当前 q 的位置与两个方向的高度
  const qBase = toXYZ(q, 0);
  const dpq = klDivergence(p, q);
  const dqp = klDivergence(q, p);
  ctx.setLineDash([3, 3]);
  line3(ctx, cam, qBase, toXYZ(q, Math.min(cap, Math.max(
    Number.isFinite(dpq) ? dpq : cap, Number.isFinite(dqp) ? dqp : cap,
  ))), COL.qMark, 1.4);
  ctx.setLineDash([]);
  const qs = project(qBase, cam);
  ctx.fillStyle = COL.qMark;
  ctx.beginPath();
  ctx.arc(qs.x, qs.y, 5, 0, Math.PI * 2);
  ctx.fill();
  label3(ctx, cam, qBase, 'q', COL.qMark, 9, 10);

  const marks: Array<[number, string, string, boolean]> = [
    [dpq, COL.pq, 'D(p‖q)', show[0]],
    [dqp, COL.qp, 'D(q‖p)', show[1]],
  ];
  for (const [v, col, name, on] of marks) {
    if (!on) continue;
    const hv = Number.isFinite(v) ? Math.min(v, cap) : cap;
    const s = project(toXYZ(q, hv), cam);
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COL.bg;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    label3(
      ctx, cam, toXYZ(q, hv),
      `${name}=${Number.isFinite(v) ? v.toFixed(3) : '∞'}`,
      col, 9, name === 'D(p‖q)' ? -9 : 9,
    );
  }

  drawReadout(ctx, w, h, p, q, show, cap);
}

function drawReadout(
  ctx: CanvasRenderingContext2D, w: number, hCanvas: number,
  p: Dist, q: Dist, show: [boolean, boolean, boolean], cap: number,
): void {
  const dpq = klDivergence(p, q);
  const dqp = klDivergence(q, p);
  const ce = crossEntropy(p, q);
  const f = (v: number) => (Number.isFinite(v) ? v.toFixed(5) : '∞');
  const asym = asymmetry(p, q);

  const lines: Array<[string, string, 'ok' | 'warn' | 'bad' | undefined]> = [
    ['H(p)', entropy(p).toFixed(5), undefined],
    ['D(p‖q)', f(dpq), Number.isFinite(dpq) ? undefined : 'bad'],
    ['D(q‖p)', f(dqp), Number.isFinite(dqp) ? undefined : 'bad'],
    ['不对称 |差|', Number.isFinite(asym) ? asym.toFixed(5) : '∞', asym > 0.1 ? 'warn' : undefined],
    ['交叉熵 H(p,q)', f(ce), undefined],
    ['= H(p) + D(p‖q)?', Number.isFinite(ce) ? '成立' : '两边都是 ∞', 'ok'],
    ['JS 散度（对称）', jensenShannon(p, q).toFixed(5), 'ok'],
    ['总变差 TV', totalVariation(p, q).toFixed(5), undefined],
  ];

  const pad = 12;
  const lh = 19;
  ctx.font = '12.5px system-ui, sans-serif';
  ctx.textAlign = 'left';
  const wid = Math.max(...lines.map(([a, v]) => ctx.measureText(`${a}   ${v}`).width)) + pad * 2;
  const px = 14;
  const py = hCanvas - (lines.length * lh + pad * 2 - 6) - 14;
  ctx.fillStyle = 'rgba(15,23,42,0.9)';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(px, py, wid, lines.length * lh + pad * 2 - 6, 8);
  ctx.fill();
  ctx.stroke();
  ctx.textBaseline = 'middle';
  lines.forEach(([a, v, k], i) => {
    const y = py + pad + lh * i + 5;
    const col = k === 'ok' ? COL.ok : k === 'warn' ? COL.warn : k === 'bad' ? COL.bad : undefined;
    ctx.textAlign = 'left';
    ctx.fillStyle = col ?? COL.dim;
    ctx.fillText(a, px + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = col ?? COL.text;
    ctx.fillText(v, px + wid - pad, y);
  });

  // 图例 + 截断说明
  ctx.font = '12.5px system-ui, sans-serif';
  const lw = Math.max(...KINDS.map((K) => ctx.measureText(K.name).width)) + 46;
  const lx = w - lw - 14;
  ctx.fillStyle = 'rgba(15,23,42,0.86)';
  ctx.strokeStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(lx, 14, lw, KINDS.length * 22 + 32, 8);
  ctx.fill();
  ctx.stroke();
  KINDS.forEach((K, i) => {
    const y = 14 + 8 + 22 * i + 11;
    ctx.globalAlpha = show[i] ? 1 : 0.3;
    ctx.fillStyle = K.col;
    ctx.beginPath();
    ctx.roundRect(lx + 12, y - 5, 16, 10, 3);
    ctx.fill();
    ctx.fillStyle = COL.text;
    ctx.textAlign = 'left';
    ctx.fillText(K.name, lx + 34, y);
    ctx.globalAlpha = 1;
  });
  ctx.fillStyle = COL.dim;
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText(`淡色处 = 截到 ${cap}（实为 ∞）`, lx + 12, 14 + 8 + 22 * KINDS.length + 8);
}
