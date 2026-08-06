/**
 * Gershgorin 圆盘定理 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawGershgorin } from '../../../../experiments/gershgorin/draw'
import { PRESETS } from '../../../../experiments/gershgorin/gershgorin'

const W = 680
const H = 560
const TITLES = {
  'as-1': { title: 'Gershgorin 圆盘定理', subtitle: '不解方程，也能把特征值圈起来' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['每个特征值至少落在一个圆盘里', '圆心 = 对角元 aᵢᵢ', '半径 = 该行其余元素绝对值之和'],
  'sum-2': ['k 个圆盘连成一片且与其余隔开', '那一片里恰好有 k 个特征值', '这才能把特征值一个个隔离'],
  'sum-3': ['严格对角占优 ⇒ 圆盘不含 0 ⇒ 必可逆', '圆盘全在左半平面 ⇒ 系统稳定', '价值不在精确，而在不用算就能说'],
}

function GGCanvas({
  presetId, showCols, showComponents, camPitch,
}: { presetId: string; showCols: boolean; showComponents: boolean; camPitch: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const p = PRESETS.find((x) => x.id === presetId) ?? PRESETS[0]
    drawGershgorin(canvas, { A: p.A, showCols, showComponents, camPitch })
  }, [presetId, showCols, showComponents, camPitch])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function GershgorinSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GGCanvas presetId="isolated" showCols showComponents camPitch={0.78} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="Gershgorin 圆盘定理" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <GGCanvas
      presetId={typeof p.presetId === 'string' ? p.presetId : 'isolated'}
      showCols={p.showCols === true}
      showComponents={p.showComponents !== false}
      camPitch={typeof p.camPitch === 'number' ? p.camPitch : 0.78}
    />
  )
}
