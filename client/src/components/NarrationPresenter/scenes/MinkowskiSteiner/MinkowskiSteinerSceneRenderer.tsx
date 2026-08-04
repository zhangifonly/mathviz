/**
 * 闵可夫斯基和与斯坦纳公式 讲解场景渲染器
 *
 * 用 Canvas 2D + 本实验专属的 draw.ts(要画线框+面板+棱楔+顶点球片四层)。
 * 不用 Plotly, 见 draw3d.ts 顶部说明。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawMinkowski } from '../../../../experiments/minkowski-steiner/draw'
import {
  solidOf, steinerTerms, type SolidId,
} from '../../../../experiments/minkowski-steiner/minkowskiSteiner'

const W = 600
const H = 540
const SOLID_IDS: readonly string[] = ['cube', 'tetrahedron', 'octahedron']
const TITLES = {
  'intro-1': { title: '闵可夫斯基和与斯坦纳公式', subtitle: '用球擦一遍会发生什么' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['V(r) = V + S·r + M·r² + (4π/3)r³', '用球擦一遍得到圆角体', '体积是 r 的三次多项式'],
  'sum-2': ['四项对应本体/面/棱/顶点', '证明就是把它拆开数', '顶点项恒为一整个球'],
}

function MinkowskiCanvas({
  solidId, r, highlight,
}: { solidId: SolidId; r: number; highlight: 0 | 1 | 2 | 3 | null }) {
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
      const t = steinerTerms(solid, r)
      drawMinkowski(canvas, {
        solid, r, highlight,
        title: `${solid.label} ⊕ ${r.toFixed(2)}B · V(r) = ${t.total.toFixed(4)}`,
        subtitle: `顶点项 ${t.vertices.toFixed(4)}，与顶点个数(${solid.vertices.length})无关`,
        yaw: 0.6 + el * 0.22,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [solid, r, highlight])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function MinkowskiSteinerSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <MinkowskiCanvas solidId="cube" r={0.4} highlight={null} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="闵可夫斯基和与斯坦纳公式" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const solidId = SOLID_IDS.includes(p.solidId as string)
    ? (p.solidId as SolidId)
    : 'cube'
  const r = typeof p.r === 'number' && p.r >= 0 ? p.r : 0.4
  const h = p.highlight
  const highlight = h === 0 || h === 1 || h === 2 || h === 3 ? h : null
  return <MinkowskiCanvas solidId={solidId} r={r} highlight={highlight} />
}
