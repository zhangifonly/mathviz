/**
 * SO(3) 拓扑的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 画面构成:
 *   - 左: 提升道路在 S³ 上的立体投影(空间曲线)。单位元在原点(绿点),
 *         对跖点 −1 在无穷远 —— 于是"闭不闭合"看一眼就知道:
 *         偶数圈的曲线绕回原点, 奇数圈的一路奔出画面。
 *   - 右: 对应的物体姿态。整数圈时它总是回到原样 —— 提升不同、
 *         姿态相同, 这正是双重覆盖的意思。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import { drawAxes3D } from '../../lib/draw3d';
import {
  homotopyClass, isContractible, liftPath, projectedLift,
  rotateVec, stereographic, type Quat,
} from './so3Topology';

export interface DrawOpts {
  turns: number;
  /** 沿环路走到哪 0..1 */
  t: number;
  camYaw?: number;
  camPitch?: number;
  /** 只画提升曲线, 不画右侧物体 */
  liftOnly?: boolean;
  /** 旋转轴 */
  axis?: Vec3;
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  bad: '#f87171',
  lift: '#38bdf8',
  liftTail: '#a78bfa',
  identity: '#4ade80',
  head: '#fde047',
  bodyX: '#ef4444',
  bodyY: '#4ade80',
  bodyZ: '#60a5fa',
  flag: '#fde047',
  grid: '#1e293b',
};

export function drawSO3Topology(canvas: HTMLCanvasElement, opts: DrawOpts): void {
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

/**
 * 环路走到 t 处的姿态。统一走 liftPath 取样, 保证曲线上的动点、
 * 右侧物体、读数三者用的是同一个四元数(曲线带摆动, 各算各的会对不上)。
 */
function quatAt(turns: number, t: number, axis: Vec3): Quat {
  const path = liftPath(turns, axis, 480);
  const i = Math.max(0, Math.min(path.length - 1, Math.round(t * (path.length - 1))));
  return path[i].q;
}

/** 物体: 三轴 + 一面不对称的旗子(不对称才看得出转没转)。 */
const FLAG: Vec3[] = [
  [0, 0, 0.3], [0.7, 0, 0.85], [0.7, 0, 0.5], [0, 0, 0.1],
];

function drawBody(ctx: CanvasRenderingContext2D, cam: Camera, q: Quat): void {
  const pts = FLAG.map((p) => rotateVec(q, p));
  ctx.beginPath();
  pts.forEach((p, i) => {
    const s = project(p, cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(253,224,71,0.4)';
  ctx.fill();
  ctx.strokeStyle = COL.flag;
  ctx.lineWidth = 1.6;
  ctx.stroke();

  const axes: Array<[Vec3, string]> = [
    [[1.1, 0, 0], COL.bodyX], [[0, 1.1, 0], COL.bodyY], [[0, 0, 1.1], COL.bodyZ],
  ];
  for (const [v, col] of axes) {
    const w = rotateVec(q, v);
    line3(ctx, cam, [0, 0, 0], w, col, 2.4);
    dot3(ctx, cam, w, 3, col);
  }
}

/** 提升曲线: 分段画(每穿过一次 −1 就断一次), 并标出当前所在位置。 */
function drawLift(
  ctx: CanvasRenderingContext2D, cam: Camera, turns: number, t: number, axis: Vec3,
): void {
  const segs = projectedLift(turns, axis, 480, 5.5);
  segs.forEach((seg, si) => {
    ctx.strokeStyle = si % 2 === 0 ? COL.lift : COL.liftTail;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    seg.forEach((p, i) => {
      const s = project(p, cam);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.stroke();
  });

  // 单位元(道路起点)
  dot3(ctx, cam, [0, 0, 0], 5.5, COL.identity);
  const o = project([0, 0, 0], cam);
  ctx.fillStyle = COL.identity;
  ctx.font = '600 12.5px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('单位元 1', o.x + 9, o.y - 11);

  /*
   * 当前位置。⚠️ 必须走 liftPath 取样, 不能自己用固定轴另算一遍 ——
   * 曲线是带摆动的, 固定轴算出的点会飘到曲线外面去。
   */
  const path = liftPath(turns, axis, 480);
  const idx = Math.max(0, Math.min(path.length - 1, Math.round(t * (path.length - 1))));
  const cur = stereographic(path[idx].q, 5.5);
  if (cur) dot3(ctx, cam, cur, 4.5, COL.head);
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    turns, t, camYaw = 0.7, camPitch = 0.34,
    liftOnly = false, axis = [0, 0, 1],
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const leftCx = liftOnly ? w / 2 : w * 0.29;
  const camLift: Camera = makeCamera({
    yaw: camYaw, pitch: camPitch,
    cx: leftCx, cy: h * 0.47,
    scale: Math.min(liftOnly ? w : w / 2, h) / 6.6,
    dist: 16,
  });

  drawAxes3D(ctx, camLift, 2.4);
  drawLift(ctx, camLift, turns, t, axis);

  ctx.fillStyle = COL.lift;
  ctx.font = '600 13.5px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('提升到 S³（立体投影）', leftCx, 14);

  if (!liftOnly) {
    const camBody: Camera = makeCamera({
      yaw: camYaw, pitch: camPitch,
      cx: w * 0.74, cy: h * 0.47,
      scale: Math.min(w / 2, h) / 3.6,
      dist: 11,
    });
    drawBody(ctx, camBody, quatAt(turns, t, axis));
    ctx.fillStyle = COL.head;
    ctx.font = '600 13.5px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('物体的姿态', w * 0.74, 14);
  }

  drawReadout(ctx, h, turns, t, axis);
}

/** 左下读数。核心是提升终点的符号。 */
function drawReadout(
  ctx: CanvasRenderingContext2D, hCanvas: number, turns: number, t: number, axis: Vec3,
): void {
  const path = liftPath(turns, axis, 240);
  const end = path[path.length - 1].q;
  const cur = quatAt(turns, t, axis);
  const contractible = isContractible(turns);

  const lines: Array<[string, string, 'ok' | 'bad' | undefined]> = [
    ['转过', `${(turns * 360).toFixed(0)}°（${turns} 圈）`, undefined],
    ['当前提升 q', cur.map((v) => v.toFixed(3)).join(', '), undefined],
    ['提升终点 w', end[0].toFixed(6), contractible ? 'ok' : 'bad'],
    ['提升是否闭合', contractible ? '闭合（回到 +1）' : '不闭合（落在 −1）', contractible ? 'ok' : 'bad'],
    ['同伦类 π₁(SO(3))=ℤ₂', `[${homotopyClass(turns)}]`, contractible ? 'ok' : 'bad'],
    ['能否收缩成一点', contractible ? '能' : '不能', contractible ? 'ok' : 'bad'],
  ];

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
