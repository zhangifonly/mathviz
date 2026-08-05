/**
 * Prismatoid 公式的 Canvas 绘制
 *
 * 左半边画立体（一叠薄片），右半边画 A(t) 曲线与三个采样点。
 * 把「三点」标在曲线上，再用一条抛物线穿过它们 —— 公式精确成立时
 * 抛物线与真实 A(t) 完全重合，四次情形则会明显分开。
 * 这样"为什么只量三个截面就够"变成了一眼可见的图像事实。
 */

import { prismatoidVolume, integrate, type Prismatoid } from './prismatoid'

export interface DrawOptions {
  solid: Prismatoid
  /** 高亮的采样点索引：0 下、1 中、2 上、null 全显 */
  focus?: 0 | 1 | 2 | null
  title?: string
  subtitle?: string
}

const SOLID_COLOR = 'rgba(96,165,250,'
const CURVE_COLOR = 'rgba(74,222,128,1)'
const FIT_COLOR = 'rgba(251,191,36,1)'
const SAMPLE_COLOR = 'rgba(248,113,113,1)'

function radiusOf(area: number): number {
  return Math.sqrt(Math.max(0, area) / Math.PI)
}

export function drawPrismatoid(
  canvas: HTMLCanvasElement, opts: DrawOptions,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { solid, focus = null, title = '', subtitle = '' } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  drawStack(ctx, solid, W * 0.24, 74, H - 130, W * 0.17)
  drawProfile(ctx, solid, W * 0.5, 74, W * 0.42, H - 130, focus)
  drawLabels(ctx, W, H, solid, title, subtitle)
}

/** 左：立体画成一叠椭圆薄片 */
function drawStack(
  ctx: CanvasRenderingContext2D, s: Prismatoid,
  cx: number, top: number, drawH: number, maxW: number,
): void {
  let maxR = 1e-6
  for (let i = 0; i <= 40; i++) {
    maxR = Math.max(maxR, radiusOf(s.areaAt((s.height * i) / 40)))
  }
  const kx = maxW / maxR
  const slices = 24
  ctx.save()
  for (let i = slices - 1; i >= 0; i--) {
    const frac = (i + 0.5) / slices
    const r = radiusOf(s.areaAt(s.height * frac)) * kx
    if (r < 0.5) continue
    const y = top + drawH * (1 - frac)
    ctx.beginPath()
    ctx.ellipse(cx, y, r, r * 0.3, 0, 0, Math.PI * 2)
    ctx.fillStyle = `${SOLID_COLOR}${(0.26 + 0.3 * (1 - frac)).toFixed(3)})`
    ctx.fill()
    ctx.strokeStyle = `${SOLID_COLOR}0.7)`
    ctx.lineWidth = 1
    ctx.stroke()
  }
  ctx.restore()
}

/**
 * 右：A(t) 曲线 + 三个采样点 + 穿过三点的抛物线。
 *
 * 抛物线用拉格朗日插值：过 (0,S₀)、(h/2,S₁)、(h,S₂) 的二次式。
 * 辛普森公式积的就是这条抛物线 —— 它与真实 A(t) 重合与否，
 * 直接决定公式精不精确。
 */
