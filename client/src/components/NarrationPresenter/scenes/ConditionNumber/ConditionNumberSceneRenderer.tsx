/**
 * 矩阵条件数与数值稳定性 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawConditionNumber } from '../../../../experiments/condition-number/draw'
import { PRESETS } from '../../../../experiments/condition-number/conditionNumber'

const W = 680
const H = 540
const TITLES = {
  'pr-1': { title: '矩阵条件数与数值稳定性', subtitle: '椭球有多扁，误差就放大多少倍' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['κ(A) = σ₁/σ₃', 'A 把单位球映成椭球', 'κ 就是这个椭球有多扁'],
  'sum-2': ['解的相对误差 ≤ κ × 输入相对误差', '最坏方向上正好取到这个上界', 'κ=10ᵏ 时约丢 k 位有效数字'],
  'sum-3': ['det 是奇异值之积', 'κ 是最大与最小之比', '缩放改变 det，却完全不影响 κ'],
}

function CNCanvas({
  presetId, showWorst, camYaw, camPitch,
}: { presetId: string; showWorst: boolean; camYaw: number; camPitch: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const p = PRESETS.find((x) => x.id === presetId) ?? PRESETS[0]
    drawConditionNumber(canvas, { A: p.A, showWorst, camYaw, camPitch })
  }, [presetId, showWorst, camYaw, camPitch])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function ConditionNumberSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CNCanvas presetId="ill" showWorst camYaw={0.72} camPitch={0.42} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="矩阵条件数与数值稳定性" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <CNCanvas
      presetId={typeof p.presetId === 'string' ? p.presetId : 'ill'}
      showWorst={p.showWorst !== false}
      camYaw={typeof p.camYaw === 'number' ? p.camYaw : 0.72}
      camPitch={typeof p.camPitch === 'number' ? p.camPitch : 0.42}
    />
  )
}
