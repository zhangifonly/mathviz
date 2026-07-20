/**
 * 粒子群优化 Canvas 绘制:目标函数地形(等高线着色) + 粒子群(带速度箭头) + 全局最优标记
 */
import { objective, BOUND, type Swarm } from './particleSwarm'

/** 世界坐标 [-BOUND,BOUND] 映射到画布像素 */
function toPx(v: number, size: number): number {
  return ((v + BOUND) / (2 * BOUND)) * size
}

export function drawParticleSwarm(canvas: HTMLCanvasElement, swarm: Swarm, step = 4) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height

  // 地形:按目标值上色(值小=深蓝谷底,值大=暖色高地)
  const img = ctx.createImageData(W, H)
  const data = img.data
  for (let py = 0; py < H; py += step) {
    for (let px = 0; px < W; px += step) {
      const x = (px / W) * 2 * BOUND - BOUND
      const y = (py / H) * 2 * BOUND - BOUND
      const v = objective(x, y)
      const t = Math.max(0, Math.min(1, v / 9))
      // 等高线:目标值取整处画深色带
      const band = Math.abs((v % 1) - 0.5) < 0.06 ? -40 : 0
      const r = Math.round(40 + t * 200 + band)
      const g = Math.round(70 + t * 120 + band)
      const b = Math.round(160 - t * 120 + band)
      for (let dy = 0; dy < step && py + dy < H; dy++) {
        for (let dx = 0; dx < step && px + dx < W; dx++) {
          const p = ((py + dy) * W + (px + dx)) * 4
          data[p] = r; data[p + 1] = g; data[p + 2] = b; data[p + 3] = 255
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0)

  // 粒子 + 速度箭头
  for (const p of swarm.particles) {
    const cx = toPx(p.x, W)
    const cy = toPx(p.y, H)
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + p.vx * (W / (2 * BOUND)) * 0.8, cy + p.vy * (H / (2 * BOUND)) * 0.8)
    ctx.stroke()
    ctx.fillStyle = '#fde047'
    ctx.beginPath()
    ctx.arc(cx, cy, 3.2, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 全局最优:红色环 + 十字
  const gx = toPx(swarm.gBestX, W)
  const gy = toPx(swarm.gBestY, H)
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(gx, gy, 8, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(gx - 12, gy); ctx.lineTo(gx + 12, gy)
  ctx.moveTo(gx, gy - 12); ctx.lineTo(gx, gy + 12)
  ctx.stroke()
}
