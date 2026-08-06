/**
 * Banach 不动点定理的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 为什么用 3D: 二维映射的迭代轨迹本身是平面折线, 但**误差随步数的
 * 衰减**是另一件事。把 (x, y, 步数) 摆成空间折线, 就能同时看到
 * "往哪走"与"走多快"; 底面是轨迹的投影(相当于原来的平面图),
 * 竖直方向拉开步数, 收敛快慢直接读作"锥收得多陡"。
 *
 * 再叠上以不动点为轴、半径按 q^n 收缩的**理论包络锥**, 界紧不紧
 * 一眼可辨 —— 轨迹必须始终落在锥内, 这正是 Banach 误差界的几何形态。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import {
  aPosterioriBound, aPrioriBound, errorSequence, fixedPoint, isContraction,
  norm2, orbit, spectralNorm, spectralRadius, stepsNeeded, sub2,
  type Mat2, type Vec2,
} from './banachFixedPoint';

export interface DrawOpts {
  A: Mat2;
  b: Vec2;
  x0: Vec2;
  steps?: number;
  camYaw?: number;
  camPitch?: number;
  /** 显示理论包络锥 */
  showCone?: boolean;
  /** 显示底面投影 */
  showProjection?: boolean;
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  warn: '#fbbf24',
  bad: '#f87171',
  grid: '#1e293b',
  axis: '#475569',
  orbit: '#38bdf8',
  proj: '#475569',
  cone: '#fbbf24',
  star: '#4ade80',
};

/** 竖直方向每一步的间距 */
const STEP_H = 0.14;

