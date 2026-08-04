/**
 * 截角变换的 Canvas 绘制
 *
 * 完全复用 lib/drawPolyhedron —— 本课不需要自己的渲染层，
 * 只把 truncate() 的结果交给它。这是共享库带来的直接好处。
 */

import { drawPolyhedron } from '../../lib/drawPolyhedron'
import { eulerCount } from '../../lib/polyhedron'
import { truncate, faceProfile, edgeUniformity, type Polyhedron } from './truncation'

export interface DrawOptions {
  base: Polyhedron
  /** 截角深度 */
  t: number
  yaw?: number
  faceAlpha?: number
  /** 叠加显示原立体的线框 */
  showBase?: boolean
  title?: string
  subtitle?: string
}

/** 把面型写成可读文本，如「8 个三角形 + 6 个八边形」 */
export function profileText(p: Polyhedron): string {
  const names: Record<number, string> = {
    3: '三角形', 4: '四边形', 5: '五边形', 6: '六边形',
    8: '八边形', 10: '十边形',
  }
  return Object.entries(faceProfile(p))
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([sides, n]) => `${n} 个${names[Number(sides)] ?? `${sides}边形`}`)
    .join(' + ')
}

export function drawTruncation(
  canvas: HTMLCanvasElement, opts: DrawOptions,
): void {
  const {
    base, t, yaw = 0.6, faceAlpha = 0.62, showBase = false,
    title = '', subtitle = '',
  } = opts

  const poly = truncate(base, t)
  const { V, E, F } = eulerCount(poly)
  const uniform = edgeUniformity(poly) < 1e-9

  drawPolyhedron(canvas, {
    poly,
    // 原立体作为半透明"外壳"叠加，看得出削掉了哪些角
    dual: showBase ? base : undefined,
    title: title || poly.name,
    subtitle: subtitle || profileText(poly),
    yaw,
    faceAlpha,
    edgeColor: 'rgba(226,232,240,0.9)',
    showVertices: false,
    showEuler: true,
    readout: `t = ${t.toFixed(4)} · V=${V} E=${E} F=${F}`
      + (uniform ? ' · 棱等长 ✓' : ''),
  })
}
