/**
 * 谢尔宾斯基地毯 Canvas 绘制
 * 把递归得到的所有保留正方形填充出来，被挖掉的中心格留白。
 */
import { carpetSquares } from './sierpinskiCarpet'

/**
 * 绘制第 n 层谢尔宾斯基地毯。
 * @param level 迭代层数
 * @param showGrid 是否描出每个小正方形的边框
 */
export function drawSierpinskiCarpet(
  canvas: HTMLCanvasElement,
  level: number,
  showGrid = false,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 留边距，取正方形绘制区域
  const margin = 20
  const side = Math.min(W, H) - margin * 2
  const ox = (W - side) / 2
  const oy = (H - side) / 2

  // 背景（被挖空处的底色）
  ctx.fillStyle = '#f1f5f9'
  ctx.fillRect(ox, oy, side, side)

  const squares = carpetSquares(level, 0, 0, side)
  // 层数越深颜色越亮，营造深度层次
  const hue = 245
  const light = Math.min(62, 40 + level * 6)
  ctx.fillStyle = `hsl(${hue}, 70%, ${light}%)`
  for (const s of squares) {
    ctx.fillRect(ox + s.x, oy + s.y, s.size, s.size)
  }

  if (showGrid) {
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.lineWidth = 0.5
    for (const s of squares) {
      ctx.strokeRect(ox + s.x, oy + s.y, s.size, s.size)
    }
  }

  // 外框
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1.5
  ctx.strokeRect(ox, oy, side, side)
}
