/**
 * 统计初步 Canvas 绘制
 * 画出数据柱状图，并叠加平均数（红）、中位数（青）参考线。
 */

import { mean, median } from './statsBasics'

/**
 * 绘制数据柱状图与集中趋势参考线。
 * @param data 一组数值
 * @param progress 0→1 逐根柱子升起
 */
export function drawStatsBasics(
  canvas: HTMLCanvasElement,
  data: number[],
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)
  if (data.length === 0) return

  const padL = 40
  const padR = 20
  const padT = 30
  const padB = 40
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const maxV = Math.max(...data, 1)
  const yFor = (v: number) => padT + plotH - (v / maxV) * plotH

  // 坐标轴
  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, padT + plotH)
  ctx.lineTo(padL + plotW, padT + plotH)
  ctx.stroke()

  // 柱子
  const gap = plotW / data.length
  const barW = gap * 0.6
  const shown = Math.max(1, Math.floor(data.length * progress))
  for (let i = 0; i < shown; i++) {
    const v = data[i]
    const x = padL + i * gap + (gap - barW) / 2
    const y = yFor(v)
    ctx.fillStyle = '#38bdf8'
    ctx.fillRect(x, y, barW, padT + plotH - y)
    ctx.fillStyle = '#e2e8f0'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(String(v), x + barW / 2, y - 4)
  }

  // 参考线：仅在柱子基本升起后绘制
  if (progress > 0.9) {
    const m = mean(data)
    const md = median(data)
    drawGuide(ctx, padL, padL + plotW, yFor(m), '#f87171', '平均数 ' + m.toFixed(1))
    drawGuide(ctx, padL, padL + plotW, yFor(md), '#22d3ee', '中位数 ' + md.toFixed(1))
  }
}

function drawGuide(
  ctx: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  y: number,
  color: string,
  label: string,
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(x1, y)
  ctx.lineTo(x2, y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = color
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, x1 + 6, y - 4)
  ctx.restore()
}
