/**
 * 双摆混沌 Canvas 绘制
 *
 * 绘制两根摆杆、两个质点，并用一条渐隐的轨迹记录第二质点划过的路径，
 * 直观呈现混沌运动的复杂形状。绘制本身无状态推进，物理由组件负责。
 */

import { positions, DEFAULT_PARAMS, type PendulumState, type PendulumParams } from './doublePendulum'

/** 轨迹点（第二质点的历史屏幕坐标） */
export interface TrailPoint {
  x: number
  y: number
}

export interface DrawData {
  state: PendulumState
  trail: TrailPoint[]
  params?: PendulumParams
}

/**
 * 绘制一帧双摆。
 * @param progress 0→1，用于入场时质点与杆的淡入
 */
export function drawDoublePendulum(
  canvas: HTMLCanvasElement,
  data: DrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const p = data.params ?? DEFAULT_PARAMS
  const originX = W / 2
  const originY = H * 0.36
  // 两段杆总长映射到画布高度的一部分
  const scale = (Math.min(W, H) * 0.32) / (p.l1 + p.l2)

  const pos = positions(data.state, p)
  const px1 = originX + pos.x1 * scale
  const py1 = originY + pos.y1 * scale
  const px2 = originX + pos.x2 * scale
  const py2 = originY + pos.y2 * scale

  // 轨迹：越旧越淡
  const trail = data.trail
  if (trail.length > 1) {
    for (let i = 1; i < trail.length; i++) {
      const t = i / trail.length
      ctx.strokeStyle = `rgba(56, 189, 248, ${t * 0.7})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y)
      ctx.lineTo(trail[i].x, trail[i].y)
      ctx.stroke()
    }
  }

  const alpha = Math.max(0, Math.min(1, progress))
  ctx.globalAlpha = alpha

  // 摆杆
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(originX, originY)
  ctx.lineTo(px1, py1)
  ctx.lineTo(px2, py2)
  ctx.stroke()

  // 支点
  ctx.fillStyle = '#94a3b8'
  ctx.beginPath()
  ctx.arc(originX, originY, 5, 0, Math.PI * 2)
  ctx.fill()

  // 第一质点
  ctx.fillStyle = '#fbbf24'
  ctx.beginPath()
  ctx.arc(px1, py1, 9, 0, Math.PI * 2)
  ctx.fill()

  // 第二质点
  ctx.fillStyle = '#f472b6'
  ctx.beginPath()
  ctx.arc(px2, py2, 9, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalAlpha = 1
}

/** 把第二质点当前屏幕坐标算出来，供组件累积轨迹用 */
export function bobScreenPos(
  canvas: HTMLCanvasElement,
  state: PendulumState,
  params: PendulumParams = DEFAULT_PARAMS,
): TrailPoint {
  const W = canvas.width
  const H = canvas.height
  const originX = W / 2
  const originY = H * 0.36
  const scale = (Math.min(W, H) * 0.32) / (params.l1 + params.l2)
  const pos = positions(state, params)
  return { x: originX + pos.x2 * scale, y: originY + pos.y2 * scale }
}
