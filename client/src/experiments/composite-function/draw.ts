/**
 * 复合函数 Canvas 绘制
 * 画 g、f、以及复合 f∘g 三条曲线，并用箭头演示 x -> g(x) -> f(g(x)) 的两步映射。
 */
import { compose, sampleCurve, type Point } from './compositeFunction'

const DOM: [number, number] = [-2, 2]
const RNG: [number, number] = [-3, 5]
const COL_G = '#22d3ee'
const COL_F = '#fbbf24'
const COL_C = '#ec4899'

interface Mapper {
  px: (x: number) => number
  py: (y: number) => number
}

function makeMapper(W: number, H: number): Mapper {
  const pad = 34
  return {
    px: (x) => pad + ((x - DOM[0]) / (DOM[1] - DOM[0])) * (W - 2 * pad),
    py: (y) => H - pad - ((y - RNG[0]) / (RNG[1] - RNG[0])) * (H - 2 * pad),
  }
}

function strokeCurve(ctx: CanvasRenderingContext2D, m: Mapper, pts: Point[], color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 2.4
  ctx.beginPath()
  let started = false
  for (const p of pts) {
    const y = Math.max(RNG[0] - 1, Math.min(RNG[1] + 1, p.y))
    const X = m.px(p.x)
    const Y = m.py(y)
    if (!started) { ctx.moveTo(X, Y); started = true } else ctx.lineTo(X, Y)
  }
  ctx.stroke()
}

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
  const ang = Math.atan2(y2 - y1, x2 - x1)
  ctx.beginPath(); ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - 8 * Math.cos(ang - 0.4), y2 - 8 * Math.sin(ang - 0.4))
  ctx.lineTo(x2 - 8 * Math.cos(ang + 0.4), y2 - 8 * Math.sin(ang + 0.4))
  ctx.closePath(); ctx.fill()
}

export function drawCompositeFunction(
  canvas: HTMLCanvasElement,
  f: (x: number) => number,
  g: (x: number) => number,
  demoX: number | null = null,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const m = makeMapper(W, H)
  ctx.clearRect(0, 0, W, H)

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(m.px(DOM[0]), m.py(0)); ctx.lineTo(m.px(DOM[1]), m.py(0))
  ctx.moveTo(m.px(0), m.py(RNG[0])); ctx.lineTo(m.px(0), m.py(RNG[1]))
  ctx.stroke()

  const N = 240
  strokeCurve(ctx, m, sampleCurve(g, DOM[0], DOM[1], N), COL_G)
  strokeCurve(ctx, m, sampleCurve(f, DOM[0], DOM[1], N), COL_F)
  strokeCurve(ctx, m, sampleCurve(compose(f, g), DOM[0], DOM[1], N), COL_C)
  if (demoX !== null) drawDemo(ctx, m, f, g, demoX)
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 2 * Math.PI); ctx.fill()
}

function drawDemo(ctx: CanvasRenderingContext2D, m: Mapper, f: (x: number) => number, g: (x: number) => number, x: number) {
  const gx = g(x)
  const fgx = f(gx)
  const clamp = (v: number) => Math.max(RNG[0], Math.min(RNG[1], v))
  const gxc = Math.max(DOM[0], Math.min(DOM[1], gx))
  // 步骤1: x 轴上的 x 向上到 g 曲线
  arrow(ctx, m.px(x), m.py(0), m.px(x), m.py(clamp(gx)), COL_G)
  dot(ctx, m.px(x), m.py(clamp(gx)), COL_G)
  // 步骤2: g(x) 作为新输入，横移到 x 轴对应位置
  arrow(ctx, m.px(x), m.py(clamp(gx)), m.px(gxc), m.py(0), '#94a3b8')
  // 步骤3: 从 g(x) 位置向上到 f 曲线，得到 f(g(x))
  arrow(ctx, m.px(gxc), m.py(0), m.px(gxc), m.py(clamp(fgx)), COL_F)
  dot(ctx, m.px(gxc), m.py(clamp(fgx)), COL_C)
  ctx.fillStyle = '#0f172a'
  ctx.font = '13px sans-serif'
  ctx.fillText('x=' + x.toFixed(2) + '  g(x)=' + gx.toFixed(2) + '  f(g(x))=' + fgx.toFixed(2), 40, 20)
}
