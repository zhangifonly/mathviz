/**
 * 双曲抛物面的 Canvas 绘制
 *
 * 本实验的看点是「两族直线铺满弯曲曲面」, 所以绘制层要能单独高亮这两族,
 * 不能只画一张曲面 —— 这也是它不套通用脚手架的原因。
 */

import { makeCamera, normalizeGrid, sampleSurface, project } from '../../lib/proj3d'
import type { Camera } from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import { ruled } from './hyperbolicParaboloid'

export interface DrawOptions {
  a: number
  b: number
  yaw?: number
  ramp?: string
  /** 显示第一族直线(黄) */
  family1?: boolean
  /** 显示第二族直线(青) */
  family2?: boolean
  /** 曲面本身的不透明度, 想突出直线时调低 */
  surfaceAlpha?: number
}

const S_RANGE: [number, number] = [-1, 1]
const T_RANGE: [number, number] = [-1, 1]

export function drawHyperbolicParaboloid(
  canvas: HTMLCanvasElement,
  opts: DrawOptions,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    a, b, yaw = 0.6, ramp = 'coolwarm',
    family1 = false, family2 = false, surfaceAlpha = 1,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw,
    pitch: 0.34,
    scale: Math.min(W, H) * 0.34,
    cx: W / 2,
    cy: H / 2,
  })

  // 用直纹参数化采样, 网格线本身就沿两族直线方向
  const grid = normalizeGrid(
    sampleSurface((s, t) => ruled(s, t, a, b), S_RANGE, T_RANGE, 40, 40),
  )
  drawAxes3D(ctx, cam, 1.35)
  drawSurface(ctx, grid, cam, {
    ramp,
    colorBy: 'z',
    stroke: surfaceAlpha < 1 ? null : 'rgba(255,255,255,0.1)',
    alpha: surfaceAlpha,
  })

  if (family1) drawFamily(ctx, cam, grid, 'row', 'rgba(253, 224, 71, 0.95)')
  if (family2) drawFamily(ctx, cam, grid, 'col', 'rgba(103, 232, 249, 0.95)')
  drawLabel(ctx, opts, W)
}

/**
 * 沿网格的行或列描出直线。
 * 因为采样用的是直纹参数化, 固定 t 的那一行本身就是一条空间直线,
 * 所以只连首尾两点即可 —— 中间点必然共线。
 */
function drawFamily(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  grid: ReturnType<typeof normalizeGrid>,
  dir: 'row' | 'col',
  color: string,
): void {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  const n = dir === 'row' ? grid.length : grid[0].length
  for (let k = 0; k < n; k += 4) {
    const first = dir === 'row' ? grid[k][0] : grid[0][k]
    const last = dir === 'row' ? grid[k][grid[k].length - 1] : grid[grid.length - 1][k]
    const p = project(first, cam)
    const q = project(last, cam)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(q.x, q.y)
    ctx.stroke()
  }
  ctx.restore()
}

function drawLabel(ctx: CanvasRenderingContext2D, o: DrawOptions, W: number): void {
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText('双曲抛物面', 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(`a = ${o.a.toFixed(2)}   b = ${o.b.toFixed(2)}   K < 0 处处成立`, 18, 52)
  ctx.textAlign = 'right'
  const tag = o.family1 && o.family2 ? '两族直线铺满曲面'
    : o.family1 ? '第一族直线'
      : o.family2 ? '第二族直线' : '处处是鞍点'
  ctx.fillText(tag, W - 18, 30)
  ctx.restore()
}
