/**
 * 遗传算法 Canvas 绘制
 * 上部：适应度地形 + 当前代种群个体分布（随代数向最优峰聚集）
 * 下部：历代最优适应度曲线
 */
import { fitness, type Generation } from './geneticAlgorithm'

/** 绘制某一代的种群分布与收敛曲线 */
export function drawGeneticAlgorithm(
  canvas: HTMLCanvasElement,
  history: Generation[],
  genIndex: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || history.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const idx = Math.max(0, Math.min(genIndex, history.length - 1))
  const gen = history[idx]
  const landH = Math.round(H * 0.62)
  const curveTop = landH + 24

  // 归一化：地形最高点
  let fmax = 0
  for (let i = 0; i <= 100; i++) fmax = Math.max(fmax, fitness(i / 100))
  const px = (x: number) => x * W
  const py = (f: number) => landH - (f / fmax) * (landH - 20) - 10

  // 适应度地形填充
  ctx.beginPath()
  ctx.moveTo(0, landH)
  for (let i = 0; i <= 200; i++) {
    const x = i / 200
    ctx.lineTo(px(x), py(fitness(x)))
  }
  ctx.lineTo(W, landH)
  ctx.closePath()
  ctx.fillStyle = 'rgba(99,102,241,0.14)'
  ctx.fill()
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= 200; i++) {
    const x = i / 200
    const yy = py(fitness(x))
    if (i === 0) ctx.moveTo(px(x), yy)
    else ctx.lineTo(px(x), yy)
  }
  ctx.stroke()

  // 种群个体
  for (const x of gen.pop) {
    ctx.beginPath()
    ctx.arc(px(x), py(fitness(x)), 4, 0, 2 * Math.PI)
    ctx.fillStyle = 'rgba(236,72,153,0.7)'
    ctx.fill()
  }
  // 最优个体
  ctx.beginPath()
  ctx.arc(px(gen.best), py(gen.bestFit), 7, 0, 2 * Math.PI)
  ctx.fillStyle = '#f59e0b'
  ctx.fill()
  ctx.strokeStyle = '#b45309'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#334155'
  ctx.font = '13px sans-serif'
  ctx.fillText(`第 ${idx} 代  最优 x=${gen.best.toFixed(3)}  适应度=${gen.bestFit.toFixed(3)}`, 10, 18)

  // 历代最优曲线
  ctx.strokeStyle = '#94a3b8'
  ctx.beginPath()
  ctx.moveTo(10, H - 10)
  ctx.lineTo(W - 10, H - 10)
  ctx.stroke()
  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 2
  ctx.beginPath()
  const n = history.length
  for (let i = 0; i <= idx; i++) {
    const cx = 10 + (i / Math.max(1, n - 1)) * (W - 20)
    const cy = (H - 10) - (history[i].bestFit / fmax) * (H - curveTop - 12)
    if (i === 0) ctx.moveTo(cx, cy)
    else ctx.lineTo(cx, cy)
  }
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('历代最优适应度', 12, curveTop + 4)
}
