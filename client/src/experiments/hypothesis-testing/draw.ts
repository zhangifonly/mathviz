/**
 * 假设检验 Canvas 绘制
 * 标准正态曲线 + 拒绝域(尾部阴影) + 检验统计量位置 + p 值面积
 */
import { normalCdf, zCritical, type TestResult } from './hypothesisTesting'

const pdf = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)

/** 绘制标准正态曲线及检验结果标注 */
export function drawHypothesisTesting(
  canvas: HTMLCanvasElement,
  result: TestResult,
  alpha: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const padX = 40
  const padY = 40
  const baseY = H - padY
  const xMin = -4
  const xMax = 4
  const yMax = pdf(0) * 1.15
  const sx = (x: number) => padX + ((x - xMin) / (xMax - xMin)) * (W - 2 * padX)
  const sy = (y: number) => baseY - (y / yMax) * (H - 2 * padY)
  const zc = zCritical(alpha)

  // 基线
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(sx(xMin), baseY)
  ctx.lineTo(sx(xMax), baseY)
  ctx.stroke()

  // 拒绝域(两尾)填充
  const fillTail = (from: number, to: number, color: string) => {
    ctx.beginPath()
    ctx.moveTo(sx(from), baseY)
    for (let x = from; x <= to; x += 0.02) ctx.lineTo(sx(x), sy(pdf(x)))
    ctx.lineTo(sx(to), baseY)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }
  fillTail(xMin, -zc, 'rgba(248,113,113,0.35)')
  fillTail(zc, xMax, 'rgba(248,113,113,0.35)')

  // p 值面积(以 |z| 为界的两尾，用更深色叠加)
  const az = Math.min(Math.abs(result.z), xMax)
  if (az > 0.01) {
    fillTail(xMin, -az, 'rgba(99,102,241,0.30)')
    fillTail(az, xMax, 'rgba(99,102,241,0.30)')
  }

  // 正态曲线
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let x = xMin; x <= xMax; x += 0.02) {
    const px = sx(x)
    const py = sy(pdf(x))
    if (x === xMin) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // 临界线
  ctx.strokeStyle = '#dc2626'
  ctx.setLineDash([4, 4])
  for (const c of [-zc, zc]) {
    ctx.beginPath()
    ctx.moveTo(sx(c), baseY)
    ctx.lineTo(sx(c), sy(pdf(c)))
    ctx.stroke()
  }
  ctx.setLineDash([])

  // 检验统计量竖线
  const zClamped = Math.max(xMin, Math.min(xMax, result.z))
  ctx.strokeStyle = result.reject ? '#dc2626' : '#2563eb'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(sx(zClamped), baseY)
  ctx.lineTo(sx(zClamped), sy(yMax * 0.92))
  ctx.stroke()

  // 文本标注
  ctx.fillStyle = '#0f172a'
  ctx.font = '13px sans-serif'
  ctx.fillText(`z = ${result.z.toFixed(3)}`, sx(zClamped) + 4, sy(yMax * 0.92) + 4)
  ctx.fillText(`p = ${result.p.toFixed(4)}`, padX, padY - 14)
  ctx.fillText(`临界 ±${zc.toFixed(2)} (α=${alpha})`, W - padX - 150, padY - 14)
  // 触及 normalCdf 保证与内核一致(基线概率标注)
  ctx.fillText(`Φ(z)=${normalCdf(result.z).toFixed(3)}`, W - padX - 150, baseY + 20)
}
