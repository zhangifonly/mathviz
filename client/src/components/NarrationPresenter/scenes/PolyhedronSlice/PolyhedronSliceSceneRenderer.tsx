/**
 * 多面体截面 讲解场景渲染器
 *
 * 立体交给 lib/drawPolyhedron，截面由本实验 draw.ts 叠加。
 * 不用 Plotly, 见 draw3d.ts 顶部说明。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawSlice } from '../../../../experiments/polyhedron-slice/draw'
import {
  baseSolid, presetOf, unit,
} from '../../../../experiments/polyhedron-slice/polyhedronSlice'

const W = 600
const H = 540
const TITLES = {
  'intro-1': { title: '多面体截面', subtitle: '立方体能切出正六边形' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['逐面求交线段', '再把线段接成环', '不排序就画成乱线'],
  'sum-2': ['立方体切出正六边形', '正四面体切出正方形', '截面边数 ≤ 面数'],
}

function SliceCanvas({ presetId, d }: { presetId: string; d?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const preset = useMemo(() => presetOf(presetId), [presetId])
  const poly = useMemo(() => baseSolid(preset.solid), [preset])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawSlice(canvas, {
        poly,
        plane: { n: unit(preset.n), d: d ?? preset.d },
        yaw: 0.6 + el * 0.2,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [poly, preset, d])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function PolyhedronSliceSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SliceCanvas presetId="cube-hex" />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="多面体截面" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <SliceCanvas
      presetId={typeof p.presetId === 'string' ? p.presetId : 'cube-hex'}
      d={typeof p.d === 'number' ? p.d : undefined}
    />
  )
}
