/**
 * Perron-Frobenius 的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 为什么用 3D: 三状态的概率分布住在**单纯形**上(x+y+z=1 的三角形),
 * 它是三维空间里的一张斜面。迭代轨迹在这张面上爬行, 收敛就是爬向
 * 一个点、周期就是绕着三个顶点转圈 —— 这两件事在斜面上一眼可辨,
 * 压成二维反而看不清"三个顶点是对称的"。
 *
 * 左: 单纯形与迭代轨迹(多条不同初值)。
 * 右: 复平面上的特征值与单位圆。谱隙 = 最外圈到次外圈的距离。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import {
  cAbs, classify, eigenvaluesByModulus, iterate, perronVector,
  type Mat3,
} from './perronFrobenius';

export interface DrawOpts {
  A: Mat3;
  /** 迭代步数 */
  steps?: number;
  camYaw?: number;
  camPitch?: number;
  /** 只画左/右/两张 */
  panel?: 'both' | 'simplex' | 'spectrum';
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  bad: '#f87171',
  warn: '#fbbf24',
  simplex: '#334155',
  vertex: '#64748b',
  unitCircle: '#475569',
  fixed: '#fde047',
};

/** 三条轨迹的配色, 对应三个不同初值 */
const PATHS = ['#38bdf8', '#f472b6', '#4ade80'];
const STARTS: Vec3[] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

export function drawPerronFrobenius(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
}

