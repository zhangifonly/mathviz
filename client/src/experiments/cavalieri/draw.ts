/**
 * Cavalieri 原理的 Canvas 绘制
 *
 * 左右并排两个立体，一片可滑动的水平截面同时切过两者。
 * 关键是让"两片截面面积相等"看得见 —— 所以截面用同色填充，
 * 并把两边的面积数值并排标出。
 *
 * 立体用「一叠水平薄片」画：每层按 areaAt(h) 反推半径，
 * 这既复用了截面函数，也让"体积 = 截面积的积分"这件事在画面上直接成立。
 */

import type { SolidProfile } from './cavalieri'

export interface DrawOptions {
  left: SolidProfile
  right: SolidProfile
  /** 当前截面高度（0 到 height） */
  h: number
  /** 薄片层数 */
  slices?: number
  /** 把立体画成分离的薄片（Cavalieri 的"不可分量"形象） */
  exploded?: boolean
  title?: string
  subtitle?: string
}

const LEFT_COLOR = 'rgba(96,165,250,'
const RIGHT_COLOR = 'rgba(74,222,128,'
const CUT_COLOR = 'rgba(251,191,36,'

/** 由截面积反推等效半径（截面是实心圆时用） */
function radiusOf(area: number): number {
  return Math.sqrt(Math.max(0, area) / Math.PI)
}

/** 某高度处的外轮廓半径：环形立体用自带的外半径，否则由面积反推 */
function outerR(s: SolidProfile, h: number): number {
  return s.outerRadiusAt ? s.outerRadiusAt(h) : radiusOf(s.areaAt(h))
}

/** 某高度处的内孔半径（非环形为 0） */
function innerR(s: SolidProfile, h: number): number {
  return s.innerRadiusAt ? s.innerRadiusAt(h) : 0
}

/** 画一层薄片：实心椭圆，或带内孔的环 */
function sliceShape(
  ctx: CanvasRenderingContext2D, cx: number, y: number,
  rOut: number, rIn: number, ry: number,
): void {
  ctx.beginPath()
  ctx.ellipse(cx, y, rOut, ry, 0, 0, Math.PI * 2)
  if (rIn > 0.5) {
    // 反向画内圈，配合 evenodd 填充规则挖出孔
    ctx.ellipse(cx, y, rIn, rIn * (ry / Math.max(rOut, 1e-6)), 0, 0, Math.PI * 2, true)
  }
}

export function drawCavalieri(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    left, right, h, slices = 26, exploded = false,
    title = '', subtitle = '',
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  // 两个立体各占半边
  const cx1 = W * 0.27
  const cx2 = W * 0.73
  const top = 70
  const bottom = H - 70
  const drawH = bottom - top
  // 统一比例：用两者的最大半径定横向缩放
  let maxR = 0
  for (const s of [left, right]) {
    for (let i = 0; i <= 40; i++) {
      maxR = Math.max(maxR, outerR(s, (s.height * i) / 40))
    }
  }
  const kx = (W * 0.2) / Math.max(1e-6, maxR)

  drawStack(ctx, left, cx1, top, drawH, kx, slices, LEFT_COLOR, exploded)
  drawStack(ctx, right, cx2, top, drawH, kx, slices, RIGHT_COLOR, exploded)
  drawCut(ctx, left, right, h, cx1, cx2, top, drawH, kx)
  drawLabels(ctx, W, H, left, right, h, title, subtitle)
}

/** 把一个立体画成一叠椭圆薄片 */
function drawStack(
  ctx: CanvasRenderingContext2D, s: SolidProfile,
  cx: number, top: number, drawH: number, kx: number,
  slices: number, colorPrefix: string, exploded: boolean,
): void {
  ctx.save()
  // 从下往上画，近的盖住远的
  for (let i = slices - 1; i >= 0; i--) {
    const frac = (i + 0.5) / slices
    const hh = s.height * frac
    const r = outerR(s, hh) * kx
    const ri = innerR(s, hh) * kx
    if (r < 0.5) continue
    // 屏幕 y：高度越大越靠上
    const gap = exploded ? (i / slices) * 12 : 0
    const y = top + drawH * (1 - frac) - gap
    const ry = r * 0.32 // 椭圆的竖直半轴，做出俯视透视
    sliceShape(ctx, cx, y, r, ri, ry)
    const shade = 0.28 + 0.34 * (1 - frac)
    ctx.fillStyle = `${colorPrefix}${shade.toFixed(3)})`
    ctx.fill('evenodd')
    ctx.strokeStyle = `${colorPrefix}0.75)`
    ctx.lineWidth = 1
    ctx.stroke()
  }
  ctx.restore()
}

/** 当前截面：两边同时高亮 */
function drawCut(
  ctx: CanvasRenderingContext2D, left: SolidProfile, right: SolidProfile,
  h: number, cx1: number, cx2: number, top: number, drawH: number, kx: number,
): void {
  const frac = Math.max(0, Math.min(1, h / left.height))
  const y = top + drawH * (1 - frac)
  ctx.save()
  // 贯穿的水平线
  ctx.strokeStyle = `${CUT_COLOR}0.5)`
  ctx.lineWidth = 1.4
  ctx.setLineDash([6, 5])
  ctx.beginPath()
  ctx.moveTo(20, y)
  ctx.lineTo(ctx.canvas.width - 20, y)
  ctx.stroke()
  ctx.setLineDash([])

  for (const [s, cx] of [[left, cx1], [right, cx2]] as Array<[SolidProfile, number]>) {
    const r = outerR(s, h) * kx
    const ri = innerR(s, h) * kx
    if (r < 0.5) continue
    sliceShape(ctx, cx, y, r, ri, r * 0.32)
    ctx.fillStyle = `${CUT_COLOR}0.65)`
    ctx.fill('evenodd')
    ctx.strokeStyle = `${CUT_COLOR}1)`
    ctx.lineWidth = 2.2
    ctx.stroke()
  }
  ctx.restore()
}

function drawLabels(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  left: SolidProfile, right: SolidProfile, h: number,
  title: string, subtitle: string,
): void {
  const al = left.areaAt(h)
  const ar = right.areaAt(h)
  const same = Math.abs(al - ar) < 1e-9 * Math.max(1, Math.abs(al))
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(title || 'Cavalieri 原理', 18, 28)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  if (subtitle) ctx.fillText(subtitle, 18, 48)

  // 两个立体的名字
  ctx.textAlign = 'center'
  ctx.font = 'bold 14px sans-serif'
  ctx.fillStyle = `${LEFT_COLOR}1)`
  ctx.fillText(left.label, W * 0.27, H - 42)
  ctx.fillStyle = `${RIGHT_COLOR}1)`
  ctx.fillText(right.label, W * 0.73, H - 42)

  // 截面积
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillText(`截面积 ${al.toFixed(5)}`, W * 0.27, H - 22)
  ctx.fillText(`截面积 ${ar.toFixed(5)}`, W * 0.73, H - 22)

  // 中间的判定
  ctx.font = 'bold 14px sans-serif'
  ctx.fillStyle = same ? 'rgba(74,222,128,1)' : 'rgba(248,113,113,1)'
  ctx.fillText(same ? '＝ 相等' : '≠ 不等', W / 2, H - 22)

  // 体积
  ctx.textAlign = 'right'
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillText(
    `体积 ${left.volume.toFixed(6)} vs ${right.volume.toFixed(6)}`, W - 18, 28,
  )
  ctx.fillText(`高度 h = ${h.toFixed(4)}`, W - 18, 48)
  ctx.restore()
}
