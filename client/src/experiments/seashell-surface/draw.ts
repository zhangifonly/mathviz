/**
 * 海螺曲面 的 Canvas 绘制
 *
 * 讲解层用这套 Canvas 2D 画法(可 rAF 逐帧自转); 实验页那侧另用 Plotly 的
 * surface, 让用户能自己拖拽旋转。两边共用 seashellSurface.ts 的参数方程。
 */

import { makeCamera, sampleSurface, normalizeGrid } from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import { seashellAt, U_RANGE, V_RANGE } from './seashellSurface'

export interface DrawOptions {
  alpha: number
  /** 自转角 */
  yaw?: number
  ramp?: string
  /** 只画线框, 用于强调网格结构 */
  wireOnly?: boolean
}

export function drawSeashellSurface(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { alpha, yaw = 0.6, ramp = 'plasma' } = opts
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
    sampleSurface(
      (u, v) => seashellAt(u, v, alpha),
      U_RANGE, V_RANGE, 140, 28,
    ),
  )
  drawAxes3D(ctx, cam, 1.35)
  drawSurface(ctx, grid, cam, {
    ramp,
    colorBy: 'radius',
    stroke: 'rgba(255,255,255,0.12)',
  })
  drawLabel(ctx, opts, W)
}

function drawLabel(ctx: CanvasRenderingContext2D, o: DrawOptions, W: number): void {
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText('海螺曲面', 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText('生长角 α = ' + o.alpha.toFixed(2), 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText('自相似生长的几何', W - 18, 30)
  ctx.restore()
}