export function drawBanach(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
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

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    A, b, x0, steps = 24,
    camYaw = 0.74, camPitch = 0.36,
    showCone = true, showProjection = true,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const star = fixedPoint(A, b);
  const path = orbit(A, b, x0, steps);
  const contraction = isContraction(A);

  /*
   * 取景由轨迹与不动点共同决定, 并以不动点为中心。
   * 发散情形轨迹会跑得很远, 用 92% 分位数而不是最大值, 免得被
   * 最后几个飞出去的点绑架、把有意思的前几步压成一个点。
   */
  const center: Vec2 = star ?? path[0];
  const dists = path.map((p) => norm2(sub2(p, center))).sort((a, z) => a - z);
  const reach = Math.max(
    dists[Math.floor(0.92 * (dists.length - 1))] || 1, 0.5,
  ) * 1.25;

  const toXYZ = (p: Vec2, n: number): Vec3 => [
    (p[0] - center[0]) / reach,
    (p[1] - center[1]) / reach,
    n * STEP_H,
  ];

  const cam: Camera = makeCamera({
    yaw: camYaw, pitch: camPitch, cx: w * 0.5, cy: h * 0.62,
    scale: Math.min(w, h) * 0.3, dist: 10,
  });

  // ---- 底面网格 ----
  for (let i = -3; i <= 3; i++) {
    const u = i / 3;
    line3(ctx, cam, [u, -1, 0], [u, 1, 0], COL.grid, 0.8);
    line3(ctx, cam, [-1, u, 0], [1, u, 0], COL.grid, 0.8);
  }

  // ---- 理论包络锥: 半径 = 先验界 ----
  if (showCone && contraction) {
    ctx.strokeStyle = COL.cone;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    for (let n = 0; n <= steps; n += 2) {
      const r = aPrioriBound(A, b, x0, n) / reach;
      if (!Number.isFinite(r) || r > 4) continue;
      ctx.beginPath();
      for (let k = 0; k <= 40; k++) {
        const t = (k / 40) * Math.PI * 2;
        const s = project([r * Math.cos(t), r * Math.sin(t), n * STEP_H], cam);
        if (k === 0) ctx.moveTo(s.x, s.y);
        else ctx.lineTo(s.x, s.y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const r0 = aPrioriBound(A, b, x0, 0) / reach;
    if (Number.isFinite(r0) && r0 < 4) {
      label3(ctx, cam, [r0, 0, 0], '先验界包络', COL.cone, 8, -8);
    }
  }

  // ---- 不动点所在的竖直轴 ----
  if (star) {
    line3(ctx, cam, [0, 0, 0], [0, 0, steps * STEP_H], COL.star, 1.6);
    const s = project([0, 0, 0] as Vec3, cam);
    ctx.fillStyle = COL.star;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 5.5, 0, Math.PI * 2);
    ctx.fill();
    label3(ctx, cam, [0, 0, 0], 'x*（唯一不动点）', COL.star, 9, 11);
  }

  // ---- 底面投影(相当于原来的平面轨迹图) ----
  if (showProjection) {
    ctx.strokeStyle = COL.proj;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    path.forEach((p, i) => {
      const s = project(toXYZ(p, 0), cam);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ---- 空间轨迹 ----
  ctx.strokeStyle = COL.orbit;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  path.forEach((p, i) => {
    const s = project(toXYZ(p, i), cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.stroke();
  path.forEach((p, i) => {
    const s = project(toXYZ(p, i), cam);
    ctx.fillStyle = COL.orbit;
    ctx.beginPath();
    ctx.arc(s.x, s.y, i === 0 ? 4.5 : 2.4, 0, Math.PI * 2);
    ctx.fill();
    // 垂线, 让"第几步"看得出来
    if (i % 4 === 0) {
      ctx.globalAlpha = 0.35;
      line3(ctx, cam, toXYZ(p, 0), toXYZ(p, i), COL.orbit, 0.7);
      ctx.globalAlpha = 1;
    }
  });
  label3(ctx, cam, toXYZ(path[0], 0), 'x₀', COL.orbit, 9, 10);

  drawReadout(ctx, h, A, b, x0, steps);
}

function drawReadout(
  ctx: CanvasRenderingContext2D, hCanvas: number,
  A: Mat2, b: Vec2, x0: Vec2, steps: number,
): void {
  const q = spectralNorm(A);
  const rho = spectralRadius(A);
  const contraction = q < 1;
  const errs = errorSequence(A, b, x0, steps);
  const n = Math.min(10, errs.length - 1);
  const f = (v: number) => (Number.isFinite(v) ? v.toExponential(3) : '∞');
  const need = stepsNeeded(A, b, x0, 1e-6);

  const lines: Array<[string, string, 'ok' | 'warn' | 'bad' | undefined]> = [
    ['谱范数 ‖A‖', q.toFixed(5), contraction ? 'ok' : 'bad'],
    ['谱半径 ρ(A)', rho.toFixed(5), rho < 1 ? 'ok' : 'bad'],
    ['是否压缩映射', contraction ? '是（定理适用）' : '否（定理用不上）', contraction ? 'ok' : 'bad'],
    ['是否收敛', rho < 1 ? '收敛（由 ρ 决定）' : '发散', rho < 1 ? 'ok' : 'bad'],
    [`n=${n} 实际误差`, n >= 0 ? f(errs[n]) : '—', undefined],
    ['先验界 q^n/(1−q)·d₁', f(aPrioriBound(A, b, x0, n)), contraction ? 'warn' : undefined],
    ['后验界 q/(1−q)·|xₙ−xₙ₋₁|', f(aPosterioriBound(A, b, x0, n)), contraction ? 'ok' : undefined],
    ['要达到 1e−6 需迭代', need === null ? '定理不适用' : `${need} 步`, undefined],
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
    const col = k === 'ok' ? COL.ok : k === 'warn' ? COL.warn : k === 'bad' ? COL.bad : undefined;
    ctx.textAlign = 'left';
    ctx.fillStyle = col ?? COL.dim;
    ctx.fillText(x, px + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = col ?? COL.text;
    ctx.fillText(v, px + wid - pad, y);
  });
}
