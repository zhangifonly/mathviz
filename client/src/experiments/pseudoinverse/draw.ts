/**
 * 伪逆的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 两幅并排的图, 正对应伪逆做的两件事:
 *
 *   左「b 的世界」: 画列空间(秩 1 是直线, 秩 2 是平面), b, 以及 b 在
 *     列空间上的投影 Ax⁺。两者之差就是残差, 且与列空间垂直 —— 这就是
 *     "残差最小"的几何含义。
 *
 *   右「x 的世界」: 画零空间(解沿它平移不改残差)与行空间, 以及 x⁺。
 *     x⁺ 一定落在行空间里、与零空间垂直 —— 这就是"范数最小"的来源。
 *     沿零空间挪一挪, 画面上能直接看到向量变长。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import { drawAxes3D } from '../../lib/draw3d';
import {
  add3, columnSpaceBasis, matVec, norm3, nullSpaceBasis,
  pinvSolve, projections, residual, rowSpaceBasis, scale3, sub3, svd,
  type Mat3,
} from './pseudoinverse';

export interface DrawOpts {
  A: Mat3;
  b: Vec3;
  camYaw?: number;
  camPitch?: number;
  /** 沿零空间方向平移解的量, 用来演示"挪了就变长" */
  nullShift?: number;
  /** 只画左图/右图/两张 */
  panel?: 'both' | 'b' | 'x';
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  bad: '#f87171',
  colSpace: '#38bdf8',
  rowSpace: '#4ade80',
  nullSpace: '#f472b6',
  bVec: '#fbbf24',
  proj: '#4ade80',
  resid: '#f87171',
  xVec: '#fde047',
  xShift: '#fb923c',
};

