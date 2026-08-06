/**
 * 熵与编码的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 为什么用 3D: 三元信源的概率分布住在**单纯形**上(p₁+p₂+p₃=1 的
 * 三角形)。熵是这张三角形上的一个高度场 —— 中心最高(最不确定),
 * 三个顶点为零(完全确定)。把 H 与哈夫曼码长两张曲面叠起来,
 * 缺口在哪大、哪里为零, 一眼可辨。
 *
 * 关键的一点: 熵曲面是**光滑的穹顶**, 码长曲面是**阶梯**(码长只能取
 * 整数)。两者的形状差异正是"整数约束造成浪费"的可视化。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import {
  entropy, huffmanAverageLength, huffmanLengths, redundancy,
  sampleSimplex, type Dist,
} from './entropyCoding';

export type SurfaceKind = 'entropy' | 'huffman' | 'redundancy';

export interface DrawOpts {
  /** 高亮的分布(在单纯形上标出) */
  p: Dist;
  camYaw?: number;
  camPitch?: number;
  /** 三张曲面的显示开关 [熵, 码长, 冗余] */
  show?: [boolean, boolean, boolean];
  /** 网格精度 */
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
  vertex: '#64748b',
  entropy: '#4ade80',
  huffman: '#fbbf24',
  redundancy: '#f472b6',
  marker: '#fde047',
};

const KIND_COL: Record<SurfaceKind, string> = {
  entropy: COL.entropy,
  huffman: COL.huffman,
  redundancy: COL.redundancy,
};
const KIND_NAME: Record<SurfaceKind, string> = {
  entropy: '熵 H(p)',
  huffman: '哈夫曼码长 L',
  redundancy: '冗余 L − H',
};

/** 高度轴的比例: 最大值约 log2(3)=1.585, 码长到 2 */
const Z_SCALE = 0.62;

export function drawEntropyCoding(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
}

/**
 * 把 (p₁,p₂,p₃, 高度) 映到绘图坐标。
 *
 * 单纯形用**等边三角形**铺在 xy 平面上, 而不是直接用 (p₁,p₂,p₃)
 * 当三维坐标 —— 后者会把三角形斜着放, 高度轴与它不垂直, 看起来
 * 别扭且不好比较高度。等边三角形 + 竖直高度轴, 才是标准画法。
 */
function toXYZ(p: Dist, height: number): Vec3 {
  // 三个顶点的平面坐标(等边三角形, 重心在原点)
  const V: Array<[number, number]> = [
    [0, 1],
    [-Math.sqrt(3) / 2, -0.5],
    [Math.sqrt(3) / 2, -0.5],
  ];
  const x = p[0] * V[0][0] + p[1] * V[1][0] + p[2] * V[2][0];
  const y = p[0] * V[0][1] + p[1] * V[1][1] + p[2] * V[2][1];
  return [x, y, height * Z_SCALE];
}

