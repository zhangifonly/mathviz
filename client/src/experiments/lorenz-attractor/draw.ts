/**
 * 洛伦兹吸引子 Canvas 绘制
 *
 * 把三维轨迹投影到 x-z 平面（洛伦兹吸引子最经典的蝴蝶视角），
 * 按进度逐段揭示，用色相沿轨迹渐变突出流动感。
 */

import type { Vec3 } from './lorenzAttractor'

/** 计算轨迹在 x-z 平面上的包围盒，用于自适应缩放 */
function bounds(pts: Vec3[]) {
  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity
  for (const p of pts) {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.z < minZ) minZ = p.z
    if (p.z > maxZ) maxZ = p.z
  }
  return { minX, maxX, minZ, maxZ }
}

/**
 * 绘制洛伦兹吸引子轨迹。
 * @param pts integrateLorenz 生成的轨迹点
 * @param progress 0→1 逐段揭示轨迹
 */
export function drawLorenzAttractor(
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

  const { minX, maxX, minZ, maxZ } = bounds(pts)
  const pad = 40
  const spanX = maxX - minX || 1
  const spanZ = maxZ - minZ || 1
  const scale = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanZ)
  // 投影到画布：x 向右，z 向上（翻转 y 轴）
  const px = (p: Vec3) => pad + (p.x - minX) * scale + (W - 2 * pad - spanX * scale) / 2
  const py = (p: Vec3) => H - pad - (p.z - minZ) * scale - (H - 2 * pad - spanZ * scale) / 2

  const upto = Math.max(2, Math.floor(pts.length * Math.min(1, Math.max(0, progress))))

  ctx.lineWidth = 1.1
  ctx.lineJoin = 'round'
  for (let i = 1; i < upto; i++) {
    const t = i / pts.length
    // 色相从青蓝(190) 过渡到品红(320)，展现轨迹流动
    const hue = 190 + t * 130
    ctx.strokeStyle = `hsla(${hue}, 85%, 62%, 0.85)`
    ctx.beginPath()
    ctx.moveTo(px(pts[i - 1]), py(pts[i - 1]))
    ctx.lineTo(px(pts[i]), py(pts[i]))
    ctx.stroke()
  }

  // 当前运动质点高亮
  if (upto >= 2) {
    const head = pts[upto - 1]
    ctx.fillStyle = '#fef08a'
    ctx.beginPath()
    ctx.arc(px(head), py(head), 3.5, 0, Math.PI * 2)
    ctx.fill()
  }
}
