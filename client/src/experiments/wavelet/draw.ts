/**
 * 小波变换 Canvas 绘制
 *
 * 上半区：原始时域信号折线
 * 下半区：连续小波变换的尺度图（时频热力图），横轴时间、纵轴尺度，
 *         颜色表示小波系数幅度——这正是小波"同时看到时间和频率"的体现。
 */

export interface WaveletDrawData {
  signal: number[]
  scaleogram: number[][] // 尺度数 × 时间
}

/** 系数幅度 → 颜色（蓝→青→黄→红 的类 jet 映射，0 幅度偏暗） */
function heatColor(t: number): string {
  const x = Math.max(0, Math.min(1, t))
  const r = Math.round(255 * Math.min(1, Math.max(0, 1.5 - Math.abs(4 * x - 3))))
  const g = Math.round(255 * Math.min(1, Math.max(0, 1.5 - Math.abs(4 * x - 2))))
  const b = Math.round(255 * Math.min(1, Math.max(0, 1.5 - Math.abs(4 * x - 1))))
  return `rgb(${r},${g},${b})`
}

/**
 * 绘制信号 + 尺度图。
 * @param progress 0→1，控制时间轴从左到右逐步揭示
 */
export function drawWavelet(
  canvas: HTMLCanvasElement,
  data: WaveletDrawData,
  progress: number,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const { signal, scaleogram } = data
  const n = signal.length
  if (n === 0) return

  const p = Math.max(0, Math.min(1, progress))
  const revealCols = Math.max(1, Math.floor(n * p))

  const signalH = Math.floor(H * 0.32)
  const gap = 12
  const heatY = signalH + gap
  const heatH = H - heatY

  drawSignal(ctx, signal, revealCols, W, signalH)
  drawScaleogram(ctx, scaleogram, revealCols, n, W, heatY, heatH)
}

/** 上半区：时域信号折线 */
function drawSignal(
  ctx: CanvasRenderingContext2D,
  signal: number[],
  revealCols: number,
  W: number,
  h: number,
): void {
  const n = signal.length
  let max = 1e-6
  for (const v of signal) max = Math.max(max, Math.abs(v))
  const midY = h / 2

  // 零基准线
  ctx.strokeStyle = 'rgba(148,163,184,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, midY)
  ctx.lineTo(W, midY)
  ctx.stroke()

  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < revealCols; i++) {
    const x = (i / (n - 1)) * W
    const y = midY - (signal[i] / max) * (h / 2 - 6)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

/** 下半区：尺度图热力图。行=尺度（顶部小尺度/高频，底部大尺度/低频） */
function drawScaleogram(
  ctx: CanvasRenderingContext2D,
  scaleogram: number[][],
  revealCols: number,
  n: number,
  W: number,
  y0: number,
  h: number,
): void {
  const rows = scaleogram.length
  if (rows === 0 || h <= 0) return

  // 归一化到最大幅度
  let max = 1e-6
  for (const row of scaleogram) for (const v of row) max = Math.max(max, Math.abs(v))

  const colW = W / n
  const rowH = h / rows
  for (let r = 0; r < rows; r++) {
    const row = scaleogram[r]
    const y = y0 + r * rowH
    for (let c = 0; c < revealCols; c++) {
      const mag = Math.abs(row[c]) / max
      ctx.fillStyle = heatColor(mag)
      ctx.fillRect(c * colW, y, Math.ceil(colW) + 0.5, Math.ceil(rowH) + 0.5)
    }
  }

  // 轴标注
  ctx.fillStyle = 'rgba(226,232,240,0.75)'
  ctx.font = '12px sans-serif'
  ctx.fillText('尺度小 / 高频', 6, y0 + 14)
  ctx.fillText('尺度大 / 低频', 6, y0 + h - 8)
  ctx.fillText('时间 →', W - 56, y0 + h - 8)
}
