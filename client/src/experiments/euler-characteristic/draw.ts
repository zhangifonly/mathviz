/**
 * 欧拉示性数 Canvas 绘制
 * 画多面体的示意图（顶点环状排布 + 棱连线）并标注 V/E/F 与 χ。
 */
import { polyhedronChar, type Polyhedron } from './eulerCharacteristic'

export function drawEulerCharacteristic(
  canvas: HTMLCanvasElement,
  poly: Polyhedron,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const cx = W / 2
  const cy = H * 0.42
  const R = Math.min(W, H) * 0.3
  const n = poly.V
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)])
  }

  // 棱：环上相邻连线 + 若干对角弦，营造多面体骨架感
  ctx.strokeStyle = poly.color
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 1.5
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (j - i === 1 || (i === 0 && j === n - 1) || (j - i) % 3 === 0) {
        ctx.beginPath()
        ctx.moveTo(pts[i][0], pts[i][1])
        ctx.lineTo(pts[j][0], pts[j][1])
        ctx.stroke()
      }
    }
  }
  ctx.globalAlpha = 1

  // 顶点圆点
  ctx.fillStyle = '#0f172a'
  for (const [x, y] of pts) {
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 名称
  ctx.fillStyle = '#1e293b'
  ctx.font = 'bold 22px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(poly.name, cx, 34)

  // 计数面板
  const chi = polyhedronChar(poly)
  const boxes: [string, number, string][] = [
    ['V 顶点', poly.V, '#6366f1'],
    ['E 棱', poly.E, '#ec4899'],
    ['F 面', poly.F, '#22d3ee'],
  ]
  const bw = 120
  const gap = 16
  const startX = cx - (bw * 3 + gap * 2) / 2
  const by = H - 130
  ctx.textAlign = 'center'
  boxes.forEach(([label, val, col], k) => {
    const x = startX + k * (bw + gap)
    ctx.fillStyle = col
    ctx.globalAlpha = 0.12
    ctx.fillRect(x, by, bw, 60)
    ctx.globalAlpha = 1
    ctx.fillStyle = col
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText(String(val), x + bw / 2, by + 34)
    ctx.fillStyle = '#475569'
    ctx.font = '14px sans-serif'
    ctx.fillText(label, x + bw / 2, by + 52)
  })

  // 公式
  ctx.fillStyle = chi === 2 ? '#16a34a' : '#dc2626'
  ctx.font = 'bold 26px sans-serif'
  ctx.fillText(`V - E + F = ${poly.V} - ${poly.E} + ${poly.F} = ${chi}`, cx, H - 30)
}
