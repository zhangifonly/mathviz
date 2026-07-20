/**
 * BFS/DFS 迷宫遍历 Canvas 绘制
 * 按帧染色已访问格子，BFS 呈同心扩散、DFS 呈蜿蜒深入，并高亮最终路径。
 */
import { search, START, GOAL, type Mode } from './bfsDfs'

// 按访问序号在冷->暖渐变上取色，直观呈现扩散先后
function heat(t: number): string {
  const hue = 210 - 210 * Math.max(0, Math.min(1, t)) // 蓝(210)->红(0)
  return `hsl(${hue}, 70%, 60%)`
}

/**
 * 绘制迷宫遍历。
 * @param frame 显示前 frame 个访问步（用于动画/分句），<=0 表示全部
 * @param showPath 是否高亮最终路径
 */
export function drawBfsDfs(
  canvas: HTMLCanvasElement,
  grid: number[][],
  mode: Mode,
  frame = -1,
  showPath = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const rows = grid.length
  const cols = grid[0].length
  const cw = canvas.width / cols
  const ch = canvas.height / rows
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 底：墙与通道
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = grid[r][c] === 1 ? '#334155' : '#f1f5f9'
      ctx.fillRect(c * cw, r * ch, cw - 1, ch - 1)
    }
  }

  const res = search(mode, grid, START, GOAL)
  const total = res.order.length
  const upto = frame < 0 || frame > total ? total : frame

  // 已访问格子按顺序染色
  for (let i = 0; i < upto; i++) {
    const [r, c] = res.order[i]
    ctx.fillStyle = heat(i / Math.max(1, total - 1))
    ctx.globalAlpha = 0.72
    ctx.fillRect(c * cw, r * ch, cw - 1, ch - 1)
  }
  ctx.globalAlpha = 1

  // 最终路径高亮（仅当已扩散到终点）
  if (showPath && upto >= total && res.found) {
    ctx.strokeStyle = '#facc15'
    ctx.lineWidth = Math.max(2, cw * 0.28)
    ctx.lineJoin = 'round'
    ctx.beginPath()
    res.path.forEach(([r, c], i) => {
      const x = c * cw + cw / 2
      const y = r * ch + ch / 2
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  }

  // 起点(绿)/终点(红)
  const mark = (cell: number[], color: string) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(cell[1] * cw + cw / 2, cell[0] * ch + ch / 2, Math.min(cw, ch) * 0.3, 0, 2 * Math.PI)
    ctx.fill()
  }
  mark(START, '#16a34a')
  mark(GOAL, '#dc2626')
}
