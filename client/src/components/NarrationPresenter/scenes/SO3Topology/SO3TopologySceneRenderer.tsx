/**
 * SO(3) 的拓扑 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawSO3Topology } from '../../../../experiments/so3-topology/draw'

const W = 680
const H = 540
const TITLES = {
  'lo-1': { title: 'SO(3) 的拓扑', subtitle: '转一圈的旋转收不成一点，转两圈的可以' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['整圈旋转 = SO(3) 里的环路', '提升到 S³：q(θ)=(cos(θ/2), sin(θ/2)·n)', '终点是 (−1)^圈数'],
  'sum-2': ['S³ 单连通，闭环都能收缩', '偶数圈：提升闭合 → 可收缩', '奇数圈：提升落在 −1 → 不可收缩'],
  'sum-3': ['环路只分两类，加法模 2', 'π₁(SO(3)) = ℤ₂', '电子自旋、腰带把戏，同一件事'],
}

function SOCanvas({
  turns, t, camYaw, camPitch, liftOnly,
}: { turns: number; t: number; camYaw: number; camPitch: number; liftOnly: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawSO3Topology(canvas, { turns, t, camYaw, camPitch, liftOnly })
  }, [turns, t, camYaw, camPitch, liftOnly])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SO3TopologySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return <SOCanvas turns={1} t={1} camYaw={0.7} camPitch={0.34} liftOnly={false} />
  }
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="SO(3) 的拓扑" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <SOCanvas
      turns={typeof p.turns === 'number' ? p.turns : 1}
      t={typeof p.t === 'number' ? p.t : 1}
      camYaw={typeof p.camYaw === 'number' ? p.camYaw : 0.7}
      camPitch={typeof p.camPitch === 'number' ? p.camPitch : 0.34}
      liftOnly={p.liftOnly === true}
    />
  )
}
