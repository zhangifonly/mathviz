/**
 * Moore-Penrose 伪逆 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawPseudoinverse } from '../../../../experiments/pseudoinverse/draw'
import { PRESETS, type Vec3 } from '../../../../experiments/pseudoinverse/pseudoinverse'

const W = 680
const H = 560
const TITLES = {
  'ga-1': { title: 'Moore-Penrose 伪逆', subtitle: '方程无解或有无穷多解时，它都给一个答案' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['x = A⁺b 总是残差最小的解', '若这样的解不止一个', '它还是其中范数最小的那个'],
  'sum-2': ['A = UΣVᵀ ⇒ A⁺ = VΣ⁺Uᵀ', 'Σ⁺：非零奇异值取倒数，零仍取零', '零取零换来的正是范数最小'],
  'sum-3': ['AA⁺ = 到列空间的投影 → 残差最小', 'A⁺A = 到行空间的投影 → 范数最小', '四条 Penrose 条件保证唯一'],
}

type Panel = 'both' | 'b' | 'x'

function PICanvas({
  presetId, nullShift, panel,
}: { presetId: string; nullShift: number; panel: Panel }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const p = PRESETS.find((x) => x.id === presetId) ?? PRESETS[0]
    drawPseudoinverse(canvas, { A: p.A, b: p.b as Vec3, nullShift, panel })
  }, [presetId, nullShift, panel])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function PseudoinverseSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PICanvas presetId="rank2" nullShift={0} panel="both" />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="Moore-Penrose 伪逆" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const panel: Panel = p.panel === 'b' || p.panel === 'x' ? p.panel : 'both'
  return (
    <PICanvas
      presetId={typeof p.presetId === 'string' ? p.presetId : 'rank2'}
      nullShift={typeof p.nullShift === 'number' ? p.nullShift : 0}
      panel={panel}
    />
  )
}
