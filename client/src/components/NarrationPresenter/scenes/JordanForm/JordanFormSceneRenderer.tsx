/**
 * 亏损矩阵与 Jordan 标准型 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawJordanForm } from '../../../../experiments/jordan-form/draw'
import { PRESETS } from '../../../../experiments/jordan-form/jordanForm'

const W = 680
const H = 560
const TITLES = {
  'ga-1': { title: '亏损矩阵与 Jordan 标准型', subtitle: '对角化什么时候会失败' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['代数重数 = 特征多项式的根重数', '几何重数 = dim ker(A−λI)', '几何 < 代数 ⇒ 亏损，无法对角化'],
  'sum-2': ['解 (A−λI)v₂ = v₁ 得广义特征向量', '串起来就是 Jordan 链', '链长 = Jordan 块大小，块里的 1 = 差的那一点'],
  'sum-3': ['亏损在扰动下立刻消失', '2×2 块：1e−12 的扰动 → 1e−6 的偏离', '理论上完美，数值上慎用'],
}

function JFCanvas({
  presetId, steps, showChain, showOrbits,
}: { presetId: string; steps: number; showChain: boolean; showOrbits: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const p = PRESETS.find((x) => x.id === presetId) ?? PRESETS[0]
    drawJordanForm(canvas, { A: p.A, steps, showChain, showOrbits })
  }, [presetId, steps, showChain, showOrbits])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function JordanFormSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <JFCanvas presetId="jordan2" steps={10} showChain showOrbits />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="亏损矩阵与 Jordan 标准型" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <JFCanvas
      presetId={typeof p.presetId === 'string' ? p.presetId : 'jordan2'}
      steps={typeof p.steps === 'number' ? p.steps : 10}
      showChain={p.showChain === true}
      showOrbits={p.showOrbits === true}
    />
  )
}
