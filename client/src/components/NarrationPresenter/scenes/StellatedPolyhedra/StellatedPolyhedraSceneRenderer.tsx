/**
 * 星形多面体 讲解场景渲染器
 *
 * 多面体用 Canvas 2D + lib/drawPolyhedron 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawPolyhedron } from '../../../../lib/drawPolyhedron'
import {
  stellatedOf, infoOf, STELLATE_BASES, type StellateBase,
} from '../../../../experiments/stellated-polyhedra/stellatedPolyhedra'

const W = 640
const H = 540
const TITLES = {
  'intro-1': { title: '星形多面体', subtitle: '改变形状不改变拓扑' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['每个面拉出一个尖顶', 'V→V+F, E→3E, F→2E', '三个变化恰好抵消'],
  'sum-2': ['χ 保持为 2', '星化不改变拓扑', '开普勒-普安索立体面自相交, χ≠2'],
}

function SolidCanvas({ base, h }: { base: StellateBase; h: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const poly = useMemo(() => stellatedOf(base, h), [base, h])

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
        title: infoOf(base).label,
        subtitle: `h = ${h.toFixed(2)} · ${infoOf(base).note}`,
        showEuler: true,
        ramp: 'plasma',
        edgeColor: 'rgba(255,255,255,0.22)',
        yaw: 0.6 + el * 0.24,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [poly, base, h])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function StellatedPolyhedraSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SolidCanvas base="dodecahedron" h={0.6} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="星形多面体" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const raw = p.base
  const base = (STELLATE_BASES as readonly string[]).includes(raw as string)
    ? (raw as StellateBase)
    : 'dodecahedron'
  return <SolidCanvas base={base} h={typeof p.h === 'number' ? p.h : 0.6} />
}
