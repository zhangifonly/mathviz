/**
 * 核与像 Canvas 绘制
 * 左半：定义域网格点（核方向的点标红）；右半：映射后的像。
 */
import { apply, rank, kernelDirection, type Mat2 } from './kernelImage'

const GRID = 5 // 每方向 -GRID..GRID 的整数格点
const UNIT = 16 // 每单位像素

function axes(ctx: CanvasRenderingContext2D, cx: number, cy: number, half: number) {
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - half, cy); ctx.lineTo(cx + half, cy)
  ctx.moveTo(cx, cy - half); ctx.lineTo(cx, cy + half)
  ctx.stroke()
}

export function drawKernelImage(canvas: HTMLCanvasElement, m: Mat2) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const half = W / 2
  const lcx = half / 2, rcx = half + half / 2, cy = H / 2
  const r = rank(m)
  const k = kernelDirection(m)

  // 分隔线与坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.beginPath(); ctx.moveTo(half, 0); ctx.lineTo(half, H); ctx.stroke()
  axes(ctx, lcx, cy, half / 2 - 8)
  axes(ctx, rcx, cy, half / 2 - 8)

  for (let gy = -GRID; gy <= GRID; gy++) {
    for (let gx = -GRID; gx <= GRID; gx++) {
      // 是否落在核方向直线上（秩1时）
      const onKernel = k !== null && Math.abs(gx * k.y - gy * k.x) < 1e-6
      // 左：定义域点
      const lx = lcx + gx * UNIT * 0.7
      const ly = cy - gy * UNIT * 0.7
      ctx.fillStyle = onKernel ? '#ef4444' : '#6366f1'
      ctx.beginPath(); ctx.arc(lx, ly, onKernel ? 3.2 : 2, 0, 2 * Math.PI); ctx.fill()
      // 右：像点
      const out = apply(m, { x: gx, y: gy })
      const rx = rcx + out.x * UNIT * 0.35
      const ry = cy - out.y * UNIT * 0.35
      ctx.fillStyle = onKernel ? '#ef4444' : (r === 0 ? '#94a3b8' : '#10b981')
      ctx.beginPath(); ctx.arc(rx, ry, onKernel ? 3.6 : 2, 0, 2 * Math.PI); ctx.fill()
    }
  }

  // 标签
  ctx.fillStyle = '#475569'
  ctx.font = '13px sans-serif'
  ctx.fillText('定义域', lcx - 24, 18)
  ctx.fillText('像 (列空间)', rcx - 36, 18)
}
