/**
 * 亏损矩阵与 Jordan 型的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 要看的东西:
 *   - **特征方向有几条**。可对角化时三条(撑满空间); 亏损时不够,
 *     画面上一眼就看得出"少了方向"。
 *   - **轨道往哪去**。反复作用 A, 一般向量的轨迹会贴向特征方向;
 *     亏损时因为只有一条方向可贴, 所有轨道都挤到同一条线上。
 *   - **Jordan 链**。广义特征向量用虚线画, 并标出 (A−λI) 把它推回
 *     链上前一个向量的那一步。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import { drawAxes3D } from '../../lib/draw3d';
import {
  analyze, identity3, isDiagonalizable, jordanChain, matSub, matVec,
  norm3, normalize, orbit, scaleMat, type Mat3,
} from './jordanForm';

export interface DrawOpts {
  A: Mat3;
  /** 轨道步数 */
  steps?: number;
  camYaw?: number;
  camPitch?: number;
  /** 画 Jordan 链(广义特征向量) */
  showChain?: boolean;
  /** 画轨道 */
  showOrbits?: boolean;
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  bad: '#f87171',
  warn: '#fbbf24',
  eig: '#4ade80',
  gen: '#f472b6',
  orbit: '#38bdf8',
  orbitEnd: '#fde047',
};

/** 起始向量: 几个不同方向, 用来看轨道往哪聚 */
const SEEDS: Vec3[] = [
  [0.6, 0.8, 0.3], [-0.5, 0.7, -0.6], [0.2, -0.9, 0.5], [-0.7, -0.3, 0.8],
];

export function drawJordanForm(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
}

function line3(ctx: CanvasRenderingContext2D, cam: Camera, a: Vec3, b: Vec3, col: string, w = 2): void {
  const p = project(a, cam);
  const q = project(b, cam);
  ctx.strokeStyle = col;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(q.x, q.y);
  ctx.stroke();
}

function dot3(ctx: CanvasRenderingContext2D, cam: Camera, p: Vec3, r: number, col: string): void {
  const s = project(p, cam);
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
  ctx.fill();
}

