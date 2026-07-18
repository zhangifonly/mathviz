/**
 * 莫比乌斯函数 Canvas 绘制
 * 上半区：1..n 的 μ 值条形（+1 蓝 / -1 红 / 0 灰）
 * 下半区：梅滕斯函数 M(n) 折线
 */
import { mobiusArray, mertensArray } from './mobiusFunction'

export function drawMobiusFunction(canvas: HTMLCanvasElement, n: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const mu = mobiusArray(n)
  const mert = mertensArray(n)
  const pad = 30
  const barTop = pad
  const barMid = H * 0.42
  const barH = barMid - barTop // 半高
  const bw = (W - pad * 2) / n

  // 上半：μ 条形，以 barMid 为零轴
  ctx.strokeStyle = '#94a3b8'
  ctx.beginPath()
  ctx.moveTo(pad, barMid)
  ctx.lineTo(W - pad, barMid)
  ctx.stroke()
  for (let i = 0; i < n; i++) {
    const v = mu[i]
    const x = pad + i * bw
    if (v === 0) {
      ctx.fillStyle = '#cbd5e1'
      ctx.fillRect(x, barMid - 2, Math.max(bw - 1, 1), 4)
    } else {
      const h = barH * 0.8
      ctx.fillStyle = v > 0 ? '#3b82f6' : '#ef4444'
      const y = v > 0 ? barMid - h : barMid
      ctx.fillRect(x, y, Math.max(bw - 1, 1), h)
    }
  }

  // 下半：梅滕斯折线
  const gTop = barMid + 24
  const gBot = H - pad
  const gH = gBot - gTop
  let maxAbs = 1
  for (const m of mert) maxAbs = Math.max(maxAbs, Math.abs(m))
  const zeroY = gTop + gH / 2
  ctx.strokeStyle = '#94a3b8'
  ctx.beginPath()
  ctx.moveTo(pad, zeroY)
  ctx.lineTo(W - pad, zeroY)
  ctx.stroke()

  ctx.strokeStyle = '#8b5cf6'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < n; i++) {
    const x = pad + (i + 0.5) * bw
    const y = zeroY - (mert[i] / maxAbs) * (gH / 2) * 0.9
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.lineWidth = 1

  ctx.fillStyle = '#475569'
  ctx.font = '13px sans-serif'
  ctx.fillText('mu(n): +1 蓝 / -1 红 / 0 灰', pad, 18)
  ctx.fillText('M(n) 梅滕斯前缀和', pad, gTop - 6)
}
