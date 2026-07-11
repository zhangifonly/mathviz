/**
 * 模拟退火 Canvas 绘制
 *
 * 画能量曲线，并按 progress 揭示退火轨迹：
 * 当前点、历史最优点、以及温度/接受情况的实时信息。
 */

import type { AnnealResult } from './simulatedAnnealing'

/**
 * 绘制模拟退火过程。
 * @param data runAnneal 的返回结果
 * @param progress 0→1 揭示轨迹的进度
 */
export function drawSimulatedAnnealing(
  canvas: HTMLCanvasElement,
  data: AnnealResult,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const pad = 40
  const [lo, hi] = data.domain
  const yLo = data.yMin
  const yHi = data.yMax
  const spanY = yHi - yLo || 1

  const toX = (x: number) => pad + ((x - lo) / (hi - lo)) * (W - 2 * pad)
  const toY = (y: number) => H - pad - ((y - yLo) / spanY) * (H - 2 * pad)

  // 能量曲线
  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 2
  ctx.beginPath()
  data.samples.forEach((p, i) => {
    const px = toX(p.x)
    const py = toY(p.y)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.stroke()

  const traj = data.trajectory
  if (traj.length === 0) return
  const upto = Math.max(1, Math.floor(traj.length * progress))

  // 已走过的接受点连线（轨迹）
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  let started = false
  for (let i = 0; i < upto; i++) {
    const s = traj[i]
    const px = toX(s.x)
    const py = toY(s.energy)
    if (!started) {
      ctx.moveTo(px, py)
      started = true
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.stroke()

  const cur = traj[upto - 1]

  // 历史最优点（绿色）
  const bx = toX(cur.bestX)
  const by = toY(cur.bestEnergy)
  ctx.fillStyle = '#34d399'
  ctx.beginPath()
  ctx.arc(bx, by, 7, 0, Math.PI * 2)
  ctx.fill()

  // 当前点（暖色，温度越高越红，越低越黄）
  const t = Math.min(1, cur.temperature / (traj[0].temperature || 1))
  const r = Math.round(251)
  const g = Math.round(146 + (191 - 146) * (1 - t))
  const b = Math.round(60)
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
  const cx = toX(cur.x)
  const cy = toY(cur.energy)
  ctx.beginPath()
  ctx.arc(cx, cy, 6, 0, Math.PI * 2)
  ctx.fill()

  // 温度光晕：温度越高，当前点周围的探索半径越大
  ctx.strokeStyle = `rgba(251, 146, 60, ${0.15 + 0.35 * t})`
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, 10 + 30 * t, 0, Math.PI * 2)
  ctx.stroke()

  // 信息面板
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '14px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`步数 ${cur.step + 1} / ${traj.length}`, pad, 22)
  ctx.fillText(`温度 ${cur.temperature.toFixed(3)}`, pad + 140, 22)
  ctx.fillStyle = '#34d399'
  ctx.fillText(`最优能量 ${cur.bestEnergy.toFixed(3)}`, pad + 280, 22)
}
