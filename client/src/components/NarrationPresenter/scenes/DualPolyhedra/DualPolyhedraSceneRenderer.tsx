/**
 * 对偶多面体 讲解场景渲染器
 *
 * 用 Canvas 2D + 本实验专属的 draw.ts(要同时画原体/对偶/中球三层)。
 * 不用 Plotly, 见 draw3d.ts 顶部说明。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawDual } from '../../../../experiments/dual-polyhedra/draw'
import {
  solidOf, vef, dualName, PLATONIC, type SolidId,
} from '../../../../experiments/dual-polyhedra/dualPolyhedra'

const W = 600
const H = 540
const IDS: readonly string[] = [
  'tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron',
]
const TITLES = {
  'intro-1': { title: '对偶多面体', subtitle: '面变顶点，顶点变面' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['面变顶点、顶点变面', '棱数保持不变', 'χ = V−E+F 两边都是 2'],
  'sum-2': ['极反演: 距原点 R²/d', '面越近对偶顶点越远', '对偶棱与原棱垂直'],
}

function DualCanvas({
  solidId, showDual, showMid, fillFaces,
}: {
  solidId: SolidId; showDual: boolean; showMid: boolean; fillFaces: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const solid = useMemo(() => solidOf(solidId), [solidId])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      const [V, E, F] = vef(solid)
      const partner = PLATONIC.find((p) => p.id === dualName(solidId))?.label ?? ''
      drawDual(canvas, {
        solid, showDual, showMidsphere: showMid, fillFaces,
        title: `${solid.label}（V=${V} E=${E} F=${F}）`,
        subtitle: showDual ? `对偶是${partner}` : '',
        yaw: 0.6 + el * 0.22,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [solid, solidId, showDual, showMid, fillFaces])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function DualPolyhedraSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return <DualCanvas solidId="cube" showDual showMid fillFaces />
  }
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="对偶多面体" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const solidId = IDS.includes(p.solidId as string) ? (p.solidId as SolidId) : 'cube'
  return (
    <DualCanvas
      solidId={solidId}
      showDual={p.showDual !== false}
      showMid={p.showMid !== false}
      fillFaces={p.fillFaces !== false}
    />
  )
}
