/**
 * 最速降线 Canvas 绘制：三条路径 + 沿路径下滑的小球
 */
import { buildPath, descentTime, G, type Pt, type PathKind } from './brachistochrone'

const COLORS: Record<PathKind, string> = {
  cycloid: '#ec4899',
  straight: '#38bdf8',
  arc: '#a3e635',
}
const LABELS: Record<PathKind, string> = {
  cycloid: '摆线', straight: '直线', arc: '圆弧',
}

/** 给定路径与已过时间 t，插值出小球位置（按 descentTime 的局部速度推进弧长） */
function ballAt(path: Pt[], elapsed: number, g = G): Pt {
  let t = 0
  for (let i = 1; i < path.length; i++) {
    const ds = Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y)
    const v0 = Math.sqrt(2 * g * Math.max(path[i - 1].y, 1e-6))
    const v1 = Math.sqrt(2 * g * Math.max(path[i].y, 1e-6))
    const dt = ds / ((v0 + v1) / 2)
    if (t + dt >= elapsed) {
      const f = (elapsed - t) / dt
      return { x: path[i - 1].x + (path[i].x - path[i - 1].x) * f, y: path[i - 1].y + (path[i].y - path[i - 1].y) * f }
    }
    t += dt
  }
  return path[path.length - 1]
}

export function drawBrachistochrone(
  canvas: HTMLCanvasElement,
  bx: number,
  by: number,
  elapsed: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const ox = 60
  const oy = 40
  const sx = (W - 120) / bx
  const sy = (H - 120) / by
  const px = (p: Pt) => ox + p.x * sx
  const py = (p: Pt) => oy + p.y * sy

  const kinds: PathKind[] = ['straight', 'arc', 'cycloid']
  for (const kind of kinds) {
    const path = buildPath(kind, bx, by, 240)
    ctx.strokeStyle = COLORS[kind]
    ctx.lineWidth = 2.5
    ctx.beginPath()
    path.forEach((p, i) => (i === 0 ? ctx.moveTo(px(p), py(p)) : ctx.lineTo(px(p), py(p))))
    ctx.stroke()
    const total = descentTime(path)
    const ball = ballAt(path, Math.min(elapsed, total))
    ctx.fillStyle = COLORS[kind]
    ctx.beginPath()
    ctx.arc(px(ball), py(ball), 7, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 端点
  ctx.fillStyle = '#0f172a'
  ctx.beginPath(); ctx.arc(px({ x: 0, y: 0 }), py({ x: 0, y: 0 }), 5, 0, 2 * Math.PI); ctx.fill()
  ctx.beginPath(); ctx.arc(px({ x: bx, y: by }), py({ x: bx, y: by }), 5, 0, 2 * Math.PI); ctx.fill()

  // 图例
  ctx.font = '13px sans-serif'
  kinds.forEach((kind, i) => {
    const t = descentTime(buildPath(kind, bx, by, 240))
    ctx.fillStyle = COLORS[kind]
    ctx.fillText(`${LABELS[kind]}  用时 ${t.toFixed(2)}s`, W - 170, 30 + i * 20)
  })
}
