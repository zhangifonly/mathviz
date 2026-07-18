/**
 * 排序算法 Canvas 绘制：把某一步快照画成柱状图，
 * 高亮正在比较（黄）/交换（红）的柱子，已就位为绿色。
 */
import type { SortStep } from './sortingAlgorithms'

export function drawSortingAlgorithms(
  canvas: HTMLCanvasElement,
  step: SortStep | undefined,
  maxVal: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || !step) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const arr = step.array
  const n = arr.length
  const gap = 6
  const barW = (W - gap * (n + 1)) / n
  const pad = 28
  const compare = new Set(step.compare)
  const swap = new Set(step.swap)
  const sorted = new Set(step.sorted)

  for (let i = 0; i < n; i++) {
    const h = (arr[i] / maxVal) * (H - pad * 2)
    const x = gap + i * (barW + gap)
    const y = H - pad - h
    if (swap.has(i)) ctx.fillStyle = '#ef4444'
    else if (compare.has(i)) ctx.fillStyle = '#f59e0b'
    else if (sorted.has(i)) ctx.fillStyle = '#10b981'
    else ctx.fillStyle = '#6366f1'
    roundRect(ctx, x, y, barW, h, 4)
    ctx.fill()
    ctx.fillStyle = '#334155'
    ctx.font = '12px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(String(arr[i]), x + barW / 2, H - pad + 16)
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
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
