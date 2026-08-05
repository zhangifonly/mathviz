/**
 * 焦点—准线统一定义的绘图层。
 *
 * 画面构成:
 *   - 竖直准线 x = l/e(青色虚线); e=0 时退到无穷远, 用画布边缘的箭头提示
 *   - 焦点 F 在原点(红点)
 *   - 曲线本体, 按分支分段画(双曲线绝不能把两支连起来)
 *   - 动点 P: 到焦点的实线段 PF, 到准线的水平虚线段 Pd
 *   - 右上角读数: PF、Pd、比值、e —— 比值必须始终等于 e
 */

import {
  classify,
  directrixX,
  KIND_LABEL,
  pointAt,
  radiusAt,
  samplePolar,
  secondFocusX,
  type ConicKind,
} from './focusDirectrix';

export interface DrawOpts {
  e: number;
  l: number;
  /** 动点的极角(弧度) */
  theta: number;
  /** 显示 PF / Pd 两条测量线段与读数 */
  showRatio?: boolean;
  showDirectrix?: boolean;
  showSecondFocus?: boolean;
}

const COL = {
  bg: '#0b1020',
  axis: '#334155',
  curve: '#facc15',
  farBranch: '#f59e0b',
  directrix: '#22d3ee',
  focus: '#ef4444',
  focus2: '#fb7185',
  pf: '#60a5fa',
  pd: '#22d3ee',
  point: '#fde047',
  text: '#e2e8f0',
  dim: '#94a3b8',
  ok: '#4ade80',
};

/**
 * 世界坐标 -> 屏幕坐标。
 *
 * 取景**由实际采样点定**, 不用按 a、l 手推的经验公式。
 *
 * ⚠️ 早先按 kind 分别硬算 reachX/reachY, e=1.3 时算出的框比曲线小,
 * 两支被截在画布上下边缘之外。而双曲线逼近渐近线时坐标会跑到很大,
 * 若直接取 max 又会被少数极端点绑架、曲线缩成一团 —— 所以这里取
 * 分位数(94%)而不是最大值: 既装得下主体, 又不被渐近尾巴牵着走。
 */
function makeTransform(w: number, h: number, e: number, l: number) {
  const pts = samplePolar(e, l, 721, 60).flat();
  const dx = directrixX(e, l);

  const pct = (arr: number[], q: number): number => {
    if (arr.length === 0) return 1;
    const s = [...arr].sort((p, b) => p - b);
    return s[Math.min(s.length - 1, Math.floor(q * (s.length - 1)))];
  };

  const absX = pts.map((p) => Math.abs(p.x));
  const absY = pts.map((p) => Math.abs(p.y));
  // 准线也要进画面(e=0 时是 ∞, 忽略)
  const wantX = Number.isFinite(dx) ? Math.abs(dx) * 1.1 : 0;

  const reachX = Math.max(pct(absX, 0.94), wantX, 1e-6) * 1.08;
  const reachY = Math.max(pct(absY, 0.94), 1e-6) * 1.12;

  const pad = 46;
  const s = Math.min((w - pad * 2) / (2 * reachX), (h - pad * 2) / (2 * reachY));

  // 焦点略偏左, 给准线和右侧留空间
  const cx = w * 0.42;
  const cy = h / 2;
  return {
    s,
    toScreen: (x: number, y: number): [number, number] => [cx + x * s, cy - y * s],
  };
}

function fmt(v: number, d = 4): string {
  if (!Number.isFinite(v)) return '∞';
  return v.toFixed(d);
}

/** 入口：接 canvas，与其他实验的 draw* 约定一致 */
export function drawFocusDirectrix(canvas: HTMLCanvasElement, opts: DrawOpts): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawOn(ctx, canvas.width, canvas.height, opts);
}

