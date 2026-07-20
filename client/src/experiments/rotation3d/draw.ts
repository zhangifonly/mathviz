/**
 * 三维旋转立方体 Canvas 绘制（线框正交投影）
 */
import {
  eulerRotation, rotatePoint, project,
  CUBE_VERTICES, CUBE_EDGES, type Vec3,
} from './rotation3d'

const AXES: { dir: Vec3; color: string; label: string }[] = [
  { dir: [1.6, 0, 0], color: '#ef4444', label: 'X' },
  { dir: [0, 1.6, 0], color: '#22c55e', label: 'Y' },
  { dir: [0, 0, 1.6], color: '#3b82f6', label: 'Z' },
]

/**
 * 绘制按欧拉角旋转后的立方体线框与坐标轴。
 * @param ax,ay,az 三个欧拉角（角度制）
 */
export function drawRotation3d(
  canvas: HTMLCanvasElement,
  ax: number,
  ay: number,
  az: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const cx = W / 2
  const cy = H / 2
  const scale = Math.min(W, H) / 5
  ctx.clearRect(0, 0, W, H)

  const rad = Math.PI / 180
  const m = eulerRotation(ax * rad, ay * rad, az * rad)

  // 坐标轴
  ctx.lineWidth = 2
  for (const a of AXES) {
    const [x, y] = project(rotatePoint(m, a.dir), scale, cx, cy)
    ctx.strokeStyle = a.color
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.fillStyle = a.color
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText(a.label, x + 4, y - 4)
  }

  // 立方体顶点投影
  const pts = CUBE_VERTICES.map((v) => project(rotatePoint(m, v), scale, cx, cy))

  // 棱线
  ctx.strokeStyle = '#4338ca'
  ctx.lineWidth = 2
  for (const [i, j] of CUBE_EDGES) {
    ctx.beginPath()
    ctx.moveTo(pts[i][0], pts[i][1])
    ctx.lineTo(pts[j][0], pts[j][1])
    ctx.stroke()
  }

  // 顶点圆点
  ctx.fillStyle = '#1e1b4b'
  for (const [x, y] of pts) {
    ctx.beginPath()
    ctx.arc(x, y, 3.5, 0, 2 * Math.PI)
    ctx.fill()
  }
}
