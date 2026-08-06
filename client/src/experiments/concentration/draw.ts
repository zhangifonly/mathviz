/**
 * 集中不等式的 3D 绘图层。
 *
 * 用共享的 Canvas 3D 内核(proj3d), 不引 WebGL —— 讲解层可能同时有
 * 多个场景存活, WebGL 上下文有数量上限。
 *
 * 为什么用 3D: 界是 (n, t) 两个变量的函数。二维只能固定一个看另一个,
 * 而这门课的要点恰恰是**两个方向的衰减形状不同** ——
 *   沿 n: Chebyshev 是 1/n 的缓坡, Hoeffding 是指数的陡崖;
 *   沿 t: Chebyshev 是 1/t², Hoeffding 是 e^(−t²)。
 * 三张曲面叠在同一个 (n,t) 底面上, 高低关系就是"界有多松",
 * 而它们的**交线**就是交叉点随 t 变化的轨迹 —— 这条线在二维图里
 * 根本画不出来。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d';
import {
  allBounds, crossoverN, sampleSurface, type Setup, DEFAULT_SETUP,
} from './concentration';

export type SurfaceKind = 'exact' | 'chebyshev' | 'hoeffding';

export interface DrawOpts {
  /** 观察的容差 */
  t: number;
  /** n 轴上界 */
  nMax: number;
  setup?: Setup;
  camYaw?: number;
  camPitch?: number;
  /** 三张曲面各自的显示开关 */
  show?: [boolean, boolean, boolean];
  /** 画出当前 t 处的剖面线 */
  showSlice?: boolean;
}

const COL = {
  bg: '#0b1020',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
  bad: '#f87171',
  warn: '#fbbf24',
  grid: '#1e293b',
  axis: '#475569',
  exact: '#4ade80',
  chebyshev: '#fbbf24',
  hoeffding: '#38bdf8',
  slice: '#f472b6',
};

const KIND_COL: Record<SurfaceKind, string> = {
  exact: COL.exact,
  chebyshev: COL.chebyshev,
  hoeffding: COL.hoeffding,
};
const KIND_NAME: Record<SurfaceKind, string> = {
  exact: '真实尾概率',
  chebyshev: 'Chebyshev',
  hoeffding: 'Hoeffding',
};

const T_MIN = 0.04;
const T_MAX = 0.32;

export function drawConcentration(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
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

/**
 * 把 (n, t, 概率) 映到绘图坐标。
 *
 * ⚠️ 概率轴用**对数**。三个量跨越 1 到 1e−37 几十个数量级, 线性轴上
 * 除了最前面几步全都贴在底面, 什么也看不出来。取 log10 并截断到
 * −6, 衰减速度的差别才显出来 —— 这门课要看的正是"衰减多快"。
 */
function toXYZ(n: number, t: number, prob: number, nMax: number): Vec3 {
  const x = (n / nMax) * 2 - 1;
  const y = ((t - T_MIN) / (T_MAX - T_MIN)) * 2 - 1;
  const lp = Math.max(-6, Math.log10(Math.max(prob, 1e-300)));
  const z = (lp + 6) / 6; // 0..1
  return [x, y, z];
}

/**
 * 把一张曲面拆成带深度的四边形列表, **不直接绘制**。
 * 交给调用方与其他曲面合并后统一排序 —— 见 drawOn 里的说明。
 */
function collectQuads(
  grid: number[][], nMax: number, cam: Camera,
): Array<{ pts: Vec3[]; depth: number }> {
  const rows = grid.length;
  const cols = grid[0].length;
  const pt = (i: number, j: number): Vec3 => {
    const n = Math.max(1, Math.round((nMax * i) / (rows - 1)));
    const t = T_MIN + ((T_MAX - T_MIN) * j) / (cols - 1);
    return toXYZ(n, t, grid[i][j], nMax);
  };
  const out: Array<{ pts: Vec3[]; depth: number }> = [];
  for (let i = 0; i + 1 < rows; i++) {
    for (let j = 0; j + 1 < cols; j++) {
      const p = [pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)];
      const d = p.reduce((s, q) => s + project(q, cam).depth, 0) / 4;
      out.push({ pts: p, depth: d });
    }
  }
  return out;
}

