/**
 * 阿基米德立体 讲解场景渲染器
 *
 * 多面体用 Canvas 2D + lib/drawPolyhedron 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawPolyhedron } from '../../../../lib/drawPolyhedron'
import { platonicOf } from '../../../../experiments/platonic-solids/platonicSolids'
import {
  truncate, rectify, idealT, infoOf, TRUNC_BASES, type TruncBase,
} from '../../../../experiments/archimedean-solids/archimedeanSolids'

const W = 640
const H = 540
const TITLES = {
  'intro-1': { title: '阿基米德立体', subtitle: '把顶点切掉会得到什么' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['允许多种正多边形面', '但要求所有顶点等价', '共十三种'],
  'sum-2': ['顶点数 = 原棱数 × 2', '面数 = 原面数 + 原顶点数', 'V − E + F 仍等于 2'],
}

function SolidCanvas({ base, t }: { base: TruncBase; t: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  // t=0.5 走 rectify: truncate 在该处会产生重合顶点, V/E/F 会算错
  const poly = useMemo(
    () => (Math.abs(t - 0.5) < 1e-6
      ? rectify(platonicOf(base))
      : truncate(platonicOf(base), t)),
    [base, t],
  )

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawPolyhedron(canvas, {
        poly,
        title: Math.abs(t - 0.5) < 1e-6
          ? `截半${infoOf(base).label.slice(2)}`
          : infoOf(base).label,
        subtitle: `t = ${t.toFixed(4)} · ${infoOf(base).faceDesc}`,
        showVertices: true,
        showEuler: true,
        ramp: 'plasma',
        yaw: 0.6 + el * 0.24,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [poly, base, t])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function ArchimedeanSolidsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SolidCanvas base="cube" t={idealT('cube')} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="阿基米德立体" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const raw = p.base
  const base = (TRUNC_BASES as readonly string[]).includes(raw as string)
    ? (raw as TruncBase)
    : 'cube'
  return (
    <SolidCanvas
      base={base}
      t={typeof p.t === 'number' ? p.t : idealT(base)}
    />
  )
}
