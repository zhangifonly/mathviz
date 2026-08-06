/**
 * 螺旋运动的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 画面构成:
 *   - 紫色直线: 螺旋轴(Chasles 分解算出来的那条), 位置一般不过原点
 *   - 物体: 起始位姿(淡) → 当前位姿(实) → 终止位姿(淡)
 *   - 若干条**螺旋线**: 物体上几个点扫出的轨迹。离轴越远螺距不变、
 *     半径越大, 这是"螺旋"最直观的样子。
 *   - 轴上一点的轨迹是**直线段** —— 它只沿轴平移, 不绕转。这是判断
 *     轴找对没有的最好办法。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import {
  add, applyMotion, chaslesDecompose, dot, makeMotion,
  norm, pitchPerTurn, scale, screwInterpolate, screwTrajectory, sub,
  type Screw,
} from './screwMotion';

export interface DrawOpts {
  axis: Vec3;
  theta: number;
  t: Vec3;
  /** 沿螺旋走到哪 0..1 */
  u: number;
  camYaw?: number;
  camPitch?: number;
  /** 显示轨迹螺旋线 */
  showTrails?: boolean;
  /** 显示原始平移向量的分解(沿轴/垂直) */
  showDecomp?: boolean;
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  axis: '#a78bfa',
  trail: '#38bdf8',
  axisTrail: '#4ade80',
  tVec: '#f472b6',
  tPar: '#fbbf24',
  tPerp: '#22d3ee',
  bodyX: '#ef4444',
  bodyY: '#4ade80',
  bodyZ: '#60a5fa',
  flag: '#fde047',
};

/** 物体: 三轴 + 不对称旗子 */
const FLAG: Vec3[] = [[0, 0, 0.25], [0.6, 0, 0.7], [0.6, 0, 0.4], [0, 0, 0.08]];
/** 用来画螺旋线的几个标记点(离轴远近不同) */
const TRACERS: Vec3[] = [[0.6, 0, 0.7], [0, 0.9, 0], [1.0, 0, 0]];

