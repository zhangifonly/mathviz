/**
 * Dehn 不变量 讲解场景渲染器
 *
 * 用 Canvas 2D + 本实验专属的 draw.ts(棱按二面角有理性上色)。
 * 不用 Plotly, 见 draw3d.ts 顶部说明。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawDehn } from '../../../../experiments/dehn-invariant/draw'
import {
  solidOf, SOLIDS, type SolidId,
} from '../../../../experiments/dehn-invariant/dehnInvariant'

const W = 600
const H = 540
const IDS: readonly string[] = SOLIDS.map((s) => s.id)
const TITLES = {
  'intro-1': {
    title: 'Dehn 不变量',
    subtitle: '希尔伯特第三问题：等体积就一定能剪拼吗',
  },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['平面：等面积必可剪拼', '空间：等体积不够', '这是希尔伯特第三问的答案'],
  'sum-2': ['D = Σ 棱长 ⊗ 二面角', '有理倍数的项自动归零', '立方体 D=0，四面体 D≠0'],
}

function DehnCanvas({
  solidId, showAngles,
}: { solidId: SolidId; showAngles: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const spec = useMemo(() => solidOf(solidId), [solidId])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawDehn(canvas, {
        spec, edge: 1, showAngles,
        title: spec.label,
        subtitle: spec.note,
        yaw: 0.6 + el * 0.22,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [spec, showAngles])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function DehnInvariantSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DehnCanvas solidId="cube" showAngles />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="Dehn 不变量" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const solidId = IDS.includes(p.solidId as string)
    ? (p.solidId as SolidId)
    : 'cube'
  return <DehnCanvas solidId={solidId} showAngles={p.showAngles !== false} />
}
