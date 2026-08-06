/**
 * 四元数旋转的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 画面构成:
 *   - 一个带朝向标记的物体(三轴坐标架 + 一面旗子), 姿态由四元数定
 *   - 对照模式下并排画两个: 左 SLERP、右 欧拉线性插值
 *   - 物体某个顶点在插值全程扫出的**轨迹**, 用来看路径直不直、匀不匀
 *   - 左下读数: 四元数分量、轴角、每步转角的 max/min 比
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import {
  angleBetweenQuats, eulerLerp, fromEuler, pathStats, rotate, slerp,
  toAxisAngle, type Quat,
} from './quaternionRotation';

export type Mode = 'single' | 'compare';

export interface DrawOpts {
  /** 起止姿态(欧拉角, 便于与旧课衔接) */
  from: { yaw: number; pitch: number; roll: number };
  to: { yaw: number; pitch: number; roll: number };
  /** 插值参数 0..1 */
  t: number;
  mode?: Mode;
  camYaw?: number;
  camPitch?: number;
  /** 画出顶点扫过的轨迹 */
  showTrail?: boolean;
  /** 画旋转轴 */
  showAxis?: boolean;
}

const COL = {
  bg: '#0b1020',
  grid: '#1e293b',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  warn: '#fbbf24',
  slerp: '#38bdf8',
  euler: '#fb923c',
  axisX: '#ef4444',
  axisY: '#4ade80',
  axisZ: '#60a5fa',
  flag: '#fde047',
  axis: '#a78bfa',
};

/** 物体: 一个三轴坐标架 + 一面不对称的旗子(不对称才看得出朝向)。 */
const BODY_AXES: Array<[Vec3, string]> = [
  [[1.15, 0, 0], COL.axisX],
  [[0, 1.15, 0], COL.axisY],
  [[0, 0, 1.15], COL.axisZ],
];

/** 旗面四点: 贴在 z 轴上、朝 +x 展开, 左右不对称 */
const FLAG: Vec3[] = [
  [0, 0, 0.35],
  [0.75, 0, 0.95],
  [0.75, 0, 0.55],
  [0, 0, 0.15],
];

/** 用来画轨迹的标记点(旗尖) */
const TRACER: Vec3 = [0.75, 0, 0.95];

export function drawQuaternionRotation(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
}

function line3(ctx: CanvasRenderingContext2D, cam: Camera, a: Vec3, b: Vec3, col: string, wdt = 2): void {
  const p = project(a, cam);
  const q = project(b, cam);
  ctx.strokeStyle = col;
  ctx.lineWidth = wdt;
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(q.x, q.y);
  ctx.stroke();
}

/** 淡淡的地面网格, 给旋转一个静止参照 —— 没有它很难看出物体在转。 */
function drawGrid(ctx: CanvasRenderingContext2D, cam: Camera, half = 1.8, n = 6): void {
  ctx.strokeStyle = COL.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= n; i++) {
    const u = -half + (2 * half * i) / n;
    line3(ctx, cam, [u, -half, -1.3], [u, half, -1.3], COL.grid, 1);
    line3(ctx, cam, [-half, u, -1.3], [half, u, -1.3], COL.grid, 1);
  }
}