function line3(ctx: CanvasRenderingContext2D, cam: Camera, a: Vec3, b: Vec3, col: string, w = 1): void {
  const p = project(a, cam);
  const q = project(b, cam);
  ctx.strokeStyle = col;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(q.x, q.y);
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

/** 底面的单纯形边框与网格。 */
function drawBase(ctx: CanvasRenderingContext2D, cam: Camera): void {
  const V: Dist[] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  ctx.beginPath();
  V.forEach((v, i) => {
    const s = project(toXYZ(v, 0), cam);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(51,65,85,0.3)';
  ctx.fill();
  ctx.strokeStyle = COL.grid;
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // 等分网格
  const n = 6;
  ctx.globalAlpha = 0.55;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    for (const [a, b, c] of [[0, 1, 2], [1, 2, 0], [2, 0, 1]]) {
      const p1: Dist = [0, 0, 0];
      const p2: Dist = [0, 0, 0];
      p1[a] = t; p1[b] = 1 - t;
      p2[a] = t; p2[c] = 1 - t;
      line3(ctx, cam, toXYZ(p1, 0), toXYZ(p2, 0), COL.grid, 0.6);
    }
  }
  ctx.globalAlpha = 1;

  const names = ['p₁=1', 'p₂=1', 'p₃=1'];
  V.forEach((v, i) => {
    const s = project(toXYZ(v, 0), cam);
    ctx.fillStyle = COL.vertex;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 3.2, 0, Math.PI * 2);
    ctx.fill();
    label3(ctx, cam, toXYZ(v, 0), names[i], COL.vertex, 7, 9);
  });
}

/** 收集一张曲面的四边形(带深度), 不直接绘制 —— 交给调用方统一排序。 */
function collectQuads(
  kind: SurfaceKind, res: number, cam: Camera,
): Array<{ pts: Vec3[]; depth: number }> {
  const g = sampleSimplex(kind, res);
  const out: Array<{ pts: Vec3[]; depth: number }> = [];
  for (let i = 0; i + 1 < g.length; i++) {
    for (let j = 0; j + 1 < g[i].length; j++) {
      const cells = [g[i][j], g[i + 1][j], g[i + 1][j + 1], g[i][j + 1]];
      const pts = cells.map((c) => toXYZ(c.p, c.value));
      /*
       * ⚠️ 折叠网格的接缝要跳过。sampleSimplex 把正方形折进三角形,
       * 折线两侧的相邻格点在单纯形上其实离得很远, 连成的四边形会横跨
       * 整个三角形, 画出来是一片乱飞的薄片。用底面上的边长做判据:
       * 明显超过一格的就是接缝, 丢掉。
       */
      const cell = 2.2 / res;
      let seam = false;
      for (let k = 0; k < 4; k++) {
        const a = pts[k];
        const b = pts[(k + 1) % 4];
        if (Math.hypot(a[0] - b[0], a[1] - b[1]) > cell * 2.5) seam = true;
      }
      if (seam) continue;
      const depth = pts.reduce((s, q) => s + project(q, cam).depth, 0) / 4;
      out.push({ pts, depth });
    }
  }
  return out;
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    p, camYaw = 0.68, camPitch = 0.44,
    show = [true, true, false], res = 26,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const cam: Camera = makeCamera({
    yaw: camYaw, pitch: camPitch, cx: w * 0.5, cy: h * 0.56,
    scale: Math.min(w, h) * 0.36, dist: 8,
  });

  drawBase(ctx, cam);

  // 三张曲面合并后统一按深度排序 —— 逐张画会让后画的整体盖住前面的
  const kinds: SurfaceKind[] = ['entropy', 'huffman', 'redundancy'];
  const alphas: Record<SurfaceKind, number> = {
    entropy: 0.5, huffman: 0.4, redundancy: 0.5,
  };
  const all: Array<{ pts: Vec3[]; depth: number; col: string; alpha: number }> = [];
  kinds.forEach((k, idx) => {
    if (!show[idx]) return;
    for (const q of collectQuads(k, res, cam)) {
      all.push({ ...q, col: KIND_COL[k], alpha: alphas[k] });
    }
  });
  all.sort((a, b) => b.depth - a.depth);
  ctx.lineWidth = 0.4;
  for (const q of all) {
    ctx.globalAlpha = q.alpha;
    ctx.fillStyle = q.col;
    ctx.strokeStyle = q.col;
    ctx.beginPath();
    q.pts.forEach((pt, k) => {
      const s = project(pt, cam);
      if (k === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // 当前分布: 从底面竖一根线到两条曲面
  const H = entropy(p);
  const L = huffmanAverageLength(p);
  const base = toXYZ(p, 0);
  ctx.setLineDash([3, 3]);
  line3(ctx, cam, base, toXYZ(p, Math.max(H, L)), COL.marker, 1.4);
  ctx.setLineDash([]);
  for (const [v, col, name] of [[H, COL.entropy, 'H'], [L, COL.huffman, 'L']] as Array<[number, string, string]>) {
    const s = project(toXYZ(p, v), cam);
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COL.bg;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    label3(ctx, cam, toXYZ(p, v), `${name}=${v.toFixed(3)}`, col, 9, name === 'H' ? 8 : -8);
  }
  const bs = project(base, cam);
  ctx.fillStyle = COL.marker;
  ctx.beginPath();
  ctx.arc(bs.x, bs.y, 4, 0, Math.PI * 2);
  ctx.fill();

  drawReadout(ctx, w, h, p, show);
}

function drawReadout(
  ctx: CanvasRenderingContext2D, w: number, hCanvas: number,
  p: Dist, show: [boolean, boolean, boolean],
): void {
  const H = entropy(p);
  const L = huffmanAverageLength(p);
  const r = redundancy(p);
  const lens = huffmanLengths(p);

  const lines: Array<[string, string, 'ok' | 'warn' | undefined]> = [
    ['分布 p', p.map((v) => v.toFixed(3)).join(', '), undefined],
    ['熵 H(p)', `${H.toFixed(5)} 比特`, 'ok'],
    ['哈夫曼码长', lens.join(', '), undefined],
    ['平均码长 L', L.toFixed(5), undefined],
    ['冗余 L − H', r.toFixed(5), r < 1e-9 ? 'ok' : 'warn'],
    ['定理 H ≤ L < H+1', L >= H - 1e-12 && L < H + 1 ? '成立' : '失效', 'ok'],
  ];

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
    const col = k === 'ok' ? COL.ok : k === 'warn' ? COL.warn : undefined;
    ctx.textAlign = 'left';
    ctx.fillStyle = col ?? COL.dim;
    ctx.fillText(a, px + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = col ?? COL.text;
    ctx.fillText(v, px + wid - pad, y);
  });

  // 图例
  const items: SurfaceKind[] = ['entropy', 'huffman', 'redundancy'];
  ctx.font = '12.5px system-ui, sans-serif';
  const lw = Math.max(...items.map((k) => ctx.measureText(KIND_NAME[k]).width)) + 44;
  const lx = w - lw - 14;
  ctx.fillStyle = 'rgba(15,23,42,0.86)';
  ctx.strokeStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(lx, 14, lw, items.length * 22 + 16, 8);
  ctx.fill();
  ctx.stroke();
  items.forEach((k, i) => {
    const y = 14 + 8 + 22 * i + 11;
    ctx.globalAlpha = show[i] ? 1 : 0.3;
    ctx.fillStyle = KIND_COL[k];
    ctx.beginPath();
    ctx.roundRect(lx + 12, y - 5, 16, 10, 3);
    ctx.fill();
    ctx.fillStyle = COL.text;
    ctx.textAlign = 'left';
    ctx.fillText(KIND_NAME[k], lx + 34, y);
    ctx.globalAlpha = 1;
  });
}