/** 底面网格与三条轴。 */
function drawFrame(
  ctx: CanvasRenderingContext2D, cam: Camera, nMax: number,
): void {
  // 底面(z=0 即概率 1e−6)
  ctx.strokeStyle = COL.grid;
  for (let i = 0; i <= 6; i++) {
    const u = -1 + (2 * i) / 6;
    line3(ctx, cam, [u, -1, 0], [u, 1, 0], COL.grid, 0.8);
    line3(ctx, cam, [-1, u, 0], [1, u, 0], COL.grid, 0.8);
  }
  // 竖直标尺: 每个数量级一条
  for (let k = 0; k <= 6; k++) {
    const z = k / 6;
    line3(ctx, cam, [-1, -1, z], [1, -1, z], COL.grid, 0.6);
    const s = project([-1, -1, z], cam);
    ctx.fillStyle = COL.dim;
    ctx.font = '10.5px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(k === 6 ? '1' : `1e−${6 - k}`, s.x - 6, s.y);
  }
  // 轴标签
  const lx = project([1, -1, 0], cam);
  ctx.fillStyle = COL.dim;
  ctx.font = '600 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`n → ${nMax}`, lx.x + 6, lx.y + 8);
  const ly = project([-1, 1, 0], cam);
  ctx.fillText(`t → ${T_MAX}`, ly.x - 4, ly.y + 10);
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    t, nMax, setup = DEFAULT_SETUP,
    camYaw = 0.82, camPitch = 0.42,
    show = [true, true, true], showSlice = true,
  } = opts;

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const cam: Camera = makeCamera({
    yaw: camYaw, pitch: camPitch, cx: w * 0.52, cy: h * 0.54,
    scale: Math.min(w, h) * 0.34, dist: 9,
  });

  drawFrame(ctx, cam, nMax);

  /*
   * ⚠️ 三张曲面必须**合并后统一按深度排序**再画。
   * 我原来是一张张地画(每张内部排序), 结果最后画的那张整体盖住前面
   * 两张 —— 截图里绿色的"真实概率"浮在黄色 Chebyshev 之上, 看着像
   * 真实值超过了上界, 与数据完全相反(实测绿色处处最低)。
   * 这是画家算法的经典坑: 逐张画等于按"图层"而不是按"深度"排序。
   */
  const kinds: SurfaceKind[] = ['chebyshev', 'hoeffding', 'exact'];
  const alphas: Record<SurfaceKind, number> = {
    chebyshev: 0.3, hoeffding: 0.3, exact: 0.45,
  };
  const all: Array<{ pts: Vec3[]; depth: number; col: string; alpha: number }> = [];
  kinds.forEach((k) => {
    const idx = k === 'exact' ? 0 : k === 'chebyshev' ? 1 : 2;
    if (!show[idx]) return;
    const g = sampleSurface(k, 1, nMax, T_MIN, T_MAX, 22, 22, setup);
    collectQuads(g, nMax, cam).forEach((q) => {
      all.push({ ...q, col: KIND_COL[k], alpha: alphas[k] });
    });
  });
  all.sort((a, b) => b.depth - a.depth);
  ctx.lineWidth = 0.5;
  for (const q of all) {
    ctx.globalAlpha = q.alpha;
    ctx.fillStyle = q.col;
    ctx.strokeStyle = q.col;
    ctx.beginPath();
    q.pts.forEach((p, k) => {
      const s = project(p, cam);
      if (k === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // 当前 t 处的剖面线: 三条曲线沿 n 走
  if (showSlice) {
    for (const k of kinds) {
      const idx = k === 'exact' ? 0 : k === 'chebyshev' ? 1 : 2;
      if (!show[idx]) continue;
      ctx.strokeStyle = KIND_COL[k];
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const n = Math.max(1, Math.round((nMax * i) / 60));
        const b = allBounds(n, t, setup);
        const v = k === 'exact' ? b.exact : k === 'chebyshev' ? b.chebyshev : b.hoeffding;
        const s = project(toXYZ(n, t, v, nMax), cam);
        if (i === 0) ctx.moveTo(s.x, s.y);
        else ctx.lineTo(s.x, s.y);
      }
      ctx.stroke();
    }
    // 剖面所在的 t 位置, 用一条竖线标出
    const y = ((t - T_MIN) / (T_MAX - T_MIN)) * 2 - 1;
    ctx.setLineDash([4, 4]);
    line3(ctx, cam, [-1, y, 0], [1, y, 0], COL.slice, 1.6);
    ctx.setLineDash([]);
    const sp = project([1, y, 0], cam);
    ctx.fillStyle = COL.slice;
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`t = ${t.toFixed(2)}`, sp.x + 6, sp.y);
  }

  drawReadout(ctx, w, h, t, nMax, setup, show);
}

function drawReadout(
  ctx: CanvasRenderingContext2D, w: number, hCanvas: number,
  t: number, nMax: number, setup: Setup, show: [boolean, boolean, boolean],
): void {
  const nHere = Math.round(nMax / 2);
  const b = allBounds(nHere, t, setup);
  const cross = crossoverN(t, setup);
  const tighter = b.chebyshev < b.hoeffding ? 'Chebyshev' : 'Hoeffding';

  const lines: Array<[string, string, 'ok' | 'bad' | undefined]> = [
    [`在 n = ${nHere}, t = ${t.toFixed(2)} 处`, '', undefined],
    ['真实尾概率', b.exact.toExponential(3), 'ok'],
    ['Chebyshev', b.chebyshev.toExponential(3), undefined],
    ['Hoeffding', b.hoeffding.toExponential(3), undefined],
    ['谁更紧', tighter, undefined],
    ['交叉点 n', cross === null ? '不交叉' : cross.toFixed(1), 'bad'],
    ['界的松紧比', (Math.min(b.chebyshev, b.hoeffding) / Math.max(b.exact, 1e-300)).toExponential(2), undefined],
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
    const col = k === 'ok' ? COL.ok : k === 'bad' ? COL.warn : undefined;
    ctx.textAlign = 'left';
    ctx.fillStyle = col ?? COL.dim;
    ctx.fillText(a, px + pad, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = col ?? COL.text;
    ctx.fillText(v, px + wid - pad, y);
  });

  // 右上角图例
  const items: SurfaceKind[] = ['exact', 'chebyshev', 'hoeffding'];
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
    const idx = k === 'exact' ? 0 : k === 'chebyshev' ? 1 : 2;
    const y = 14 + 8 + 22 * i + 11;
    ctx.globalAlpha = show[idx] ? 1 : 0.3;
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
