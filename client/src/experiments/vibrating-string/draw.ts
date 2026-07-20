/**
 * 弦振动 Canvas 绘制
 * 画出弦的当前叠加形状，并叠加各驻波模态的包络（节点/腹）。
 */
import { sampleString, modeShape, modeNodes, type Mode } from './vibratingString'

const PALETTE = ['#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24', '#f87171']
const L = 1
const C = 1

/**
 * @param modes   参与叠加的模态
 * @param t       当前时刻
 * @param showModes 是否叠加各模态的独立包络虚线
 */
export function drawVibratingString(
  canvas: HTMLCanvasElement,
  modes: Mode[],
  t: number,
  showModes = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const padX = 40
  const midY = H / 2
  const spanX = W - padX * 2
  const scaleY = H * 0.32
  const toX = (x: number) => padX + (x / L) * spanX
  const toY = (y: number) => midY - y * scaleY

  // 平衡位置基准线
  ctx.strokeStyle = '#cbd5e1'
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(toX(0), midY)
  ctx.lineTo(toX(L), midY)
  ctx.stroke()
  ctx.setLineDash([])

  // 各模态包络虚线 + 节点
  if (showModes) {
    modes.forEach((m, i) => {
      const color = PALETTE[(m.n - 1) % PALETTE.length]
      ctx.strokeStyle = color
      ctx.globalAlpha = 0.4
      ctx.lineWidth = 1.5
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      const single = sampleString([m], 120, t, L, C)
      single.forEach((p, k) => {
        const px = toX(p.x)
        const py = toY(p.y)
        if (k === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.stroke()
      ctx.setLineDash([])
      ctx.globalAlpha = 1
      // 内部节点标记
      ctx.fillStyle = color
      for (const nx of modeNodes(m.n, L)) {
        ctx.beginPath()
        ctx.arc(toX(nx), midY, 3, 0, 2 * Math.PI)
        ctx.fill()
      }
      void i
    })
  }

  // 叠加后的弦（主曲线）
  const pts = sampleString(modes, 160, t, L, C)
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 3
  ctx.beginPath()
  pts.forEach((p, k) => {
    const px = toX(p.x)
    const py = toY(p.y)
    if (k === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.stroke()

  // 两端固定点
  ctx.fillStyle = '#0f172a'
  for (const ex of [0, L]) {
    ctx.beginPath()
    ctx.arc(toX(ex), midY, 5, 0, 2 * Math.PI)
    ctx.fill()
  }
  void modeShape
}