/** 画一个处于姿态 q 的物体。 */
function drawBody(ctx: CanvasRenderingContext2D, cam: Camera, q: Quat, alpha = 1): void {
  ctx.save();
  ctx.globalAlpha = alpha;

  // 旗面: 先算四个角的世界坐标, 再按平均深度决定要不要描边
  const pts = FLAG.map((p) => rotate(q, p));
  ctx.beginPath();
  pts.forEach((p, i) => {
    const s = project(p, cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(253,224,71,0.42)';
  ctx.fill();
  ctx.strokeStyle = COL.flag;
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // 三轴
  for (const [v, col] of BODY_AXES) {
    const w = rotate(q, v);
    line3(ctx, cam, [0, 0, 0], w, col, 2.6);
    const s = project(w, cam);
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 一条插值路径上, 标记点扫出的轨迹。
 *
 * 这是全课最能说明问题的一张图: SLERP 的轨迹是球面上的一段大圆弧、
 * 点距均匀; 欧拉线性插值的轨迹会鼓出去, 而且点疏密不均 —— 疏的地方
 * 转得快, 密的地方转得慢。
 */
function drawTrail(
  ctx: CanvasRenderingContext2D, cam: Camera,
  f: (t: number) => Quat, col: string, steps = 40,
): void {
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.8;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const p = project(rotate(f(i / steps), TRACER), cam);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  // 等参数间隔的采样点: 点距不均 = 角速度不匀
  ctx.fillStyle = col;
  for (let i = 0; i <= steps; i += 2) {
    const p = project(rotate(f(i / steps), TRACER), cam);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    from, to, t, mode = 'single',
    camYaw = 0.6, camPitch = 0.32,
    showTrail = true, showAxis = true,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const qa = fromEuler(from.yaw, from.pitch, from.roll);
  const qb = fromEuler(to.yaw, to.pitch, to.roll);
  const fSlerp = (u: number) => slerp(qa, qb, u);
  const fEuler = (u: number) => eulerLerp(from, to, u);

  const panels: Array<{ cx: number; f: (u: number) => Quat; col: string; title: string }> =
    mode === 'compare'
      ? [
          { cx: w * 0.27, f: fSlerp, col: COL.slerp, title: 'SLERP（四元数）' },
          { cx: w * 0.73, f: fEuler, col: COL.euler, title: '欧拉角逐分量线性插值' },
        ]
      : [{ cx: w / 2, f: fSlerp, col: COL.slerp, title: 'SLERP（四元数）' }];

  const scale = mode === 'compare' ? Math.min(w / 2, h) / 4.4 : Math.min(w, h) / 4.2;

  for (const panel of panels) {
    const cam: Camera = makeCamera({
      yaw: camYaw, pitch: camPitch,
      cx: panel.cx, cy: h * 0.47,
      scale, dist: 11,
    });

    drawGrid(ctx, cam);
    if (showTrail) drawTrail(ctx, cam, panel.f, panel.col);

    const q = panel.f(t);
    // 起止姿态用淡影标出, 便于看"从哪转到哪"
    drawBody(ctx, cam, panel.f(0), 0.16);
    drawBody(ctx, cam, panel.f(1), 0.16);

    if (showAxis && mode !== 'compare') {
      // 整段旋转的等效轴(SLERP 全程绕它转)
      const rel = toAxisAngle(relativeQuat(qa, qb));
      const worldAxis = rotate(qa, rel.axis);
      const L = 1.75;
      line3(ctx, cam,
        [-worldAxis[0] * L, -worldAxis[1] * L, -worldAxis[2] * L],
        [worldAxis[0] * L, worldAxis[1] * L, worldAxis[2] * L],
        COL.axis, 1.6);
    }

    drawBody(ctx, cam, q, 1);

    // 面板标题
    ctx.fillStyle = panel.col;
    ctx.font = '600 13.5px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(panel.title, panel.cx, 14);
  }

  drawReadout(ctx, w, h, qa, qb, t, mode, fSlerp, fEuler);
}

/** 左下读数。核心是「每步转角 max/min」: SLERP 恒为 1, 欧拉插值大于 1。 */
function drawReadout(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  qa: Quat, qb: Quat, t: number, mode: Mode,
  fSlerp: (u: number) => Quat, fEuler: (u: number) => Quat,
): void {
  const q = fSlerp(t);
  const aa = toAxisAngle(q);
  const deg = (r: number) => ((r * 180) / Math.PI).toFixed(3);

  const lines: Array<[string, string, boolean?]> = [
    ['q = (w, x, y, z)', q.map((v) => v.toFixed(4)).join(', ')],
    ['|q|', '1.000000'],
    ['等效轴', aa.axis.map((v) => v.toFixed(3)).join(', ')],
    ['等效转角', `${deg(aa.angle)}°`],
    ['两姿态夹角', `${deg(angleBetweenQuats(qa, qb))}°`],
  ];

  if (mode === 'compare') {
    /*
     * 两个指标测的是**两种不同的毛病**, 缺一不可:
     *   max/min  —— 快慢匀不匀
     *   总转角   —— 路走得冤不冤
     * 万向锁那个预设里欧拉插值的 max/min 恰好是 1.0000(全程匀速),
     * 但总转角 343° 对 18° —— 只看第一个指标会以为它没问题。
     */
    const s = pathStats(fSlerp, 48);
    const e = pathStats(fEuler, 48);
    lines.push(['SLERP 总转角', `${deg(s.total)}°`, true]);
    lines.push(['欧拉插值总转角', `${deg(e.total)}°`]);
    lines.push(['多走', `${((e.total / Math.max(1e-9, s.total) - 1) * 100).toFixed(1)}%`, true]);
    lines.push(['SLERP 每步 max/min', s.ratio.toFixed(4), true]);
    lines.push(['欧拉插值 max/min', e.ratio.toFixed(4)]);
  }

  const pad = 12;
  const lh = 19;
  ctx.font = '12.5px system-ui, sans-serif';
  ctx.textAlign = 'left';
  const wid = Math.max(...lines.map(([a, b]) => ctx.measureText(`${a}   ${b}`).width)) + pad * 2;
  const x0 = 14;
  const y0 = h - (lines.length * lh + pad * 2 - 6) - 14;
  ctx.fillStyle = 'rgba(15,23,42,0.88)';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x0, y0, wid, lines.length * lh + pad * 2 - 6, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textBaseline = 'middle';
  lines.forEach(([a, b, key], i) => {
    const y = y0 + pad + lh * i + 5;
    ctx.textAlign = 'left';
    ctx.fillStyle = key ? COL.ok : COL.dim;
    ctx.fillText(a, x0 + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = key ? COL.ok : COL.text;
    ctx.fillText(b, x0 + wid - pad, y);
  });

  // 进度条
  const bw = Math.min(220, w * 0.3);
  const bx = w - bw - 16;
  const by = h - 26;
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, 6, 3);
  ctx.fill();
  ctx.fillStyle = COL.slerp;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw * Math.max(0, Math.min(1, t)), 6, 3);
  ctx.fill();
  ctx.fillStyle = COL.dim;
  ctx.font = '11.5px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`t = ${t.toFixed(2)}`, bx + bw, by - 4);
}

/** 从姿态 a 到姿态 b 的相对旋转 q = b·a⁻¹ 的"局部"版本 a⁻¹·b。 */
function relativeQuat(a: Quat, b: Quat): Quat {
  const inv: Quat = [a[0], -a[1], -a[2], -a[3]];
  const [aw, ax, ay, az] = inv;
  const [bw, bx, by, bz] = b;
  return [
    aw * bw - ax * bx - ay * by - az * bz,
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
  ];
}
