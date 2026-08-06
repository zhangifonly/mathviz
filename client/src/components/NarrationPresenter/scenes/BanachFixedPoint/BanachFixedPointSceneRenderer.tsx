/**
 * Banach 不动点定理 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawBanach } from '../../../../experiments/banach-fixed-point/draw'
import { PRESETS } from '../../../../experiments/banach-fixed-point/banachFixedPoint'

const W = 680
const H = 560
const TITLES = {
  'ga-1': { title: 'Banach 不动点定理', subtitle: '存在、唯一，还能事先算出要迭代多少次' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['压缩映射 + 完备空间', '⇒ 不动点存在、唯一', '任何初值都收敛到它'],
  'sum-2': ['先验界只用第一步就能算步数', '但 q 接近 1 时保守（实测 3.6 倍）', '后验界更紧，代价是必须先迭代'],
  'sum-3': ['压缩是充分条件，不是必要条件', '线性映射看谱半径而非谱范数', '‖A‖=3.08 的剪切阵照样收敛'],
}

function BFCanvas({
  presetId, steps, showCone, camYaw, camPitch,
}: { presetId: string; steps: number; showCone: boolean; camYaw: number; camPitch: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const p = PRESETS.find((x) => x.id === presetId) ?? PRESETS[0]
    drawBanach(canvas, { A: p.A, b: p.b, x0: p.x0, steps, showCone, camYaw, camPitch })
  }, [presetId, steps, showCone, camYaw, camPitch])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function BanachFixedPointSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <BFCanvas presetId="strong" steps={24} showCone camYaw={0.74} camPitch={0.36} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="Banach 不动点定理" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <BFCanvas
      presetId={typeof p.presetId === 'string' ? p.presetId : 'strong'}
      steps={typeof p.steps === 'number' ? p.steps : 24}
      showCone={p.showCone !== false}
      camYaw={typeof p.camYaw === 'number' ? p.camYaw : 0.74}
      camPitch={typeof p.camPitch === 'number' ? p.camPitch : 0.36}
    />
  )
}