export function drawPseudoinverse(canvas: HTMLCanvasElement, opts: DrawOpts): void {
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

/**
 * 画一个子空间: 0 维不画, 1 维画直线, 2 维画带网格的平面片。
 * 用同一个函数处理三种维数, 因为本课的重点正是"维数会变"。
 */
function subspace3(
  ctx: CanvasRenderingContext2D, cam: Camera, basis: Vec3[], size: number,
  col: string, fill: string,
): void {
  if (basis.length === 0) return;
  if (basis.length === 1) {
    const u = basis[0];
    line3(ctx, cam, scale3(u, -size), scale3(u, size), col, 2.4);
    return;
  }
  const [u, v] = basis;
  // 平面片的四角
  const corners: Vec3[] = [
    add3(scale3(u, -size), scale3(v, -size)),
    add3(scale3(u, size), scale3(v, -size)),
    add3(scale3(u, size), scale3(v, size)),
    add3(scale3(u, -size), scale3(v, size)),
  ];
  ctx.beginPath();
  corners.forEach((c, i) => {
    const s = project(c, cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  // 网格线, 让平面看着像平面
  const n = 4;
  ctx.strokeStyle = col;
  ctx.lineWidth = 0.7;
  ctx.globalAlpha = 0.5;
  for (let i = -n; i <= n; i++) {
    const t = (i / n) * size;
    line3(ctx, cam, add3(scale3(u, t), scale3(v, -size)), add3(scale3(u, t), scale3(v, size)), col, 0.7);
    line3(ctx, cam, add3(scale3(u, -size), scale3(v, t)), add3(scale3(u, size), scale3(v, t)), col, 0.7);
  }
  ctx.globalAlpha = 1;
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    A, b, camYaw = 0.72, camPitch = 0.4, nullShift = 0, panel = 'both',
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const x0 = pinvSolve(A, b);
  const nulls = nullSpaceBasis(A);
  // 沿零空间平移后的解, 用来演示"挪了就变长, 残差却不变"
  const x = nulls.length > 0 && nullShift !== 0
    ? add3(x0, scale3(nulls[0], nullShift))
    : x0;
  const proj = matVec(A, x0);
  const rank = svd(A).rank;

  /*
   * 两侧共用一个缩放。
   * b 与 x 的量级可以差很多(比如 A 很小时 x 会很大), 但如果各自
   * 归一化, "残差有多长""解有多长"这两件要比较的事就没法比了。
   */
  const reach = Math.max(
    norm3(b), norm3(x), norm3(x0), norm3(proj), 1,
  ) * 1.35;
  /*
   * ⚠️ 子空间的面片不能画得比向量大太多。
   * 原来面片取 reach*0.85, 而向量长度本身就 ≈reach/1.35, 结果整幅图
   * 被两张大平行四边形占满, b、Ax⁺、x⁺ 全挤成中间一小撮, 谁是谁根本
   * 分不出。让面片只比向量略大一点, 主角还是向量。
   */
  const planeSize = reach * 0.55;

  const showB = panel === 'both' || panel === 'b';
  const showX = panel === 'both' || panel === 'x';
  const single = panel !== 'both';
  // 0.36 太保守, 内容只占中间一条带; 面片已缩小, 可以放到 0.46
  const scale = (Math.min(single ? w : w / 2, h) * 0.46) / reach;

  if (showB) {
    const cam = makeCamera({
      yaw: camYaw, pitch: camPitch,
      cx: single ? w / 2 : w * 0.27, cy: h * 0.48,
      scale, dist: reach * 6,
    });
    drawAxes3D(ctx, cam, reach * 0.5);
    // 列空间
    subspace3(ctx, cam, columnSpaceBasis(A), planeSize, COL.colSpace, 'rgba(56,189,248,0.12)');
    // b、投影、残差
    arrow3(ctx, cam, [0, 0, 0], b, COL.bVec, 2.8);
    label3(ctx, cam, b, 'b', COL.bVec);
    arrow3(ctx, cam, [0, 0, 0], proj, COL.proj, 2.4);
    label3(ctx, cam, proj, 'Ax⁺（投影）', COL.proj, 8, 10);
    ctx.setLineDash([5, 4]);
    line3(ctx, cam, proj, b, COL.resid, 2);
    ctx.setLineDash([]);

    ctx.fillStyle = COL.colSpace;
    ctx.font = '600 13.5px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`b 的世界：列空间（${rank} 维）`, single ? w / 2 : w * 0.27, 14);
  }

  if (showX) {
    const cam = makeCamera({
      yaw: camYaw, pitch: camPitch,
      cx: single ? w / 2 : w * 0.74, cy: h * 0.48,
      scale, dist: reach * 6,
    });
    drawAxes3D(ctx, cam, reach * 0.5);
    // 零空间(粉)与行空间(绿)
    subspace3(ctx, cam, nulls, planeSize, COL.nullSpace, 'rgba(244,114,182,0.12)');
    subspace3(ctx, cam, rowSpaceBasis(A), planeSize * 0.82, COL.rowSpace, 'rgba(74,222,128,0.10)');
    // x⁺ 与被挪过的解
    arrow3(ctx, cam, [0, 0, 0], x0, COL.xVec, 2.8);
    label3(ctx, cam, x0, 'x⁺（最短）', COL.xVec);
    if (nullShift !== 0 && nulls.length > 0) {
      arrow3(ctx, cam, [0, 0, 0], x, COL.xShift, 2.2);
      label3(ctx, cam, x, '挪过的解', COL.xShift, 8, 12);
      ctx.setLineDash([4, 4]);
      line3(ctx, cam, x0, x, COL.xShift, 1.4);
      ctx.setLineDash([]);
    }

    ctx.fillStyle = COL.rowSpace;
    ctx.font = '600 13.5px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`x 的世界：零空间（${3 - rank} 维）`, single ? w / 2 : w * 0.74, 14);
  }

  drawReadout(ctx, h, A, b, x0, x, rank, nullShift);
}

function drawReadout(
  ctx: CanvasRenderingContext2D, hCanvas: number, A: Mat3, b: Vec3,
  x0: Vec3, x: Vec3, rank: number, nullShift: number,
): void {
  const r0 = residual(A, x0, b);
  const rx = residual(A, x, b);
  const moved = nullShift !== 0 && norm3(sub3(x, x0)) > 1e-12;
  const consistent = r0 < 1e-8;

  const lines: Array<[string, string, 'ok' | 'bad' | undefined]> = [
    ['秩', `${rank} / 3`, undefined],
    ['解空间维数', `${3 - rank}`, undefined],
    ['x⁺', x0.map((v) => v.toFixed(3)).join(', '), undefined],
    ['|x⁺|', norm3(x0).toFixed(6), 'ok'],
    ['残差 |Ax⁺−b|', r0.toExponential(3), consistent ? 'ok' : undefined],
    ['方程组', consistent ? '相容（残差为 0）' : '不相容（只能投影）', consistent ? 'ok' : 'bad'],
  ];
  if (moved) {
    lines.push(['沿零空间挪动后 |x|', norm3(x).toFixed(6), 'bad']);
    lines.push(['挪动后残差', rx.toExponential(3), 'ok']);
    lines.push(['结论', '残差不变，范数变大', undefined]);
  }
  const { toCol, toRow } = projections(A);
  lines.push([
    'tr(AA⁺) / tr(A⁺A)',
    `${(toCol[0][0] + toCol[1][1] + toCol[2][2]).toFixed(3)} / ${(toRow[0][0] + toRow[1][1] + toRow[2][2]).toFixed(3)}`,
    'ok',
  ]);

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
    const col = k === 'ok' ? COL.ok : k === 'bad' ? COL.bad : undefined;
    ctx.textAlign = 'left';
    ctx.fillStyle = col ?? COL.dim;
    ctx.fillText(a, px + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = col ?? COL.text;
    ctx.fillText(v, px + wid - pad, y);
  });
}
