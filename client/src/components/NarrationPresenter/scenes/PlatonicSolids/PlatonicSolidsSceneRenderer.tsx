/**
 * 柏拉图立体 讲解场景渲染器
 *
 * 多面体用 Canvas 2D + lib/drawPolyhedron 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawPolyhedron } from '../../../../lib/drawPolyhedron'
import { dualOf } from '../../../../lib/polyhedron'
import {
  platonicOf, infoOf, PLATONIC_KINDS, type PlatonicKind,
} from '../../../../experiments/platonic-solids/platonicSolids'

const W = 640
const H = 540
const TITLES = {
  'intro-1': { title: '柏拉图立体', subtitle: '为什么恰好只有五种' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['正多面体恰好五种', '由 (p−2)(q−2) < 4 完全决定', '欧几里得《几何原本》第十三卷'],
  'sum-2': ['V − E + F = 2', '检验多面体数据的最强判据', '欧拉特征数是拓扑不变量'],
}

function SolidCanvas({
  kind, showDual, showEuler,
}: { kind: PlatonicKind; showDual: boolean; showEuler: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  // 对偶要算面心与环序排序, 按 kind 缓存避免每帧重算
  const poly = useMemo(() => platonicOf(kind), [kind])
  const dual = useMemo(() => (showDual ? dualOf(poly) : undefined), [poly, showDual])

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
        title: infoOf(kind).label,
        subtitle: infoOf(kind).note,
        dual,
        faceAlpha: showDual ? 0.62 : 1,
        showVertices: true,
        showEuler,
        yaw: 0.6 + el * 0.24,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [poly, dual, kind, showDual, showEuler])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function PlatonicSolidsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SolidCanvas kind="dodecahedron" showDual={false} showEuler />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="柏拉图立体" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const raw = p.kind
  const kind = (PLATONIC_KINDS as readonly string[]).includes(raw as string)
    ? (raw as PlatonicKind)
    : 'dodecahedron'
  return (
    <SolidCanvas
      kind={kind}
      showDual={p.showDual === true}
      showEuler={p.showEuler !== false}
    />
  )
}
