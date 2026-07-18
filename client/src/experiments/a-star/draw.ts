/**
 * A* 寻路 Canvas 绘制。按帧染色：已扩展(closed)、当前波前、最终路径。
 */
import { search, MAZE, START, GOAL, type Grid, type Cell } from './aStar'

/** 按扩展帧数 frame 绘制搜索过程；frame<0 表示画到最后并叠加最终路径 */
export function drawAStar(
  canvas: HTMLCanvasElement,
  useHeuristic: boolean,
  frame: number,
  grid: Grid = MAZE,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const cols = grid[0].length
  const rows = grid.length
  const cw = W / cols
  const ch = H / rows
  ctx.clearRect(0, 0, W, H)

  const { order, path } = search(grid, START, GOAL, useHeuristic)
  const shown = frame < 0 ? order.length : Math.min(frame, order.length)
  const visited = new Set<number>()
  for (let i = 0; i < shown; i++) visited.add(order[i].y * 1000 + order[i].x)

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let fill = '#f8fafc'
      if (grid[y][x] === 1) fill = '#334155'
      else if (visited.has(y * 1000 + x)) fill = useHeuristic ? '#bfdbfe' : '#fde68a'
      ctx.fillStyle = fill
      ctx.fillRect(x * cw, y * ch, cw - 1, ch - 1)
    }
  }

  // 已完成时叠加最终路径
  if (frame < 0 || shown >= order.length) {
    ctx.fillStyle = '#22c55e'
    for (const c of path) {
      ctx.fillRect(c.x * cw + cw * 0.2, c.y * ch + ch * 0.2, cw * 0.6, ch * 0.6)
    }
  }

  drawMarker(ctx, START, cw, ch, '#6366f1')
  drawMarker(ctx, GOAL, cw, ch, '#ef4444')
}

function drawMarker(ctx: CanvasRenderingContext2D, c: Cell, cw: number, ch: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(c.x * cw + cw / 2, c.y * ch + ch / 2, Math.min(cw, ch) * 0.3, 0, 2 * Math.PI)
  ctx.fill()
}

/** 搜索总帧数（扩展格子数），用于外部驱动动画 */
export function frameCount(useHeuristic: boolean, grid: Grid = MAZE): number {
  return search(grid, START, GOAL, useHeuristic).order.length
}
