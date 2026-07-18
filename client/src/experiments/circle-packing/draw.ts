/**
 * 圆填充 Canvas 绘制：按模式画出堆积图案并叠加密度信息
 */
import {
  hexPacking,
  squarePacking,
  randomPacking,
  packingDensity,
  type Circle,
  type PackMode,
} from './circlePacking'

const PALETTE = ['#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24', '#f87171']

export function buildPacking(
  mode: PackMode,
  width: number,
  height: number,
  r: number,
  seed: number,
): Circle[] {
  if (mode === 'hex') return hexPacking(width, height, r)
  if (mode === 'square') return squarePacking(width, height, r)
  return randomPacking(width, height, 400, seed)
}

/** 绘制堆积图案，返回该布局的填充密度 */
export function drawCirclePacking(
  canvas: HTMLCanvasElement,
  mode: PackMode,
  r = 22,
  seed = 1,
): number {
  const ctx = canvas.getContext('2d')
  if (!ctx) return 0
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const circles = buildPacking(mode, W, H, r, seed)
  circles.forEach((c, i) => {
    ctx.beginPath()
    ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI)
    ctx.fillStyle = PALETTE[i % PALETTE.length] + 'cc'
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = '#0f172a33'
    ctx.stroke()
  })

  const density = packingDensity(circles, W * H)
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 18px sans-serif'
  ctx.fillText(`密度 ${(density * 100).toFixed(2)}%`, 12, 26)
  ctx.font = '13px sans-serif'
  ctx.fillText(`${circles.length} 个圆`, 12, 46)
  return density
}