function line3(ctx: CanvasRenderingContext2D, cam: Camera, a: Vec3, b: Vec3, col: string, w = 1.5): void {
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

/** 一条迭代轨迹, 点越走越密说明在收敛。 */
function drawPath(
  ctx: CanvasRenderingContext2D, cam: Camera, path: Vec3[], col: string,
): void {
  if (path.length < 2) return;
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.8;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  path.forEach((p, i) => {
    const s = project(p, cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.stroke();
  ctx.globalAlpha = 1;
  // 起点空心、终点实心
  const s0 = project(path[0], cam);
  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(s0.x, s0.y, 4, 0, Math.PI * 2);
  ctx.stroke();
  dot3(ctx, cam, path[path.length - 1], 5, col);
}

/** 复平面上画特征值与单位圆(在 z=0 平面上)。 */
function drawSpectrum(
  ctx: CanvasRenderingContext2D, cam: Camera, A: Mat3,
): void {
  // 单位圆
  ctx.strokeStyle = COL.unitCircle;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  for (let i = 0; i <= 96; i++) {
    const t = (i / 96) * Math.PI * 2;
    const s = project([Math.cos(t), Math.sin(t), 0], cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // 坐标轴
  line3(ctx, cam, [-1.3, 0, 0], [1.3, 0, 0], COL.unitCircle, 1.2);
  line3(ctx, cam, [0, -1.3, 0], [0, 1.3, 0], COL.unitCircle, 1.2);

  const ev = eigenvaluesByModulus(A);
  const m1 = cAbs(ev[0]);
  const m2 = cAbs(ev[1]);
  // 次大模的圆: 谱隙就是这两个圆之间的距离
  if (m2 > 1e-9) {
    ctx.strokeStyle = COL.warn;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 96; i++) {
      const t = (i / 96) * Math.PI * 2;
      const s = project([m2 * Math.cos(t), m2 * Math.sin(t), 0], cam);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ev.forEach((z, i) => {
    const p: Vec3 = [z.re, z.im, 0];
    const isPerron = i === 0 && Math.abs(z.im) < 1e-9;
    const col = isPerron ? COL.fixed : Math.abs(cAbs(z) - m1) < 1e-9 ? COL.bad : COL.dim;
    dot3(ctx, cam, p, isPerron ? 6 : 4.5, col);
    if (isPerron) label3(ctx, cam, p, 'Perron 根 r', col, 8, -9);
    else if (Math.abs(z.im) > 1e-8) {
      label3(ctx, cam, p, `${z.re.toFixed(2)}${z.im > 0 ? '+' : '−'}${Math.abs(z.im).toFixed(2)}i`, col, 8, -8);
    }
  });
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const { A, steps = 24, camYaw = 0.78, camPitch = 0.62, panel = 'both' } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const showS = panel === 'both' || panel === 'simplex';
  const showE = panel === 'both' || panel === 'spectrum';
  const single = panel !== 'both';

  if (showS) {
    /*
     * 单纯形的三个顶点是 e₁,e₂,e₃, 到原点距离都是 1, 但三角形本身
     * 的"重心"在 (1/3,1/3,1/3)。相机对着重心看才不会偏。
     * 这里靠把点整体减去重心来居中(Camera 没有世界偏移字段)。
     */
    const c: Vec3 = [1 / 3, 1 / 3, 1 / 3];
    const cam = makeCamera({
      yaw: camYaw, pitch: camPitch,
      cx: single ? w / 2 : w * 0.28, cy: h * 0.5,
      scale: (Math.min(single ? w : w / 2, h) * 0.62),
      dist: 7,
    });
    // 平移到重心为原点
    const shift = (p: Vec3): Vec3 => [p[0] - c[0], p[1] - c[1], p[2] - c[2]];
    const camS = cam;
    const drawShifted = {
      simplex: () => {
        const V: Vec3[] = ([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Vec3[]).map(shift);
        ctx.beginPath();
        V.forEach((v, i) => {
          const s = project(v, camS);
          if (i === 0) ctx.moveTo(s.x, s.y);
          else ctx.lineTo(s.x, s.y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(51,65,85,0.35)';
        ctx.fill();
        ctx.strokeStyle = COL.simplex;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        const names = ['e₁', 'e₂', 'e₃'];
        V.forEach((v, i) => {
          dot3(ctx, camS, v, 3.5, COL.vertex);
          label3(ctx, camS, v, names[i], COL.vertex, 7, -7);
        });
        // 网格
        ctx.globalAlpha = 0.6;
        for (let i = 1; i < 5; i++) {
          const t = i / 5;
          for (const [a, b, cc] of [[0, 1, 2], [1, 2, 0], [2, 0, 1]]) {
            const p1: Vec3 = [0, 0, 0];
            const p2: Vec3 = [0, 0, 0];
            p1[a] = t; p1[b] = 1 - t;
            p2[a] = t; p2[cc] = 1 - t;
            line3(ctx, camS, shift(p1), shift(p2), COL.simplex, 0.6);
          }
        }
        ctx.globalAlpha = 1;
      },
    };
    drawShifted.simplex();

    /*
     * ⚠️ 三条轨迹要各自往重心方向缩一点再画。
     * 周期矩阵的轨迹**精确地**落在三个顶点上、沿三角形的边跳,
     * 直接画会与单纯形的外框重合, 三条还互相盖住 —— 截图里左边看着
     * 就是一个空三角形, 一条轨迹都看不见。按 i 取不同的缩进量,
     * 三条各走各的同心三角, 周期性才显出来。
     * 这只是**显示上的**内缩, 读数用的仍是未缩的真实轨迹。
     */
    const inset = (p: Vec3, k: number): Vec3 => [
      p[0] + (1 / 3 - p[0]) * k,
      p[1] + (1 / 3 - p[1]) * k,
      p[2] + (1 / 3 - p[2]) * k,
    ];
    STARTS.forEach((v0, i) => {
      const k = 0.06 + i * 0.07;
      drawPath(
        ctx, camS,
        iterate(A, v0, steps).map((p) => shift(inset(p, k))),
        PATHS[i],
      );
    });
    // 稳态(若存在)
    const pv = perronVector(A);
    if (pv.converged) {
      dot3(ctx, camS, shift(pv.vector), 6.5, COL.fixed);
      label3(ctx, camS, shift(pv.vector), '稳态', COL.fixed, 9, 10);
    }

    ctx.fillStyle = COL.dim;
    ctx.font = '600 13.5px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('概率单纯形上的迭代', single ? w / 2 : w * 0.28, 14);
  }

  if (showE) {
    const cam = makeCamera({
      yaw: 0.06, pitch: 1.35,
      cx: single ? w / 2 : w * 0.74, cy: h * 0.5,
      scale: (Math.min(single ? w : w / 2, h) * 0.34),
      dist: 9,
    });
    drawSpectrum(ctx, cam, A);
    ctx.fillStyle = COL.dim;
    ctx.font = '600 13.5px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('复平面上的特征值', single ? w / 2 : w * 0.74, 14);
  }

  drawReadout(ctx, h, A);
}

function drawReadout(ctx: CanvasRenderingContext2D, hCanvas: number, A: Mat3): void {
  const c = classify(A);
  const ev = eigenvaluesByModulus(A);
  const lines: Array<[string, string, 'ok' | 'bad' | undefined]> = [
    ['不可约（强连通）', c.irreducible ? '是' : '否', c.irreducible ? 'ok' : 'bad'],
    ['本原（某幂全正）', c.primitive ? `是（A^${c.primitiveAt}）` : '否', c.primitive ? 'ok' : 'bad'],
    ['|λ|', ev.map((z) => cAbs(z).toFixed(4)).join(', '), undefined],
    ['谱隙 |λ₁|−|λ₂|', c.gap.toFixed(6), c.gap > 1e-8 ? 'ok' : 'bad'],
    ['收敛率 |λ₂|/|λ₁|', c.rate.toFixed(6), c.rate < 1 - 1e-8 ? 'ok' : 'bad'],
    ['稳态唯一', c.unique ? '是' : '否', c.unique ? 'ok' : 'bad'],
    ['结论', c.verdict, c.primitive ? 'ok' : 'bad'],
  ];

  const pad = 12;
  const lh = 20;
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
    const col = k === 'ok' ? COL.ok : k === 'bad' ? COL.bad : undefined;
    ctx.textAlign = 'left';
    ctx.fillStyle = col ?? COL.dim;
    ctx.fillText(a, px + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = col ?? COL.text;
    ctx.fillText(v, px + wid - pad, y);
  });
}
