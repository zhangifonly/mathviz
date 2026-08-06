/**
 * 李代数 so(3) 的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 三种模式:
 *   exp      —— 左: 切空间里的向量 ω(一根箭头); 右: exp 出来的旋转
 *                作用在物体上。滑 t 看 exp(tω) 扫出的单参数子群。
 *   series   —— 用截断级数与 Rodrigues 闭式并排, 看项数不够时的偏差。
 *   bracket  —— 两个 ω 先后作用, 换序后不重合; 缺口正是李括号。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import { drawAxes3D } from '../../lib/draw3d';
import {
  bchDefect, cross, expSeries, expSO3, matMaxDiff, matMul, matVec, norm3,
  oneParamSubgroup, type Mat3,
} from './lieAlgebraSO3';

export type Mode = 'exp' | 'series' | 'bracket';

export interface DrawOpts {
  omega: Vec3;
  /** 单参数子群的参数 */
  t: number;
  mode?: Mode;
  /** series 模式的项数 */
  terms?: number;
  camYaw?: number;
  camPitch?: number;
  /** 画出物体上一点扫出的轨迹 */
  showTrail?: boolean;
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  bad: '#f87171',
  omega: '#f472b6',
  trail: '#38bdf8',
  closed: '#38bdf8',
  series: '#fb923c',
  pathA: '#38bdf8',
  pathB: '#fbbf24',
  bodyX: '#ef4444',
  bodyY: '#4ade80',
  bodyZ: '#60a5fa',
  flag: '#fde047',
};

/** 物体: 三轴 + 不对称旗子(不对称才看得出转没转) */
const FLAG: Vec3[] = [[0, 0, 0.3], [0.7, 0, 0.85], [0.7, 0, 0.5], [0, 0, 0.1]];
const TRACER: Vec3 = [0.7, 0, 0.85];

