/**
 * 谢尔宾斯基三角 Canvas 绘制
 * 支持两种模式：递归挖洞填充小三角、混沌游戏散点。
 */
import { subdivide, chaosGame, type Triangle, type Mode } from './sierpinskiTriangle'

/** 依据画布尺寸构造一个居中的等边三角形 */
export function baseTriangle(W: number, H: number): Triangle {
  const m = 24
  return [
    { x: W / 2, y: m },
    { x: m, y: H - m },
    { x: W - m, y: H - m },
  ]
}

export function drawSierpinskiTriangle(
  canvas: HTMLCanvasElement,
  mode: Mode,
  level: number,
  seed = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const tri = baseTriangle(W, H)

  if (mode === 'recursive') {
    const tris = subdivide(tri, level)
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 0.6
    for (const t of tris) {
      ctx.beginPath()
      ctx.moveTo(t[0].x, t[0].y)
      ctx.lineTo(t[1].x, t[1].y)
      ctx.lineTo(t[2].x, t[2].y)
      ctx.closePath()
      ctx.fillStyle = 'rgba(99,102,241,0.35)'
      ctx.fill()
      ctx.stroke()
    }
  } else {
    // 混沌游戏：迭代数随 level 增长，越多点越清晰
    const iterations = 2000 * level
    const pts = chaosGame(tri, iterations, seed)
    ctx.fillStyle = 'rgba(236,72,153,0.7)'
    for (const p of pts) {
      ctx.fillRect(p.x, p.y, 1.2, 1.2)
    }
  }
}
