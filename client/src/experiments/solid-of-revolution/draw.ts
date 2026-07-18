/**
 * 旋转体 Canvas 绘制
 * 画出曲线 y=f(x) 绕 x 轴旋转的示意：用若干圆盘截面的椭圆轮廓叠成立体感，
 * 并标出圆盘法计算得到的体积值。
 */
import { diskVolume, type Fn } from './solidOfRevolution'

export function drawSolidOfRevolution(
  canvas: HTMLCanvasElement,
  fn: Fn,
  a: number,
  b: number,
  disks = 22,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const padL = 50
  const padR = 30
  const axisY = H * 0.5
  const plotW = W - padL - padR
  // 纵向缩放：让最大半径占轴上下约 40% 高度
  let maxV = 0
  for (let i = 0; i <= 100; i++) {
    const v = fn(a + ((b - a) * i) / 100)
    if (v > maxV) maxV = v
  }
  const sy = maxV > 0 ? (H * 0.38) / maxV : 1
  const sx = plotW / (b - a)
  const toX = (x: number) => padL + (x - a) * sx

  // x 轴
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(padL - 10, axisY)
  ctx.lineTo(W - padR + 6, axisY)
  ctx.stroke()

  // 叠加圆盘椭圆（从后往前，营造立体感）
  for (let i = 0; i <= disks; i++) {
    const x = a + ((b - a) * i) / disks
    const r = fn(x) * sy
    const cx = toX(x)
    const hue = 220 + (i / disks) * 60
    ctx.strokeStyle = `hsla(${hue}, 70%, 55%, 0.55)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(cx, axisY, Math.max(r * 0.28, 1), Math.max(r, 1), 0, 0, 2 * Math.PI)
    ctx.stroke()
  }

  // 上下轮廓曲线（旋转体的外形）
  ctx.strokeStyle = '#4f46e5'
  ctx.lineWidth = 2.5
  for (const sign of [1, -1]) {
    ctx.beginPath()
    for (let i = 0; i <= 160; i++) {
      const x = a + ((b - a) * i) / 160
      const y = axisY - sign * fn(x) * sy
      if (i === 0) ctx.moveTo(toX(x), y)
      else ctx.lineTo(toX(x), y)
    }
    ctx.stroke()
  }

  // 体积数值
  const vol = diskVolume(fn, a, b, 400)
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 18px system-ui, sans-serif'
  ctx.fillText(`V ≈ ${vol.toFixed(3)}`, padL, 28)
  ctx.font = '13px system-ui, sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText(`x ∈ [${a}, ${b}]`, padL, H - 14)
}
