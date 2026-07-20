/**
 * 蒙提霍尔问题 Canvas 绘制
 * 画换门/不换门两条累计胜率曲线，随试验次数收敛到理论值。
 */
import { simulateCurve, THEORY } from './montyHall'

const SWITCH_COLOR = '#6366f1'
const STAY_COLOR = '#f87171'

/** 把胜率(0~1)映射到画布 y 坐标 */
function toY(v: number, top: number, bottom: number): number {
  return bottom - v * (bottom - top)
}

function drawCurve(
  ctx: CanvasRenderingContext2D,
  curve: number[],
  color: string,
  left: number,
  right: number,
  top: number,
  bottom: number,
) {
  if (curve.length === 0) return
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < curve.length; i++) {
    const x = left + (i / (curve.length - 1 || 1)) * (right - left)
    const y = toY(curve[i], top, bottom)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function drawGuide(
  ctx: CanvasRenderingContext2D,
  v: number,
  color: string,
  label: string,
  left: number,
  right: number,
  top: number,
  bottom: number,
) {
  const y = toY(v, top, bottom)
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.5
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  ctx.moveTo(left, y)
  ctx.lineTo(right, y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1
  ctx.fillStyle = color
  ctx.font = '12px sans-serif'
  ctx.fillText(label, left + 6, y - 4)
}

export function drawMontyHall(canvas: HTMLCanvasElement, trials: number, seed = 1) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const left = 44
  const right = W - 16
  const top = 24
  const bottom = H - 32

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(left, top)
  ctx.lineTo(left, bottom)
  ctx.lineTo(right, bottom)
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '11px sans-serif'
  ctx.fillText('胜率', 6, top + 4)
  ctx.fillText('1.0', 20, top + 4)
  ctx.fillText('0.0', 20, bottom + 2)
  ctx.fillText(`${trials} 局`, right - 46, bottom + 20)

  // 理论参考线
  drawGuide(ctx, THEORY.switch, SWITCH_COLOR, '换 2/3', left, right, top, bottom)
  drawGuide(ctx, THEORY.stay, STAY_COLOR, '不换 1/3', left, right, top, bottom)

  // 两条模拟曲线
  drawCurve(ctx, simulateCurve('switch', trials, seed), SWITCH_COLOR, left, right, top, bottom)
  drawCurve(ctx, simulateCurve('stay', trials, seed + 1), STAY_COLOR, left, right, top, bottom)
}