function arrow3(ctx: CanvasRenderingContext2D, cam: Camera, a: Vec3, b: Vec3, col: string, w = 2.4): void {
  line3(ctx, cam, a, b, col, w);
  const p = project(a, cam);
  const q = project(b, cam);
  const ang = Math.atan2(q.y - p.y, q.x - p.x);
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(q.x, q.y);
  ctx.lineTo(q.x - 9 * Math.cos(ang - 0.4), q.y - 9 * Math.sin(ang - 0.4));
  ctx.lineTo(q.x - 9 * Math.cos(ang + 0.4), q.y - 9 * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    A, steps = 10, camYaw = 0.7, camPitch = 0.36,
    showChain = true, showOrbits = true,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const info = analyze(A);
  const diagonalizable = isDiagonalizable(A);

  /*
   * 轨道会指数增长, 直接画会冲出画面几个数量级。这里把每条轨道
   * **逐点归一化到单位球面上** —— 我们关心的是"方向往哪跑", 不是
   * 长度涨多快。归一化之后, "所有轨道挤向同一条特征方向"这件事
   * 才看得见, 否则它们只是一起飞出画面。
   */
  const orbits = showOrbits
    ? SEEDS.map((s) => orbit(A, s, steps).map(normalize).filter((v) => norm3(v) > 0.5))
    : [];

  const cam: Camera = makeCamera({
    yaw: camYaw, pitch: camPitch, cx: w / 2, cy: h * 0.48,
    scale: Math.min(w, h) / 3.1, dist: 9,
  });

  drawAxes3D(ctx, cam, 1.25);

  // ---- 轨道 ----
  for (const path of orbits) {
    if (path.length < 2) continue;
    ctx.strokeStyle = COL.orbit;
    ctx.lineWidth = 1.6;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    path.forEach((p, i) => {
      const s = project(p, cam);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.stroke();
    ctx.globalAlpha = 1;
    dot3(ctx, cam, path[0], 2.6, COL.orbit);
    // 终点用亮色: 它落在哪, 就是轨道被吸引到的方向
    dot3(ctx, cam, path[path.length - 1], 4.2, COL.orbitEnd);
  }

  // ---- 特征方向(实线, 双向画) ----
  for (const e of info) {
    for (const v of e.eigenvectors) {
      arrow3(ctx, cam, [0, 0, 0], v, COL.eig, 2.8);
      line3(ctx, cam, [0, 0, 0], [-v[0], -v[1], -v[2]], COL.eig, 1.2);
      const p = project(v, cam);
      ctx.fillStyle = COL.eig;
      ctx.font = '600 12px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`λ=${e.value.toFixed(2)}`, p.x + 8, p.y - 8);
    }
  }

  // ---- Jordan 链(虚线): 广义特征向量 ----
  if (showChain) {
    for (const e of info) {
      if (!e.defective || e.eigenvectors.length === 0) continue;
      const chain = jordanChain(A, e.value, e.eigenvectors[0]);
      const M = matSub(A, scaleMat(identity3(), e.value));
      for (let k = 1; k < chain.length; k++) {
        const g = normalize(chain[k]);
        ctx.setLineDash([6, 4]);
        arrow3(ctx, cam, [0, 0, 0], g, COL.gen, 2);
        ctx.setLineDash([]);
        const p = project(g, cam);
        ctx.fillStyle = COL.gen;
        ctx.font = '600 12px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`v${k + 1}（广义）`, p.x + 8, p.y + 10);
        // (A−λI) 把 v_{k+1} 推回 v_k
        const back = normalize(matVec(M, chain[k]));
        if (norm3(back) > 0.5) {
          ctx.setLineDash([2, 3]);
          line3(ctx, cam, g, back, COL.gen, 1.2);
          ctx.setLineDash([]);
        }
      }
    }
  }

  drawReadout(ctx, w, h, A, info, diagonalizable);
}

function drawReadout(
  ctx: CanvasRenderingContext2D, w: number, hCanvas: number, A: Mat3,
  info: ReturnType<typeof analyze>, diagonalizable: boolean,
): void {
  const totalGeo = info.reduce((s, e) => s + e.geometric, 0);
  const totalAlg = info.reduce((s, e) => s + e.algebraic, 0);
  const lines: Array<[string, string, 'ok' | 'bad' | undefined]> = [];
  for (const e of info) {
    lines.push([
      `λ = ${e.value.toFixed(4)}`,
      `代数 ${e.algebraic} / 几何 ${e.geometric}`,
      e.defective ? 'bad' : 'ok',
    ]);
  }
  if (totalAlg < 3) {
    lines.push(['实特征值个数', `${totalAlg} < 3（有复根）`, 'bad']);
  }
  lines.push(['特征方向总数', `${totalGeo} / 3`, totalGeo === 3 ? 'ok' : 'bad']);
  lines.push([
    '可对角化吗',
    diagonalizable ? '可以' : totalAlg < 3 ? '实域上不可（有复根）' : '不可（亏损）',
    diagonalizable ? 'ok' : 'bad',
  ]);

  const pad = 12;
  const lh = 20;
  ctx.font = '12.5px system-ui, sans-serif';
  ctx.textAlign = 'left';
  const wid = Math.max(...lines.map(([a, b]) => ctx.measureText(`${a}   ${b}`).width)) + pad * 2;
  const x0 = 14;
  const y0 = hCanvas - (lines.length * lh + pad * 2 - 6) - 14;
  ctx.fillStyle = 'rgba(15,23,42,0.88)';
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

  // 右上角: 矩阵本身
  ctx.font = '12px ui-monospace, monospace';
  const cell = 46;
  const bx = w - cell * 3 - 22;
  ctx.fillStyle = 'rgba(15,23,42,0.85)';
  ctx.strokeStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(bx - 8, 12, cell * 3 + 16, 3 * 20 + 16, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = COL.text;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  A.forEach((row, i) => {
    row.forEach((v, j) => {
      ctx.fillText(v.toFixed(2), bx + cell * (j + 1) - 6, 12 + 8 + 20 * i + 10);
    });
  });
}