function drawProfile(
  ctx: CanvasRenderingContext2D, s: Prismatoid,
  x0: number, top: number, plotW: number, plotH: number,
  focus: 0 | 1 | 2 | null,
): void {
  const h = s.height
  const S = [s.areaAt(0), s.areaAt(h / 2), s.areaAt(h)]
  // 纵轴范围
  let maxA = Math.max(...S)
  for (let i = 0; i <= 100; i++) maxA = Math.max(maxA, s.areaAt((h * i) / 100))
  maxA = Math.max(maxA, 1e-9) * 1.12

  const toX = (t: number) => x0 + (t / h) * plotW
  const toY = (a: number) => top + plotH * (1 - a / maxA)

  ctx.save()
  // 坐标轴
  ctx.strokeStyle = 'rgba(148,163,184,0.45)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0, top)
  ctx.lineTo(x0, top + plotH)
  ctx.lineTo(x0 + plotW, top + plotH)
  ctx.stroke()

  // 穿过三点的抛物线（辛普森实际积的那条）
  ctx.strokeStyle = FIT_COLOR
  ctx.lineWidth = 3
  ctx.setLineDash([7, 4])
  ctx.beginPath()
  for (let i = 0; i <= 120; i++) {
    const t = (h * i) / 120
    const a = lagrange3(t, h, S)
    const px = toX(t)
    const py = toY(a)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // 真实 A(t)
  ctx.strokeStyle = CURVE_COLOR
  ctx.lineWidth = 2.2
  ctx.beginPath()
  for (let i = 0; i <= 200; i++) {
    const t = (h * i) / 200
    const px = toX(t)
    const py = toY(s.areaAt(t))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // 三个采样点
  const labels = ['S下', 'S中', 'S上']
  const ts = [0, h / 2, h]
  ts.forEach((t, i) => {
    const dim = focus !== null && focus !== i
    const px = toX(t)
    const py = toY(S[i])
    ctx.globalAlpha = dim ? 0.3 : 1
    // 竖直引线
    ctx.strokeStyle = 'rgba(248,113,113,0.4)'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(px, top + plotH)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(px, py, 5.5, 0, Math.PI * 2)
    ctx.fillStyle = SAMPLE_COLOR
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.font = 'bold 12px sans-serif'
    // 末点的标签向左排，否则会被画布右边缘截断
    const text = `${labels[i]} ${S[i].toFixed(3)}`
    if (i === ts.length - 1) {
      ctx.textAlign = 'right'
      ctx.fillText(text, px - 8, py - 8)
      ctx.textAlign = 'left'
    } else {
      ctx.fillText(text, px + 8, py - 8)
    }
  })
  ctx.globalAlpha = 1
  ctx.restore()
}

/** 过 (0,S0)、(h/2,S1)、(h,S2) 的二次插值 */
function lagrange3(t: number, h: number, S: number[]): number {
  const x0 = 0
  const x1 = h / 2
  const x2 = h
  const l0 = ((t - x1) * (t - x2)) / ((x0 - x1) * (x0 - x2))
  const l1 = ((t - x0) * (t - x2)) / ((x1 - x0) * (x1 - x2))
  const l2 = ((t - x0) * (t - x1)) / ((x2 - x0) * (x2 - x1))
  return S[0] * l0 + S[1] * l1 + S[2] * l2
}

function drawLabels(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  s: Prismatoid, title: string, subtitle: string,
): void {
  const vf = prismatoidVolume(s)
  const vn = integrate(s, 8000)
  const exact = Math.abs(vf - s.volume) / Math.max(1e-12, Math.abs(s.volume)) < 1e-9
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(title || s.label, 18, 28)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(subtitle || `${s.note}（A(t) 次数 ${s.degree}）`, 18, 48)

  ctx.textAlign = 'right'
  ctx.font = 'bold 14px sans-serif'
  ctx.fillStyle = exact ? 'rgba(74,222,128,1)' : 'rgba(248,113,113,1)'
  ctx.fillText(exact ? '公式精确 ✓' : '公式失效（只是近似）', W - 18, 30)
  ctx.font = '12px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillText(`h/6·(S下+4S中+S上) = ${vf.toFixed(6)}`, W - 18, 50)
  ctx.textAlign = 'left'

  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillText(`真实体积 ${s.volume.toFixed(6)}（数值积分 ${vn.toFixed(6)}）`, 18, H - 36)
  ctx.fillStyle = exact
    ? 'rgba(148,163,184,0.85)'
    : 'rgba(248,113,113,0.9)'
  ctx.fillText(
    exact
      ? '两条曲线重合 ⟹ 三点足以定出体积'
      : '两条曲线分开 ⟹ 三点不够，公式只是近似',
    18, H - 16,
  )

  // 图例放底部右侧：绘图区里放不下，三个采样点标签会抢位置
  ctx.textAlign = 'right'
  ctx.font = '12px sans-serif'
  ctx.fillStyle = CURVE_COLOR
  ctx.fillText('绿实线 = 真实 A(t)', W - 18, H - 36)
  ctx.fillStyle = FIT_COLOR
  ctx.fillText('黄虚线 = 过三点的抛物线', W - 18, H - 16)
  ctx.textAlign = 'left'
  ctx.restore()
}
