/**
 * 棱柱与反棱柱 讲解场景渲染器
 *
 * 多面体用 Canvas 2D + lib/drawPolyhedron 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawPolyhedron } from '../../../../lib/drawPolyhedron'
import {
  solidOf, infoOf, isCubeCase, isOctahedronCase, SOLID_KINDS, type SolidKind,
} from '../../../../experiments/prism-antiprism/prismAntiprism'

const W = 640
const H = 540
const TITLES = {
  'intro-1': { title: '棱柱与反棱柱', subtitle: '被分类定理排除的两族' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['各有无穷多个', '故被单列成族', '不计入阿基米德的十三种'],
  'sum-2': ['反棱柱错开 π/n', '侧面被分割成等边三角形', '高度由勾股定理确定'],
}

function SolidCanvas({ kind, n }: { kind: SolidKind; n: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const poly = useMemo(() => solidOf(kind, n), [kind, n])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      const tag = (kind === 'prism' && isCubeCase(n)) ? ' = 立方体'
        : (kind === 'antiprism' && isOctahedronCase(n)) ? ' = 正八面体' : ''
      drawPolyhedron(canvas, {
        poly,
        title: `${poly.name}${tag}`,
        subtitle: `侧面为${infoOf(kind).sideShape}`,
        showVertices: true,
        showEuler: true,
        ramp: 'ocean',
        yaw: 0.6 + el * 0.24,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [poly, kind, n])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function PrismAntiprismSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SolidCanvas kind="antiprism" n={5} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="棱柱与反棱柱" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const raw = p.kind
  const kind = (SOLID_KINDS as readonly string[]).includes(raw as string)
    ? (raw as SolidKind)
    : 'antiprism'
  const n = typeof p.n === 'number' ? Math.max(3, Math.min(12, p.n)) : 5
  return <SolidCanvas kind={kind} n={n} />
}
