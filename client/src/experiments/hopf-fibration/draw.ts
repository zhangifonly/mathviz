/**
 * 霍普夫纤维化 Canvas 绘制
 * 取若干 base 点，各算出投影到 3D 的纤维圆，再旋转 + 正交投影到 2D，
 * 不同 base 点用不同颜色，展现纤维互相环绕的结构。
 */
import { hopfFiber, BASE_POINTS, type Vec3, type BasePoint } from './hopfFibration'

/** 绕 Y 轴再绕 X 轴旋转 */
function rotate(p: Vec3, ry: number, rx: number): Vec3 {
  const [x, y, z] = p
  const cy = Math.cos(ry)
  const sy = Math.sin(ry)
  const x1 = cy * x + sy * z
  const z1 = -sy * x + cy * z
  const cx = Math.cos(rx)
  const sx = Math.sin(rx)
  const y1 = cx * y - sx * z1
  const z2 = sx * y + cx * z1
  return [x1, y1, z2]
}

export function drawHopfFibration(
  canvas: HTMLCanvasElement,
  fiberCount: number,
  angle = 0,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const scale = Math.min(W, H) / 7
  const bases: BasePoint[] = BASE_POINTS.slice(0, fiberCount)
  const rx = 0.5

  // 按平均深度排序，远的先画
  const drawn = bases.map((base) => {
    const pts3d = hopfFiber(base, 120).map((p) => rotate(p, angle, rx))
    const avgZ = pts3d.reduce((s, p) => s + p[2], 0) / pts3d.length
    return { base, pts3d, avgZ }
  })
  drawn.sort((a, b) => a.avgZ - b.avgZ)

  for (const { base, pts3d } of drawn) {
    ctx.beginPath()
    for (let i = 0; i < pts3d.length; i++) {
      const [x, y] = pts3d[i]
      const sx = cx + x * scale
      const sy = cy + y * scale
      if (i === 0) ctx.moveTo(sx, sy)
      else ctx.lineTo(sx, sy)
    }
    ctx.closePath()
    ctx.strokeStyle = base.color
    ctx.lineWidth = 2.5
    ctx.globalAlpha = 0.9
    ctx.shadowColor = base.color
    ctx.shadowBlur = 8
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0
}
