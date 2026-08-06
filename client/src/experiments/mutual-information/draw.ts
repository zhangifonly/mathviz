/**
 * 互信息与信道容量的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 为什么用 3D: I(X;Y) 是 (输入分布 a, 噪声 e) 两个变量的函数。
 * 沿 a 方向有个**峰**(峰顶就是容量), 沿 e 方向**单调衰减到 0** ——
 * 两种完全不同的形状。容量曲线就是这张曲面沿 a 方向的脊线,
 * 二维图只能固定一个变量, 画不出"脊"这个概念。
 *
 * 画面元素:
 *   - I(a,e) 曲面
 *   - 红色脊线: 每个 e 处的容量, 即 max_a I
 *   - 当前 (a,e) 的位置与高度
 *   - 底面网格与坐标标注
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import {
  channelCapacity, channelMI, entropy, jointEntropy, makeJoint,
  marginalX, marginalY, mutualInformation, sampleSurface,
  type ChannelKind,
} from './mutualInformation';

export interface DrawOpts {
  kind: ChannelKind;
  /** 当前输入分布参数 */
  a: number;
  /** 当前噪声 */
  e: number;
  camYaw?: number;
  camPitch?: number;
  /** 画容量脊线 */
  showRidge?: boolean;
  res?: number;
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  warn: '#fbbf24',
  bad: '#f87171',
  grid: '#334155',
  axis: '#475569',
  surface: '#38bdf8',
  ridge: '#f87171',
  marker: '#fde047',
};

const KIND_NAME: Record<ChannelKind, string> = {
  bsc: '二元对称信道 BSC',
  bec: '二元擦除信道 BEC',
  z: 'Z 信道（不对称）',
};

export function drawMutualInformation(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
}

/** (a, e, I) → 绘图坐标。a、e 各铺到 [−1,1], I 竖直。 */
function toXYZ(a: number, e: number, I: number): Vec3 {
  return [a * 2 - 1, e * 2 - 1, I * 0.9];
}