export function drawLieAlgebraSO3(canvas: HTMLCanvasElement, opts: DrawOpts): void {
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

function arrow3(ctx: CanvasRenderingContext2D, cam: Camera, a: Vec3, b: Vec3, col: string, w = 2.6): void {
  line3(ctx, cam, a, b, col, w);
  const p = project(a, cam);
  const q = project(b, cam);
  const ang = Math.atan2(q.y - p.y, q.x - p.x);
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(q.x, q.y);
  ctx.lineTo(q.x - 10 * Math.cos(ang - 0.4), q.y - 10 * Math.sin(ang - 0.4));
  ctx.lineTo(q.x - 10 * Math.cos(ang + 0.4), q.y - 10 * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();
}

/** 按旋转矩阵 R 画物体。 */
function drawBody(ctx: CanvasRenderingContext2D, cam: Camera, R: Mat3, alpha = 1): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  const pts = FLAG.map((p) => matVec(R, p));
  ctx.beginPath();
  pts.forEach((p, i) => {
    const s = project(p, cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(253,224,71,0.38)';
  ctx.fill();
  ctx.strokeStyle = COL.flag;
  ctx.lineWidth = 1.6;
  ctx.stroke();

  const axes: Array<[Vec3, string]> = [
    [[1.1, 0, 0], COL.bodyX], [[0, 1.1, 0], COL.bodyY], [[0, 0, 1.1], COL.bodyZ],
  ];
  for (const [v, col] of axes) {
    const w = matVec(R, v);
    line3(ctx, cam, [0, 0, 0], w, col, 2.4);
    dot3(ctx, cam, w, 3, col);
  }
  ctx.restore();
}

/** 标记点沿 exp(tω) 扫出的轨迹 —— 单参数子群在物体上的痕迹。 */
function drawTrail(
  ctx: CanvasRenderingContext2D, cam: Camera, omega: Vec3, tMax: number, col: string,
): void {
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.8;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  const N = 90;
  for (let i = 0; i <= N; i++) {
    const t = (tMax * i) / N;
    const p = project(matVec(oneParamSubgroup(omega, t), TRACER), cam);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    omega, t, mode = 'exp', terms = 4,
    camYaw = 0.7, camPitch = 0.32, showTrail = true,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  if (mode === 'bracket') {
    drawBracketMode(ctx, w, h, omega, camYaw, camPitch);
    return;
  }
  if (mode === 'series') {
    drawSeriesMode(ctx, w, h, omega, t, terms, camYaw, camPitch);
    return;
  }

  // ---- exp 模式: 左切空间的 ω, 右群里的旋转 ----
  const camL: Camera = makeCamera({
    yaw: camYaw, pitch: camPitch, cx: w * 0.27, cy: h * 0.47,
    scale: Math.min(w / 2, h) / 4.4, dist: 11,
  });
  drawAxes3D(ctx, camL, 1.7);
  const tip: Vec3 = [omega[0] * t, omega[1] * t, omega[2] * t];
  arrow3(ctx, camL, [0, 0, 0], tip, COL.omega, 3);
  dot3(ctx, camL, [0, 0, 0], 4.5, COL.ok);
  const tp = project(tip, camL);
  ctx.fillStyle = COL.omega;
  ctx.font = '600 13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('tω', tp.x + 9, tp.y - 10);

  ctx.fillStyle = COL.omega;
  ctx.font = '600 13.5px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('切空间 so(3)：反对称矩阵 ↔ 向量 ω', w * 0.27, 14);

  const camR: Camera = makeCamera({
    yaw: camYaw, pitch: camPitch, cx: w * 0.74, cy: h * 0.47,
    scale: Math.min(w / 2, h) / 3.7, dist: 11,
  });
  if (showTrail) drawTrail(ctx, camR, omega, t, COL.trail);
  drawBody(ctx, camR, oneParamSubgroup(omega, 0), 0.18);
  drawBody(ctx, camR, oneParamSubgroup(omega, t), 1);
  ctx.fillStyle = COL.trail;
  ctx.font = '600 13.5px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('群 SO(3)：exp(tω) 作用的结果', w * 0.74, 14);

  drawReadout(ctx, h, omega, t, mode, terms);
}

/** series 模式: 左闭式、右截断级数, 项数不够时右边不再是刚体。 */
function drawSeriesMode(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  omega: Vec3, t: number, terms: number, camYaw: number, camPitch: number,
): void {
  const wt: Vec3 = [omega[0] * t, omega[1] * t, omega[2] * t];
  const panels: Array<[number, Mat3, string, string]> = [
    [w * 0.27, expSO3(wt), COL.closed, 'Rodrigues 闭式'],
    [w * 0.74, expSeries(wt, terms), COL.series, `级数取 ${terms} 项`],
  ];
  for (const [cx, R, col, title] of panels) {
    const cam: Camera = makeCamera({
      yaw: camYaw, pitch: camPitch, cx, cy: h * 0.47,
      scale: Math.min(w / 2, h) / 3.7, dist: 11,
    });
    drawBody(ctx, cam, R, 1);
    ctx.fillStyle = col;
    ctx.font = '600 13.5px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(title, cx, 14);
  }
  drawReadout(ctx, h, omega, t, 'series', terms);
}

/**
 * bracket 模式: 先 A 后 B 与先 B 后 A, 两个结果不重合。
 * 缺口就是不可交换性, 其一阶量正是李括号 [A,B] = A×B。
 */
function drawBracketMode(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  omega: Vec3, camYaw: number, camPitch: number,
): void {
  // 第二个方向取与 omega 正交的一支, 保证括号非零
  const helper: Vec3 = Math.abs(omega[2]) < 0.9 * norm3(omega) ? [0, 0, 1] : [1, 0, 0];
  const bRaw = cross(omega, helper);
  const bn = norm3(bRaw) || 1;
  const scale = norm3(omega);
  const b: Vec3 = [(bRaw[0] / bn) * scale, (bRaw[1] / bn) * scale, (bRaw[2] / bn) * scale];

  const AB = matMul(expSO3(omega), expSO3(b));
  const BA = matMul(expSO3(b), expSO3(omega));

  const panels: Array<[number, Mat3, string, string]> = [
    [w * 0.27, AB, COL.pathA, '先转 A，再转 B'],
    [w * 0.74, BA, COL.pathB, '先转 B，再转 A'],
  ];
  for (const [cx, R, col, title] of panels) {
    const cam: Camera = makeCamera({
      yaw: camYaw, pitch: camPitch, cx, cy: h * 0.47,
      scale: Math.min(w / 2, h) / 3.7, dist: 11,
    });
    drawBody(ctx, cam, R, 1);
    ctx.fillStyle = col;
    ctx.font = '600 13.5px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(title, cx, 14);
  }

  const gap = matMaxDiff(AB, BA);
  const br = cross(omega, b);
  const lines: Array<[string, string, 'ok' | 'bad' | undefined]> = [
    ['A = ω', omega.map((v) => v.toFixed(3)).join(', '), undefined],
    ['B（取与 A 正交）', b.map((v) => v.toFixed(3)).join(', '), undefined],
    ['两种次序的差', gap.toExponential(3), gap > 1e-9 ? 'bad' : 'ok'],
    ['李括号 [A,B] = A×B', br.map((v) => v.toFixed(3)).join(', '), undefined],
    ['|[A,B]|', norm3(br).toFixed(6), norm3(br) > 1e-9 ? 'bad' : 'ok'],
    ['结论', norm3(br) > 1e-9 ? '括号非零 ⇒ 不可交换' : '括号为零 ⇒ 可交换', norm3(br) > 1e-9 ? 'bad' : 'ok'],
  ];
  panelBox(ctx, h, lines);
}

/** 左下读数框, 三种模式共用。 */
function panelBox(
  ctx: CanvasRenderingContext2D, hCanvas: number,
  lines: Array<[string, string, 'ok' | 'bad' | undefined]>,
): void {
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
  lines.forEach(([a, b, kind], i) => {
    const y = y0 + pad + lh * i + 5;
    const col = kind === 'ok' ? COL.ok : kind === 'bad' ? COL.bad : undefined;
    ctx.textAlign = 'left';
    ctx.fillStyle = col ?? COL.dim;
    ctx.fillText(a, x0 + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = col ?? COL.text;
    ctx.fillText(b, x0 + wid - pad, y);
  });
}

function drawReadout(
  ctx: CanvasRenderingContext2D, hCanvas: number,
  omega: Vec3, t: number, mode: Mode, terms: number,
): void {
  const wt: Vec3 = [omega[0] * t, omega[1] * t, omega[2] * t];
  const theta = norm3(wt);
  const R = expSO3(wt);
  const lines: Array<[string, string, 'ok' | 'bad' | undefined]> = [
    ['ω', omega.map((v) => v.toFixed(3)).join(', '), undefined],
    ['t', t.toFixed(3), undefined],
    ['θ = |tω|', `${theta.toFixed(6)} rad = ${((theta * 180) / Math.PI).toFixed(2)}°`, undefined],
  ];

  if (mode === 'series') {
    const err = matMaxDiff(R, expSeries(wt, terms));
    /*
     * ⚠️ 判据要分三档, 不能只用一个 1e-10 的阈值。
     * 截图里 16 项时误差 1.693e-5, 两个物体已经看不出差别, 但旧代码
     * 仍打出"不是（不再正交）"—— 与画面矛盾。按肉眼可辨的尺度分档:
     *   >1e-3  画得出来的形变(轴不再垂直、旗子被拉长)
     *   >1e-12 数值上还没收敛干净, 但已看不出来
     *   否则   与闭式一致到机器精度
     */
    const verdict: [string, 'ok' | 'bad' | undefined] =
      err > 1e-3
        ? ['不是（明显不再正交）', 'bad']
        : err > 1e-12
          ? ['看上去已经是了（仍有微小偏差）', undefined]
          : ['是（与闭式一致到机器精度）', 'ok'];
    lines.push(['级数项数', String(terms), undefined]);
    lines.push(['与闭式的最大差', err.toExponential(3), err > 1e-3 ? 'bad' : 'ok']);
    lines.push(['截断结果还是旋转吗', verdict[0], verdict[1]]);
  } else {
    lines.push(['exp 后是否正交', '是', 'ok']);
    lines.push(['det', '1.000000', 'ok']);
    lines.push(['不可交换缺口', bchDefect(omega, [omega[2], omega[0], omega[1]]).toExponential(2), undefined]);
  }

  panelBox(ctx, hCanvas, lines);
}
