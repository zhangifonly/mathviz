/**
 * 波的叠加 Canvas 绘制
 *
 * 上半区分别画各分量波（半透明彩色），下半区画叠加后的合成波（高亮）。
 * progress 0→1 控制波形从左向右逐步揭示，并让相位随之推进产生流动感。
 */
import { sampleWaves, type WaveParams } from './sineSuperposition'

const COMPONENT_COLORS = ['#38bdf8', '#f472b6', '#a3e635', '#fbbf24']
const SUM_COLOR = '#f8fafc'
const AXIS_COLOR = 'rgba(148, 163, 184, 0.35)'

/**
 * 绘制波的叠加。
 * @param waves 参与叠加的波列
 * @param progress 0→1，控制揭示进度与相位推进
 */
export function drawSineSuperposition(
  canvas: HTMLCanvasElement,
  waves: WaveParams[],
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  if (waves.length === 0) return

  const N = 400
  // 相位推进：让波形看起来在流动
  const drift = progress * 2 * Math.PI
  const drifted: WaveParams[] = waves.map((w) => ({
    amplitude: w.amplitude,
    frequency: w.frequency,
    phase: w.phase + drift,
  }))
  const sampled = sampleWaves(drifted, N)

  // 估算幅度范围用于纵向缩放
  let maxAmp = 0
  for (const w of waves) maxAmp += Math.abs(w.amplitude)
  maxAmp = Math.max(0.5, maxAmp)

  const topH = H * 0.45
  const botY = H * 0.5
  const botH = H * 0.45
  const topMid = topH / 2 + 8
  const botMid = botY + botH / 2 + 8
  const topScale = (topH / 2 - 8) / maxAmp
  const botScale = (botH / 2 - 8) / maxAmp

  const reveal = Math.max(0.02, progress)
  const upto = Math.floor(N * reveal)

  // 中轴线
  ctx.strokeStyle = AXIS_COLOR
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, topMid)
  ctx.lineTo(W, topMid)
  ctx.moveTo(0, botMid)
  ctx.lineTo(W, botMid)
  ctx.stroke()

  // 上半区：各分量波
  for (let k = 0; k < sampled.components.length; k++) {
    ctx.strokeStyle = COMPONENT_COLORS[k % COMPONENT_COLORS.length]
    ctx.globalAlpha = 0.85
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= upto && i < N; i++) {
      const px = (W * i) / (N - 1)
      const py = topMid - sampled.components[k][i] * topScale
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // 下半区：叠加合成波
  ctx.strokeStyle = SUM_COLOR
  ctx.lineWidth = 2.6
  ctx.beginPath()
  for (let i = 0; i <= upto && i < N; i++) {
    const px = (W * i) / (N - 1)
    const py = botMid - sampled.sum[i] * botScale
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}
