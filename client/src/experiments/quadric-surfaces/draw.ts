/**
 * 二次曲面的 Canvas 绘制
 *
 * 六种曲面共用一个绘制入口, 按 kind 取各自的参数域。
 * 双叶双曲面要画两片(参数化只给上片, 下片由 x 取反得到)。
 */

import { makeCamera, sampleSurface, normalizeGrid, type Vec3 } from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import { quadric, paramRange, infoOf, type QuadricKind } from './quadricSurfaces'

export interface DrawOptions {
  kind: QuadricKind
  a?: number
  b?: number
  c?: number
  yaw?: number
  ramp?: string
}

export function drawQuadric(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { kind, a = 1, b = 1, c = 1, yaw = 0.6, ramp = 'viridis' } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw,
    pitch: 0.32,
    scale: Math.min(W, H) * 0.34,
    cx: W / 2,
    cy: H / 2,
  })

  const { u, v } = paramRange(kind)
  const grid = sampleSurface((uu, vv) => quadric(kind, uu, vv, a, b, c), u, v, 72, 30)

  drawAxes3D(ctx, cam, 1.4)

  if (kind === 'hyperboloid2') {
    // 双叶: 参数化只给沿 +x 张开的上片, 镜像出下片
    const mirror: Vec3[][] = grid.map((row) => row.map((p) => [-p[0], p[1], p[2]] as Vec3))
    // 两片一起归一化, 保证相对位置正确
    const all = normalizeGrid([...grid, ...mirror])
    const half = grid.length
    drawSurface(ctx, all.slice(0, half), cam, { ramp, colorBy: 'radius', stroke: 'rgba(255,255,255,0.12)' })
    drawSurface(ctx, all.slice(half), cam, { ramp, colorBy: 'radius', stroke: 'rgba(255,255,255,0.12)' })
  } else {
    drawSurface(ctx, normalizeGrid(grid), cam, {
      ramp,
      colorBy: kind === 'ellipsoid' ? 'radius' : 'z',
      stroke: 'rgba(255,255,255,0.12)',
    })
  }

  drawLabel(ctx, kind, W)
}

function drawLabel(ctx: CanvasRenderingContext2D, kind: QuadricKind, W: number): void {
  const info = infoOf(kind)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(info.label, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(info.equation, 18, 52)
  ctx.textAlign = 'right'
  const tags = [info.ruled ? '直纹面' : '非直纹', `${info.pieces} 个连通分支`]
  ctx.fillText(tags.join(' · '), W - 18, 30)
  ctx.fillText(info.note, W - 18, 52)
  ctx.restore()
}