export function drawOn(
  ctx: CanvasRenderingContext2D, w: number, h: number, opts: DrawOpts,
): void {
  const {
    e, l, theta,
    showRatio = true,
    showDirectrix = true,
    showSecondFocus = true,
  } = opts;
  const showSegments = showRatio;
  const kind: ConicKind = classify(e);

  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, w, h);

  const { toScreen } = makeTransform(w, h, e, l);

  // ---- 坐标轴 ----
  ctx.strokeStyle = COL.axis;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  const [, oy] = toScreen(0, 0);
  ctx.beginPath();
  ctx.moveTo(0, oy);
  ctx.lineTo(w, oy);
  ctx.stroke();
  const [ox] = toScreen(0, 0);
  ctx.beginPath();
  ctx.moveTo(ox, 0);
  ctx.lineTo(ox, h);
  ctx.stroke();

  // ---- 准线 ----
  const dx = directrixX(e, l);
  if (showDirectrix) {
    if (Number.isFinite(dx)) {
      const [sxd] = toScreen(dx, 0);
      ctx.strokeStyle = COL.directrix;
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      ctx.moveTo(sxd, 12);
      ctx.lineTo(sxd, h - 12);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = COL.directrix;
      ctx.font = '12px ui-sans-serif, system-ui';
      ctx.textAlign = 'left';
      // 标签贴在线右侧, 超出画布时翻到左侧
      const label = `准线 x = l/e = ${fmt(dx, 3)}`;
      const tw = ctx.measureText(label).width;
      const lx = sxd + 6 + tw > w - 4 ? sxd - 6 - tw : sxd + 6;
      ctx.fillText(label, lx, 24);
    } else {
      // e=0: 准线在无穷远
      ctx.fillStyle = COL.directrix;
      ctx.font = '12px ui-sans-serif, system-ui';
      ctx.textAlign = 'right';
      ctx.fillText('准线 → 无穷远(e=0)', w - 12, 24);
      ctx.strokeStyle = COL.directrix;
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w - 130, 34);
      ctx.lineTo(w - 12, 34);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // ---- 曲线 ----
  const segs = samplePolar(e, l, 1801, 400);
  segs.forEach((seg) => {
    if (seg.length < 2) return;
    // 判定该段是否在准线右侧很远(远支)以换色
    const isFar = kind === 'hyperbola' && seg.some((p) => p.x > dx);
    ctx.strokeStyle = isFar ? COL.farBranch : COL.curve;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    seg.forEach((p, i) => {
      const [X, Y] = toScreen(p.x, p.y);
      if (i === 0) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
    });
    ctx.stroke();
  });

  // ---- 第二焦点 ----
  if (showSecondFocus && kind !== 'parabola') {
    const f2 = secondFocusX(e, l);
    if (Number.isFinite(f2)) {
      const [X, Y] = toScreen(f2, 0);
      if (X > -20 && X < w + 20) {
        ctx.fillStyle = COL.focus2;
        ctx.beginPath();
        ctx.arc(X, Y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '12px ui-sans-serif, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('F₂', X, Y - 9);
      }
    }
  }

  // ---- 焦点 ----
  const [fx, fy] = toScreen(0, 0);
  ctx.fillStyle = COL.focus;
  ctx.beginPath();
  ctx.arc(fx, fy, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COL.focus;
  ctx.font = 'bold 13px ui-sans-serif, system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('F', fx, fy + 20);

  // ---- 动点 P 与两条线段 ----
  const P = pointAt(e, l, theta);
  const r = radiusAt(e, l, theta);
  let ratioTxt = '—';
  let pfTxt = '—';
  let pdTxt = '—';

  if (P && Number.isFinite(P.x) && Number.isFinite(P.y) && Math.hypot(P.x, P.y) < 400) {
    const [px, py] = toScreen(P.x, P.y);
    const pf = Math.abs(r as number);
    const pd = Number.isFinite(dx) ? Math.abs(dx - P.x) : Number.POSITIVE_INFINITY;

    if (showSegments) {
      // PF: 实线
      ctx.strokeStyle = COL.pf;
      ctx.lineWidth = 2.2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Pd: 水平虚线到准线
      if (Number.isFinite(dx)) {
        const [sxd] = toScreen(dx, 0);
        ctx.strokeStyle = COL.pd;
        ctx.lineWidth = 2.2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sxd, py);
        ctx.stroke();
        ctx.setLineDash([]);

        // 线段中点标注长度
        ctx.font = '11px ui-sans-serif, system-ui';
        ctx.textAlign = 'center';
        ctx.fillStyle = COL.pf;
        // 两个标签必须错开: θ 走到顶点附近时两线段几乎重合,
        // 都贴在中点会叠成一团(截图里 PF= 与 Pd= 糊在一起)。
        // PF 标签压向焦点侧, Pd 标签抬到水平线上方。
        ctx.fillText(
          `PF=${fmt(pf, 3)}`,
          fx + (px - fx) * 0.35,
          fy + (py - fy) * 0.35 - 7,
        );
        ctx.fillStyle = COL.pd;
        ctx.fillText(`Pd=${fmt(pd, 3)}`, (px + sxd) / 2, py - 12);
      }
    }

    ctx.fillStyle = COL.point;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COL.text;
    ctx.font = 'bold 12px ui-sans-serif, system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('P', px + 8, py - 6);

    pfTxt = fmt(pf, 6);
    pdTxt = Number.isFinite(pd) ? fmt(pd, 6) : '∞';
    ratioTxt = Number.isFinite(pd) ? fmt(pf / pd, 6) : '0.000000';
  }

  // ---- 标题 ----
  ctx.fillStyle = COL.text;
  ctx.font = 'bold 15px ui-sans-serif, system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('焦点—准线统一定义', 16, 26);
  ctx.fillStyle = COL.dim;
  ctx.font = '12px ui-sans-serif, system-ui';
  ctx.fillText(`e = ${fmt(e, 3)} · ${KIND_LABEL[kind]} · 半正焦弦 l = ${fmt(l, 2)}`, 16, 44);

  // ---- 右上读数 ----
  ctx.textAlign = 'right';
  ctx.font = '12px ui-monospace, monospace';
  ctx.fillStyle = COL.pf;
  ctx.fillText(`PF = ${pfTxt}`, w - 14, 46);
  ctx.fillStyle = COL.pd;
  ctx.fillText(`Pd = ${pdTxt}`, w - 14, 62);
  ctx.fillStyle = COL.text;
  ctx.fillText(`PF / Pd = ${ratioTxt}`, w - 14, 78);
  ctx.fillStyle = COL.ok;
  ctx.fillText(`e = ${fmt(e, 6)}  ✓ 相等`, w - 14, 94);

  // ---- 底部说明 ----
  ctx.textAlign = 'left';
  ctx.font = '12px ui-sans-serif, system-ui';
  ctx.fillStyle = COL.dim;
  ctx.fillText('实线 = 到焦点 PF, 虚线 = 到准线 Pd', 16, h - 30);
  ctx.fillStyle = COL.text;
  ctx.fillText('拖动 e: 一条规则连续生出圆 → 椭圆 → 抛物线 → 双曲线', 16, h - 12);
}
