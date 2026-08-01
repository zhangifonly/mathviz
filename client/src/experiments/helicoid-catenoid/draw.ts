/**
 * 螺旋面↔悬链面变形的 Canvas 绘制
 *
 * 讲解层用这套 Canvas 2D 画法(可 rAF 逐帧自转); 实验页那侧另用 Plotly 的
 * surface, 让用户能自己拖拽旋转。两边共用 helicoidCatenoid.ts 的参数方程。
 */

import {
  makeCamera, sampleSurface, normalizeGrid, project, type Camera,
} from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import { associateFamily, U_RANGE, V_RANGE } from './helicoidCatenoid'

export interface DrawOptions {
  /** 伴随族参数, 0=螺旋面 PI/2=悬链面 */
  theta: number
  /** 自转角 */
  yaw?: number
  /** 是否画出螺旋面的那族直线 */
  showRulings?: boolean
  ramp?: string
}

export function drawHelicoidCatenoid(
  canvas: HTMLCanvasElement,
  opts: DrawOptions,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { theta, yaw = 0.6, showRulings = false, ramp = 'viridis' } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw,
    pitch: 0.32,
    scale: Math.min(W, H) * 0.38,
    cx: W / 2,
    cy: H / 2,
  })

  const grid = normalizeGrid(
    sampleSurface((u, v) => associateFamily(u, v, theta), U_RANGE, V_RANGE, 72, 16),
  )
  drawAxes3D(ctx, cam, 1.35)
  drawSurface(ctx, grid, cam, { ramp, colorBy: 'z', stroke: 'rgba(255,255,255,0.12)' })

  if (showRulings) drawRulings(ctx, cam, theta)
  drawLabel(ctx, theta, W)
}

/** 螺旋面上每点都有一条水平直线穿过, 把这族直线单独描出来 */
function drawRulings(ctx: CanvasRenderingContext2D, cam: Camera, theta: number): void {
  const grid = normalizeGrid(
    sampleSurface((u, v) => associateFamily(u, v, theta), U_RANGE, V_RANGE, 72, 16),
  )
  ctx.save()
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)'
  ctx.lineWidth = 1.4
  // 每隔几行画一条 v 向的参数线, theta=0 时它就是直线
  for (let i = 0; i < grid.length; i += 6) {
    ctx.beginPath()
    grid[i].forEach((p, j) => {
      const q = project(p, cam)
      if (j === 0) ctx.moveTo(q.x, q.y)
      else ctx.lineTo(q.x, q.y)
    })
    ctx.stroke()
  }
  ctx.restore()
}

function drawLabel(ctx: CanvasRenderingContext2D, theta: number, W: number): void {
  const deg = (theta * 180) / Math.PI
  const name = theta < 0.05 ? '螺旋面' : theta > Math.PI / 2 - 0.05 ? '悬链面' : '中间极小曲面'
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(name, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(`θ = ${deg.toFixed(0)}°   平均曲率 H ≡ 0`, 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText('等距变形 · 长度处处不变', W - 18, 30)
  ctx.restore()
}
