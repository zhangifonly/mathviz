/**
 * 二重积分 Canvas 绘制：俯视热力图 + n×n 网格
 *
 * 用颜色深浅表示被积函数 f 在矩形域上的取值（黎曼和的每个柱高），
 * 叠加 n×n 网格线，直观展示中点法逼近曲面下的体积。
 */
import { doubleIntegral, valueRange, type Fn2 } from './multipleIntegral'

/** 值 t∈[0,1] 映射到蓝→青→黄→红的热力色 */
function heat(t: number): [number, number, number] {
  const v = Math.max(0, Math.min(1, t))
  const r = Math.round(255 * Math.min(1, Math.max(0, 1.5 - Math.abs(4 * v - 3))))
  const g = Math.round(255 * Math.min(1, Math.max(0, 1.5 - Math.abs(4 * v - 2))))
  const b = Math.round(255 * Math.min(1, Math.max(0, 1.5 - Math.abs(4 * v - 1))))
  return [r, g, b]
}

export function drawMultipleIntegral(
  canvas: HTMLCanvasElement,
  f: Fn2,
  xa: number,
  xb: number,
  ya: number,
  yb: number,
  n: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const { cells } = doubleIntegral(f, xa, xb, ya, yb, n)
  const [lo, hi] = valueRange(cells)
  const span = hi - lo || 1
  const cw = W / n
  const ch = H / n

  // 每个单元按中心取值上色（y 向下翻转，符合俯视习惯）
  for (const c of cells) {
    const t = (c.value - lo) / span
    const [r, g, b] = heat(t)
    const px = c.i * cw
    const py = (n - 1 - c.j) * ch
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fillRect(px, py, cw + 1, ch + 1)
  }

  // 网格线
  ctx.strokeStyle = 'rgba(15,23,42,0.35)'
  ctx.lineWidth = 1
  for (let i = 0; i <= n; i++) {
    const x = i * cw
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
  for (let j = 0; j <= n; j++) {
    const y = j * ch
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }
}
