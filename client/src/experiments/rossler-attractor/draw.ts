/**
 * Rössler 吸引子 Canvas 绘制
 *
 * 把三维轨迹正交投影到 x-y 平面（Rössler 吸引子最经典的螺旋视角），
 * 按进度逐段揭示，用色相沿轨迹渐变突出螺旋盘绕与折叠的流动感。
 */

import { projectXY, type Vec3 } from './rosslerAttractor'

/** 计算 2D 点集的包围盒，用于自适应缩放 */
function bounds(pts: Array<[number, number]>) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const [x, y] of pts) {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return { minX, maxX, minY, maxY }
}

/**
 * 绘制 Rössler 吸引子的 xy 投影。
 * @param pts simulate 生成的三维轨迹点
 * @param progress 0→1 逐段揭示轨迹
 */
export function drawRosslerAttractor(
  canvas: HTMLCanvasElement,
  pts: Vec3[],
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || pts.length < 2) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const proj = projectXY(pts)
  const { minX, maxX, minY, maxY } = bounds(proj)
  const pad = 40
  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1
  const scale = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanY)
  const ox = (W - spanX * scale) / 2
  const oy = (H - spanY * scale) / 2
  const px = (p: [number, number]) => ox + (p[0] - minX) * scale
  const py = (p: [number, number]) => H - oy - (p[1] - minY) * scale

  const upto = Math.max(2, Math.floor(proj.length * Math.min(1, Math.max(0, progress))))

  ctx.lineWidth = 1.1
  ctx.lineJoin = 'round'
  for (let i = 1; i < upto; i++) {
    const t = i / proj.length
    // 色相从青蓝(190) 过渡到品红(320)，展现螺旋盘绕
    const hue = 190 + t * 130
    ctx.strokeStyle = `hsla(${hue}, 85%, 62%, 0.85)`
    ctx.beginPath()
    ctx.moveTo(px(proj[i - 1]), py(proj[i - 1]))
    ctx.lineTo(px(proj[i]), py(proj[i]))
    ctx.stroke()
  }

  // 当前运动质点高亮
  if (upto >= 2) {
    const head = proj[upto - 1]
    ctx.fillStyle = '#fef08a'
    ctx.beginPath()
    ctx.arc(px(head), py(head), 3.5, 0, Math.PI * 2)
    ctx.fill()
  }
}
