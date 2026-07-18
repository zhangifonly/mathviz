/**
 * 原根 Canvas 绘制：把 0..p-1 均匀排在圆环上，
 * 画出 g 的幂序列在圆环上的跳跃轨迹。
 * 原根遍历所有非零点（轨迹布满整圈），非原根只覆盖一个子群。
 */
import { powerCycle, orbitSize } from './primitiveRoot'

/** 计算余数 r 在圆环上的坐标 */
function ringPos(r: number, p: number, cx: number, cy: number, R: number): [number, number] {
  const a = (r / p) * 2 * Math.PI - Math.PI / 2
  return [cx + R * Math.cos(a), cy + R * Math.sin(a)]
}

export function drawPrimitiveRoot(canvas: HTMLCanvasElement, g: number, p: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const cx = W / 2
  const cy = H / 2
  const R = Math.min(W, H) * 0.38

  const seq = powerCycle(g, p)
  const covered = orbitSize(g, p)
  const isRoot = covered === p - 1

  // 圆环底圈
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, 2 * Math.PI)
  ctx.stroke()

  // 跳跃轨迹（首尾相接成闭环）
  ctx.strokeStyle = isRoot ? '#6366f1' : '#f87171'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= seq.length; i++) {
    const r = seq[i % seq.length]
    const [x, y] = ringPos(r, p, cx, cy, R)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // 各余数节点
  const inCycle = new Set(seq)
  for (let r = 0; r < p; r++) {
    const [x, y] = ringPos(r, p, cx, cy, R)
    ctx.beginPath()
    ctx.arc(x, y, 12, 0, 2 * Math.PI)
    if (r === 0) ctx.fillStyle = '#cbd5e1'
    else if (inCycle.has(r)) ctx.fillStyle = isRoot ? '#6366f1' : '#f87171'
    else ctx.fillStyle = '#f1f5f9'
    ctx.fill()
    ctx.fillStyle = r === 0 || inCycle.has(r) ? '#ffffff' : '#94a3b8'
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(r), x, y)
  }

  // 中心标注
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText(`g=${g}, p=${p}`, cx, cy - 10)
  ctx.fillStyle = isRoot ? '#6366f1' : '#f87171'
  ctx.font = '13px sans-serif'
  ctx.fillText(isRoot ? '原根 · 遍历全部' : `子群 · 覆盖 ${covered}/${p - 1}`, cx, cy + 12)
}