export function drawScrewMotion(canvas: HTMLCanvasElement, opts: DrawOpts): void {
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

function polyline3(ctx: CanvasRenderingContext2D, cam: Camera, pts: Vec3[], col: string, w = 1.8): void {
  if (pts.length < 2) return;
  ctx.strokeStyle = col;
  ctx.lineWidth = w;
  ctx.beginPath();
  pts.forEach((p, i) => {
    const s = project(p, cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.stroke();
}

/** 按刚体运动画物体。 */
function drawBody(
  ctx: CanvasRenderingContext2D, cam: Camera,
  m: { R: number[][]; t: Vec3 }, alpha = 1,
  shift: (p: Vec3) => Vec3 = (p) => p,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  const pts = FLAG.map((p) => shift(applyMotion(m, p)));
  ctx.beginPath();
  pts.forEach((p, i) => {
    const s = project(p, cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(253,224,71,0.36)';
  ctx.fill();
  ctx.strokeStyle = COL.flag;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const origin = shift(applyMotion(m, [0, 0, 0]));
  const axes: Array<[Vec3, string]> = [
    [[0.9, 0, 0], COL.bodyX], [[0, 0.9, 0], COL.bodyY], [[0, 0, 0.9], COL.bodyZ],
  ];
  for (const [v, col] of axes) {
    line3(ctx, cam, origin, shift(applyMotion(m, v)), col, 2.2);
  }
  ctx.restore();
}

/** 画螺旋轴: 一条穿过 s.point、方向 s.axis 的长直线。 */
function drawAxisLine(
  ctx: CanvasRenderingContext2D, cam: Camera, s: Screw, half = 3.2,
  shift: (p: Vec3) => Vec3 = (p) => p,
): void {
  const a = shift(add(s.point, scale(s.axis, -half)));
  const b = shift(add(s.point, scale(s.axis, half)));
  ctx.setLineDash([]);
  line3(ctx, cam, a, b, COL.axis, 2.2);
  dot3(ctx, cam, shift(s.point), 4, COL.axis);
  const p = project(b, cam);
  ctx.fillStyle = COL.axis;
  ctx.font = '600 12.5px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('螺旋轴', p.x + 8, p.y - 8);
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    axis, theta, t, u,
    // ⚠️ 俯仰角别太小。默认轴多沿 z, pitch=0.3 时几乎正侧看过去,
    // 螺旋线被压成几道细弧, "螺旋"的样子完全出不来。抬到 0.62
    // 才能同时看见绕转半径与沿轴推进。
    camYaw = 0.75, camPitch = 0.62,
    showTrails = true, showDecomp = true,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const motion = makeMotion(axis, theta, t);
  const s = chaslesDecompose(motion);

  /*
   * 取景由**实际内容**定, 不用固定缩放。
   *
   * ⚠️ 原来写死 scale = min(w,h)/8.2、轴线半长 3.2, 结果内容全挤在
   * 右上角: 螺距 3 的运动 z 向要跨 0..3, 而轴线又固定向两侧各伸 3.2,
   * 包围盒的中心根本不在原点。这里先把要画的东西(起止位姿、轨迹、
   * 轴段)的包围盒算出来, 再按它定缩放与平移。
   */
  const content: Vec3[] = [];
  for (const uu of [0, 0.5, 1]) {
    const mm = screwInterpolate(s, uu);
    for (const p of [...FLAG, [0, 0, 0] as Vec3, ...TRACERS]) content.push(applyMotion(mm, p));
  }
  for (const p of TRACERS) content.push(...screwTrajectory(s, p, 24));
  /*
   * ⚠️ 轴线**只画不入框**。
   * 轴要画得比内容长一点才像"一条轴", 但若把它的两个端点也算进包围盒,
   * 框就被轴撑大, 物体和螺旋线一起缩到中间一小块 —— 截图里就是这样。
   * 所以先由真实内容(位姿+轨迹)定框, 轴长另算, 允许它伸出画面。
   */
  if (showDecomp) content.push(t, [0, 0, 0]);
  const spread = Math.max(...content.map((p) => norm(sub(p, s.point))), 1);
  const axisHalf = Math.min(spread * 1.2, 6);

  const lo: Vec3 = [Infinity, Infinity, Infinity];
  const hi: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const p of content) {
    for (let i = 0; i < 3; i++) {
      lo[i] = Math.min(lo[i], p[i]);
      hi[i] = Math.max(hi[i], p[i]);
    }
  }
  const center: Vec3 = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
  const radius = Math.max(
    ...content.map((p) => norm(sub(p, center))),
    1e-6,
  );

  /*
   * Camera 没有"世界原点偏移"字段, 所以居中靠**画之前把点减去中心**。
   * 下面所有绘制都走 shift(), 漏掉一处就会与其余内容错位。
   */
  const cam: Camera = makeCamera({
    yaw: camYaw, pitch: camPitch, cx: w / 2, cy: h * 0.5,
    scale: (Math.min(w, h) * 0.46) / radius,
    dist: radius * 5.5,
  });
  const shift = (p: Vec3): Vec3 => sub(p, center);

  /*
   * 不画 drawAxes3D 的世界坐标轴: 它固定画在真原点上, 而这里整幅图
   * 已被平移过, 画出来会与其余内容错位。本课要看的是**螺旋轴**,
   * 世界轴反而是干扰; t 的分解箭头已经从原点出发, 足够定位。
   */
  drawAxisLine(ctx, cam, s, axisHalf, shift);

  if (showTrails) {
    // 物体上几个点扫出的螺旋线; 离轴越远, 螺旋半径越大
    for (const p of TRACERS) {
      polyline3(ctx, cam, screwTrajectory(s, p, 90).map(shift), COL.trail, 1.6);
    }
    // 轴上一点的轨迹: 一条直线段 —— 轴找对了才会是直的
    polyline3(ctx, cam, screwTrajectory(s, s.point, 40).map(shift), COL.axisTrail, 2.6);
  }

  if (showDecomp) drawTranslationDecomp(ctx, cam, s, t, shift);

  // 起点(淡) → 当前(实) → 终点(淡)
  drawBody(ctx, cam, screwInterpolate(s, 0), 0.2, shift);
  drawBody(ctx, cam, screwInterpolate(s, 1), 0.2, shift);
  drawBody(ctx, cam, screwInterpolate(s, u), 1, shift);

  drawReadout(ctx, h, s, t, u);
}

/**
 * 把原始平移 t 拆成"沿轴"与"垂直于轴"两支画出来。
 * 沿轴那支消不掉(就是螺距 d), 垂直那支靠把轴挪到 s.point 消掉 ——
 * 这正是 Chasles 分解干的事, 画出来比公式直观。
 */
function drawTranslationDecomp(
  ctx: CanvasRenderingContext2D, cam: Camera, s: Screw, t: Vec3,
  shift: (p: Vec3) => Vec3 = (p) => p,
): void {
  const o: Vec3 = [0, 0, 0];
  const along = scale(s.axis, dot(t, s.axis));
  const perp = sub(t, along);
  ctx.globalAlpha = 0.95;
  arrow3(ctx, cam, shift(o), shift(t), COL.tVec, 2.2);
  arrow3(ctx, cam, shift(o), shift(along), COL.tPar, 2);
  arrow3(ctx, cam, shift(along), shift(add(along, perp)), COL.tPerp, 2);
  ctx.globalAlpha = 1;
  const pt = project(shift(t), cam);
  ctx.fillStyle = COL.tVec;
  ctx.font = '600 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('t', pt.x + 7, pt.y - 7);
}

function drawReadout(
  ctx: CanvasRenderingContext2D, hCanvas: number, s: Screw, t: Vec3, u: number,
): void {
  const along = dot(t, s.axis);
  const perp = norm(sub(t, scale(s.axis, along)));
  const pitch = pitchPerTurn(s);
  const lines: Array<[string, string, 'ok' | undefined]> = [
    ['原平移 t', t.map((v) => v.toFixed(2)).join(', '), undefined],
    ['沿轴分量（= 螺距 d）', s.d.toFixed(5), 'ok'],
    ['垂直分量（挪轴消掉）', perp.toFixed(5), undefined],
    ['转角 θ', `${s.theta.toFixed(5)} rad = ${((s.theta * 180) / Math.PI).toFixed(2)}°`, undefined],
    ['螺旋轴方向', s.axis.map((v) => v.toFixed(3)).join(', '), undefined],
    ['螺旋轴过点', s.point.map((v) => v.toFixed(3)).join(', '), 'ok'],
    ['每转一圈前进', Number.isFinite(pitch) ? pitch.toFixed(4) : '∞（纯平移）', undefined],
    ['当前 u', u.toFixed(3), undefined],
  ];

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
  lines.forEach(([a, b, kind], i) => {
    const y = y0 + pad + lh * i + 5;
    ctx.textAlign = 'left';
    ctx.fillStyle = kind === 'ok' ? COL.ok : COL.dim;
    ctx.fillText(a, x0 + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = kind === 'ok' ? COL.ok : COL.text;
    ctx.fillText(b, x0 + wid - pad, y);
  });
}
