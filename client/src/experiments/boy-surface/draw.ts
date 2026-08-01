/**
 * 博伊曲面的 Canvas 绘制
 *
 * 讲解层用这套 Canvas 2D 画法(可 rAF 逐帧自转); 实验页那侧另用 Plotly 的
 * surface, 让用户能自己拖拽旋转。两边共用 boySurface.ts 的参数化。
 */

import { makeCamera, sampleSurface, normalizeGrid } from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import { boySurface, U_RANGE, V_RANGE, antipodalGap } from './boySurface'

export interface DrawOptions {
  /** 自转角 */
  yaw?: number
  /** 俯仰角。从上方俯视(较大 pitch)才看得清三重对称 */
  pitch?: number
  ramp?: string
  /** 是否在左下角显示对径点粘合偏差 */
  showGap?: boolean
}

export function drawBoySurface(canvas: HTMLCanvasElement, opts: DrawOptions = {}): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { yaw = 0.6, pitch = 0.34, ramp = 'viridis', showGap = false } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw,
    pitch,
    scale: Math.min(W, H) * 0.36,
    cx: W / 2,
    cy: H / 2,
  })

  // theta 沿边界一圈, r 从中心到边界
  const grid = normalizeGrid(
    sampleSurface((t, r) => boySurface(t, r), U_RANGE, V_RANGE, 96, 32),
  )
  drawAxes3D(ctx, cam, 1.35)
  drawSurface(ctx, grid, cam, {
    ramp,
    colorBy: 'radius',
    stroke: 'rgba(255,255,255,0.1)',
  })
  drawLabel(ctx, W, showGap)
}

function drawLabel(ctx: CanvasRenderingContext2D, W: number, showGap: boolean): void {
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText('博伊曲面', 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText('分支点 0 个 · 三重点 1 个', 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText('没有分支点的射影平面浸入', W - 18, 30)
  if (showGap) {
    ctx.textAlign = 'left'
    // 边界上 w 与 -w 的像点距离, 理论为 0
    const gap = antipodalGap(1.1)
    ctx.fillText(`对径点粘合偏差 ${gap.toExponential(1)}`, 18, 74)
  }
  ctx.restore()
}
