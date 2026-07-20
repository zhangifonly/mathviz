/**
 * 汉诺塔 Canvas 绘制：三根柱子 + 大小递减的彩色盘子
 */
import { applyMoves, diskColor, type Move, type Peg } from './towerOfHanoi'

const PEGS: Peg[] = ['A', 'B', 'C']

/**
 * 渲染第 k 步执行后的盘子分布。
 * @param n 盘子总数
 * @param steps 完整移动序列
 * @param k 当前步（0=初始态）
 */
export function drawTowerOfHanoi(
  canvas: HTMLCanvasElement,
  n: number,
  steps: Move[],
  k: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const baseY = H - 40
  const pegW = 10
  const pegH = H - 120
  const slotW = W / 3
  const maxDiskW = slotW * 0.8
  const minDiskW = maxDiskW * 0.32
  const diskH = Math.min(26, pegH / (n + 1))

  // 底座
  ctx.fillStyle = '#94a3b8'
  ctx.fillRect(20, baseY, W - 40, 12)

  // 三根柱子
  PEGS.forEach((_, i) => {
    const cx = slotW * i + slotW / 2
    ctx.fillStyle = '#cbd5e1'
    ctx.fillRect(cx - pegW / 2, baseY - pegH, pegW, pegH)
  })

  const pegs = applyMoves(n, steps, k)
  PEGS.forEach((peg, i) => {
    const cx = slotW * i + slotW / 2
    const stack = pegs[peg]
    stack.forEach((disk, level) => {
      const frac = n <= 1 ? 1 : (disk - 1) / (n - 1)
      const w = minDiskW + frac * (maxDiskW - minDiskW)
      const y = baseY - (level + 1) * diskH
      ctx.fillStyle = diskColor(disk)
      roundRect(ctx, cx - w / 2, y + 2, w, diskH - 4, 6)
      ctx.fill()
      ctx.strokeStyle = 'rgba(15,23,42,0.25)'
      ctx.stroke()
    })
  })

  // 柱标
  ctx.fillStyle = '#475569'
  ctx.font = '16px sans-serif'
  ctx.textAlign = 'center'
  PEGS.forEach((peg, i) => {
    ctx.fillText(peg, slotW * i + slotW / 2, baseY + 34)
  })
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}