function line3(ctx: CanvasRenderingContext2D, cam: Camera, p: Vec3, q: Vec3, col: string, w = 1): void {
  const s = project(p, cam);
  const t = project(q, cam);
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

function drawFrame(ctx: CanvasRenderingContext2D, cam: Camera): void {
  for (let i = 0; i <= 5; i++) {
    const u = -1 + (2 * i) / 5;
    line3(ctx, cam, [u, -1, 0], [u, 1, 0], COL.grid, 0.7);
    line3(ctx, cam, [-1, u, 0], [1, u, 0], COL.grid, 0.7);
  }
  // 竖向标尺
  for (let k = 0; k <= 4; k++) {
    const z = (k / 4) * 0.9;
    line3(ctx, cam, [-1, -1, z], [1, -1, z], COL.grid, 0.5);
    const s = project([-1, -1, z] as Vec3, cam);
    ctx.fillStyle = COL.dim;
    ctx.font = '10.5px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText((k / 4).toFixed(2), s.x - 6, s.y);
  }
  label3(ctx, cam, [1, -1, 0], 'a → 1', COL.dim, 8, 10);
  label3(ctx, cam, [-1, 1, 0], 'e → 1', COL.dim, -6, 12);
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    kind, a, e, camYaw = 0.76, camPitch = 0.42,
    showRidge = true, res = 30,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const cam: Camera = makeCamera({
    yaw: camYaw, pitch: camPitch, cx: w * 0.5, cy: h * 0.54,
    scale: Math.min(w, h) * 0.34, dist: 9,
  });

  drawFrame(ctx, cam);

  // ---- I(a,e) 曲面, 按深度排序 ----
  const g = sampleSurface(kind, res, res);
  const quads: Array<{ pts: Vec3[]; depth: number; hi: number }> = [];
  for (let i = 0; i + 1 < g.length; i++) {
    for (let j = 0; j + 1 < g[i].length; j++) {
      const pts: Vec3[] = [
        toXYZ(i / res, j / res, g[i][j]),
        toXYZ((i + 1) / res, j / res, g[i + 1][j]),
        toXYZ((i + 1) / res, (j + 1) / res, g[i + 1][j + 1]),
        toXYZ(i / res, (j + 1) / res, g[i][j + 1]),
      ];
      const depth = pts.reduce((s, p) => s + project(p, cam).depth, 0) / 4;
      const hi = (g[i][j] + g[i + 1][j] + g[i + 1][j + 1] + g[i][j + 1]) / 4;
      quads.push({ pts, depth, hi });
    }
  }
  quads.sort((x, y) => y.depth - x.depth);
  for (const q of quads) {
    // 高处更亮: 让"峰"与"谷"的对比更明显
    const t = Math.max(0, Math.min(1, q.hi));
    ctx.globalAlpha = 0.32 + 0.38 * t;
    ctx.fillStyle = COL.surface;
    ctx.strokeStyle = COL.surface;
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    q.pts.forEach((p, k) => {
      const s = project(p, cam);
      if (k === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // ---- 容量脊线: 每个 e 处 max_a I ----
  if (showRidge) {
    ctx.strokeStyle = COL.ridge;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    for (let j = 0; j <= 40; j++) {
      const ee = j / 40;
      const c = channelCapacity(ee, kind, 120);
      const s = project(toXYZ(c.aStar, ee, c.capacity), cam);
      if (j === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    }
    ctx.stroke();
    const c0 = channelCapacity(0.08, kind, 120);
    label3(ctx, cam, toXYZ(c0.aStar, 0.08, c0.capacity), '容量脊线 C(e)', COL.ridge, 9, -9);
  }

  // ---- 当前点 ----
  const I = channelMI(a, e, kind);
  const base = toXYZ(a, e, 0);
  const top = toXYZ(a, e, I);
  ctx.setLineDash([3, 3]);
  line3(ctx, cam, base, top, COL.marker, 1.4);
  ctx.setLineDash([]);
  const ts = project(top, cam);
  ctx.fillStyle = COL.marker;
  ctx.beginPath();
  ctx.arc(ts.x, ts.y, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COL.bg;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  label3(ctx, cam, top, `I = ${I.toFixed(4)}`, COL.marker, 9, -9);

  ctx.fillStyle = COL.dim;
  ctx.font = '600 13.5px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(KIND_NAME[kind], w / 2, 14);

  drawReadout(ctx, h, kind, a, e);
}

function drawReadout(
  ctx: CanvasRenderingContext2D, hCanvas: number,
  kind: ChannelKind, a: number, e: number,
): void {
  const J = makeJoint(a, e, kind);
  const I = mutualInformation(J);
  const cap = channelCapacity(e, kind);
  const atCapacity = Math.abs(I - cap.capacity) < 1e-6;

  const lines: Array<[string, string, 'ok' | 'warn' | undefined]> = [
    ['H(X)', entropy(marginalX(J)).toFixed(5), undefined],
    ['H(Y)', entropy(marginalY(J)).toFixed(5), undefined],
    ['H(X,Y)', jointEntropy(J).toFixed(5), undefined],
    ['I(X;Y)', I.toFixed(5), 'ok'],
    ['= H(X)+H(Y)−H(X,Y)', '成立', 'ok'],
    ['信道容量 C', cap.capacity.toFixed(5), undefined],
    ['最优输入 a*', cap.capacity < 1e-12 ? '（无意义，C=0）' : cap.aStar.toFixed(4), undefined],
    ['当前是否达到容量', atCapacity ? '是' : `差 ${(cap.capacity - I).toFixed(4)}`, atCapacity ? 'ok' : 'warn'],
  ];

  const pad = 12;
  const lh = 19;
  ctx.font = '12.5px system-ui, sans-serif';
  ctx.textAlign = 'left';
  const wid = Math.max(...lines.map(([x, v]) => ctx.measureText(`${x}   ${v}`).width)) + pad * 2;
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
  lines.forEach(([x, v, k], i) => {
    const y = py + pad + lh * i + 5;
    const col = k === 'ok' ? COL.ok : k === 'warn' ? COL.warn : undefined;
    ctx.textAlign = 'left';
    ctx.fillStyle = col ?? COL.dim;
    ctx.fillText(x, px + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = col ?? COL.text;
    ctx.fillText(v, px + wid - pad, y);
  });
}
