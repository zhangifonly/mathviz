/**
 * 隐马尔可夫模型 Canvas 绘制
 * 三行对比：观测符号 / 真实隐状态 / 维特比解码，下方画 DP 网格。
 */
import { viterbi, type HMMModel, type Sequence } from './hiddenMarkov'

type C = CanvasRenderingContext2D

function cell(ctx: C, x: number, y: number, w: number, h: number, color: string, label: string, ok = true) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w - 2, h - 2)
  if (!ok) {
    ctx.strokeStyle = '#dc2626'
    ctx.lineWidth = 2.5
    ctx.strokeRect(x + 1, y + 1, w - 4, h - 4)
  }
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 13px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, x + w / 2, y + h / 2)
}

function rowLabel(ctx: C, x: number, y: number, text: string) {
  ctx.fillStyle = '#475569'
  ctx.font = '12px system-ui'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x - 8, y)
}

const STATE_COLORS = ['#fbbf24', '#38bdf8'] // 晴=金 雨=蓝
const SYMBOL_COLORS = ['#a3e635', '#f472b6', '#c084fc']

/** 绘制序列三行对比 + DP 网格。showDecoded=false 时隐藏解码行（用于铺垫）。 */
export function drawHiddenMarkov(
  canvas: HTMLCanvasElement,
  model: HMMModel,
  seq: Sequence,
  showDecoded = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const n = seq.observed.length
  if (n === 0) return

  const left = 70
  const cw = Math.min(34, (W - left - 16) / n)
  const ch = 30
  const decoded = showDecoded ? viterbi(seq.observed, model) : []

  rowLabel(ctx, left, 24, '观测')
  rowLabel(ctx, left, 60, '真实隐状态')
  if (showDecoded) rowLabel(ctx, left, 96, '维特比解码')

  for (let t = 0; t < n; t++) {
    const x = left + t * cw
    cell(ctx, x, 10, cw, ch, SYMBOL_COLORS[seq.observed[t]], model.symbols[seq.observed[t]][0])
    cell(ctx, x, 46, cw, ch, STATE_COLORS[seq.hidden[t]], model.states[seq.hidden[t]])
    if (showDecoded) {
      const ok = decoded[t] === seq.hidden[t]
      cell(ctx, x, 82, cw, ch, STATE_COLORS[decoded[t]], model.states[decoded[t]], ok)
    }
  }

  drawDPGrid(ctx, model, seq, decoded, left, 140, W - left - 16, H - 150)
}

function drawDPGrid(ctx: C, model: HMMModel, seq: Sequence, decoded: number[], ox: number, oy: number, gw: number, gh: number) {
  const N = model.states.length
  const T = seq.observed.length
  const cw = gw / T
  const rh = Math.min(30, gh / N)
  ctx.font = '11px system-ui'
  for (let i = 0; i < N; i++) {
    rowLabel(ctx, ox, oy + i * rh + rh / 2, model.states[i])
    for (let t = 0; t < T; t++) {
      const x = ox + t * cw
      const y = oy + i * rh
      const onPath = decoded.length > 0 && decoded[t] === i
      ctx.fillStyle = onPath ? STATE_COLORS[i] : '#e2e8f0'
      ctx.fillRect(x + 1, y + 1, cw - 2, rh - 2)
      if (onPath) {
        ctx.fillStyle = '#0f172a'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('●', x + cw / 2, y + rh / 2)
      }
    }
  }
  ctx.fillStyle = '#64748b'
  ctx.textAlign = 'left'
  ctx.fillText('DP 网格：高亮格为最优路径', ox, oy + N * rh + 16)
}
