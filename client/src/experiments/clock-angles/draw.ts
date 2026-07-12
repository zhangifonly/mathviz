/**
 * 时钟与角度 Canvas 绘制
 */
import { hourHandAngle, minuteHandAngle, angleBetween } from './clockAngles'

export interface ClockData {
  hour: number
  minute: number
}

/** 把「相对 12 点、顺时针的角度」转成 canvas 弧度（12 点为 -90 度起点） */
function toRad(angleDeg: number): number {
  return ((angleDeg - 90) * Math.PI) / 180
}

/**
 * 绘制时钟表盘、两根指针以及它们之间的夹角扇形。
 * @param progress 0→1，指针从 12 点位置逐渐转到目标时刻
 */
export function drawClockAngles(
  canvas: HTMLCanvasElement,
  data: ClockData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const R = Math.min(W, H) / 2 - 24

  // 表盘外圈
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.stroke()

  // 刻度与数字
  for (let i = 0; i < 60; i++) {
    const a = toRad(i * 6)
    const isHour = i % 5 === 0
    const r1 = isHour ? R - 16 : R - 8
    ctx.strokeStyle = isHour ? '#94a3b8' : '#475569'
    ctx.lineWidth = isHour ? 3 : 1
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1)
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R)
    ctx.stroke()
  }
  ctx.fillStyle = '#e2e8f0'
  ctx.font = `${Math.round(R * 0.12)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let n = 1; n <= 12; n++) {
    const a = toRad(n * 30)
    ctx.fillText(String(n), cx + Math.cos(a) * (R - 34), cy + Math.sin(a) * (R - 34))
  }

  const p = Math.max(0, Math.min(1, progress))
  const hAng = hourHandAngle(data.hour, data.minute) * p
  const mAng = minuteHandAngle(data.minute) * p

  // 夹角扇形（仅在动画结束时按最终夹角绘制）
  if (p >= 0.999) {
    const between = angleBetween(data.hour, data.minute)
    const startRaw = Math.min(hourHandAngle(data.hour, data.minute), minuteHandAngle(data.minute))
    // 取较小夹角对应的方向：若原始差超过 180，则从大角一侧张开
    const rawDiff = Math.abs(hourHandAngle(data.hour, data.minute) - minuteHandAngle(data.minute)) % 360
    const sweepStart = rawDiff > 180 ? Math.max(hourHandAngle(data.hour, data.minute), minuteHandAngle(data.minute)) : startRaw
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)'
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, R * 0.42, toRad(sweepStart), toRad(sweepStart + between))
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#fbbf24'
    ctx.font = `bold ${Math.round(R * 0.13)}px sans-serif`
    const midDeg = sweepStart + between / 2
    const lr = R * 0.55
    ctx.fillText(
      `${Number(between.toFixed(1))}°`,
      cx + Math.cos(toRad(midDeg)) * lr,
      cy + Math.sin(toRad(midDeg)) * lr,
    )
  }

  // 时针（短粗）
  drawHand(ctx, cx, cy, toRad(hAng), R * 0.5, 7, '#38bdf8')
  // 分针（长细）
  drawHand(ctx, cx, cy, toRad(mAng), R * 0.78, 4, '#f472b6')

  // 中心轴
  ctx.fillStyle = '#e2e8f0'
  ctx.beginPath()
  ctx.arc(cx, cy, 7, 0, Math.PI * 2)
  ctx.fill()
}

function drawHand(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rad: number,
  len: number,
  width: number,
  color: string,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(cx + Math.cos(rad) * len, cy + Math.sin(rad) * len)
  ctx.stroke()
}
