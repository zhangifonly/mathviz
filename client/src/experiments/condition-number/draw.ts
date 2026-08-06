/**
 * 条件数的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 画面构成:
 *   - 左: 单位球面(线框), 上面标出最坏扰动方向
 *   - 右: A 作用后的椭球。三条半轴 = 三个奇异值,
 *         最长/最短 = κ。椭球越扁 = 越病态。
 *   - 左下读数: σ、κ、det、扰动放大倍数
 *
 * ⚠️ 两侧必须用**同一个缩放**, 否则"椭球比球扁"这件事会被各自
 * 归一化掉, 图就白画了。缩放统一由 σ_max 定。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import {
  conditionNumber, det3, ellipsoidAxes, matVec, perturbationTest,
  singularValues, worstDirection, worstRHS, type Mat3,
} from './conditionNumber';

export interface DrawOpts {
  A: Mat3;
  camYaw?: number;
  camPitch?: number;
  /** 显示最坏扰动方向 */
  showWorst?: boolean;
  /** 网格密度 */
  res?: number;
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  bad: '#f87171',
  warn: '#fbbf24',
  sphere: '#334155',
  ell: '#38bdf8',
  ax1: '#4ade80',
  ax2: '#fbbf24',
  ax3: '#f87171',
  worst: '#f472b6',
};

export function drawConditionNumber(canvas: HTMLCanvasElement, opts: DrawOpts): void {
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

/**
 * 画一张由 A 变形的球面线框。A = I 时就是单位球。
 * 用经纬网格; 网格线本身也被 A 拉伸, 于是"哪个方向被压扁"看得见。
 */
function drawWireSurface(
  ctx: CanvasRenderingContext2D, cam: Camera, A: Mat3, col: string, res: number, alpha: number,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = col;
  ctx.lineWidth = 1;

  const pt = (u: number, v: number): Vec3 => {
    const s: Vec3 = [
      Math.cos(v) * Math.cos(u),
      Math.cos(v) * Math.sin(u),
      Math.sin(v),
    ];
    return matVec(A, s);
  };

  // 纬线
  for (let j = 1; j < res; j++) {
    const v = -Math.PI / 2 + (Math.PI * j) / res;
    ctx.beginPath();
    for (let i = 0; i <= res * 2; i++) {
      const p = project(pt((i / (res * 2)) * Math.PI * 2, v), cam);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
  // 经线
  for (let i = 0; i < res * 2; i += 2) {
    const u = (i / (res * 2)) * Math.PI * 2;
    ctx.beginPath();
    for (let j = 0; j <= res; j++) {
      const p = project(pt(u, -Math.PI / 2 + (Math.PI * j) / res), cam);
      if (j === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const { A, camYaw = 0.72, camPitch = 0.42, showWorst = true, res = 14 } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const sig = singularValues(A);
  const axes = ellipsoidAxes(A);
  const kappa = conditionNumber(A);

  /*
   * ⚠️ 两侧共用同一缩放。若各自按自身大小归一化, 球和椭球会画得一样大,
   * "椭球更扁"这个唯一要看的事情就被抹掉了。基准取 max(σmax, 1):
   * 既容得下被拉长的椭球, 也让单位球保持可见。
   */
  const ref = Math.max(sig[0], 1);
  const scale = (Math.min(w / 2, h) * 0.34) / ref;
  const mk = (cx: number): Camera => makeCamera({
    yaw: camYaw, pitch: camPitch, cx, cy: h * 0.48, scale, dist: ref * 6,
  });

  const camL = mk(w * 0.27);
  const camR = mk(w * 0.74);

  // ---- 左: 单位球 ----
  drawWireSurface(ctx, camL, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], COL.sphere, res, 0.85);
  ctx.fillStyle = COL.dim;
  ctx.font = '600 13.5px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('单位球面（输入）', w * 0.27, 14);

  // ---- 右: 椭球 ----
  drawWireSurface(ctx, camR, A, COL.ell, res, 0.9);
  // 三条半轴, 长度即奇异值
  const axCols = [COL.ax1, COL.ax2, COL.ax3];
  axes.forEach((a, i) => {
    const tip: Vec3 = [a.dir[0] * a.length, a.dir[1] * a.length, a.dir[2] * a.length];
    arrow3(ctx, camR, [0, 0, 0], tip, axCols[i], 2.6);
    const p = project(tip, camR);
    ctx.fillStyle = axCols[i];
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`σ${'₁₂₃'[i]}=${a.length.toExponential(2)}`, p.x + 7, p.y - 8);
  });
  ctx.fillStyle = COL.ell;
  ctx.font = '600 13.5px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('A 作用后（椭球）', w * 0.74, 14);
  /*
   * 椭球整体太小/太大时补一句说明。
   * 共用缩放是对的(否则看不出扁), 但 σ 全是 1e−3 那种情形下右边会缩成
   * 一个小点, 看着像画坏了 —— 其实那正是"整体缩小、形状没变"。
   * 写出来, 小就成了信息而不是故障。
   */
  if (sig[0] < 0.2 || sig[0] > 6) {
    ctx.fillStyle = COL.dim;
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(
      `整体尺度 ×${sig[0].toExponential(0)}（形状看 κ，不看大小）`,
      w * 0.74, 32,
    );
  }

  if (showWorst) {
    // 最坏扰动方向: 椭球被压得最扁的那条轴
    const wd = worstDirection(A);
    arrow3(ctx, camL, [0, 0, 0], wd, COL.worst, 2.4);
    const p = project(wd, camL);
    ctx.fillStyle = COL.worst;
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('最坏方向', p.x + 7, p.y - 8);
  }

  drawReadout(ctx, h, A, sig, kappa);
}

function drawReadout(
  ctx: CanvasRenderingContext2D, hCanvas: number, A: Mat3, sig: number[], kappa: number,
): void {
  const perturb = perturbationTest(A, worstRHS(A), worstDirection(A), 1e-6);
  const kind = (k: number): 'ok' | 'warn' | 'bad' =>
    k < 10 ? 'ok' : k < 1e4 ? 'warn' : 'bad';
  const verdict = (k: number): string =>
    !Number.isFinite(k) ? '奇异，无解'
      : k < 10 ? '良态'
        : k < 1e3 ? '尚可'
          : k < 1e6 ? '病态' : '严重病态';

  const lines: Array<[string, string, 'ok' | 'warn' | 'bad' | undefined]> = [
    ['σ₁ (最长半轴)', sig[0].toExponential(4), undefined],
    ['σ₃ (最短半轴)', sig[2].toExponential(4), undefined],
    ['κ = σ₁/σ₃', Number.isFinite(kappa) ? kappa.toExponential(4) : '∞', kind(kappa)],
    ['判定', verdict(kappa), kind(kappa)],
    ['det(A)', det3(A).toExponential(4), undefined],
    ['σ₁σ₂σ₃', (sig[0] * sig[1] * sig[2]).toExponential(4), undefined],
  ];
  if (perturb) {
    lines.push(['输入误差 1e−6 时', '', undefined]);
    lines.push([
      '  解的相对误差',
      (perturb.amplification * 1e-6).toExponential(3),
      kind(kappa),
    ]);
  }

  const pad = 12;
  const lh = 19;
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
    const col = k === 'ok' ? COL.ok : k === 'warn' ? COL.warn : k === 'bad' ? COL.bad : undefined;
    ctx.textAlign = 'left';
    ctx.fillStyle = col ?? COL.dim;
    ctx.fillText(a, x0 + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = col ?? COL.text;
    ctx.fillText(b, x0 + wid - pad, y);
  });
}
