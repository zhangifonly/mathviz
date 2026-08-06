/**
 * Perron-Frobenius 定理 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawPerronFrobenius } from '../../../../experiments/perron-frobenius/draw'
import { PRESETS, damp } from '../../../../experiments/perron-frobenius/perronFrobenius'

const W = 680
const H = 560
const TITLES = {
  'wh-1': { title: 'Perron-Frobenius 定理', subtitle: '马氏链为什么会收敛，什么时候不会' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['非负矩阵若本原（某幂全正）', '就有唯一的最大实特征值 r>0', '特征向量处处为正，任何初值都收敛到它'],
  'sum-2': ['谱隙 |λ₁|−|λ₂| 决定收敛速度', '收敛率 = |λ₂|/|λ₁|', '谱隙为零则不收敛，或收敛到不唯一处'],
  'sum-3': ['周期：迭代永远打转', '可约：迭代停了但终点看初值', 'PageRank 阻尼一举消除两者'],
}

type Panel = 'both' | 'simplex' | 'spectrum'

function PFCanvas({
  presetId, damping, steps, panel,
}: { presetId: string; damping: number; steps: number; panel: Panel }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const p = PRESETS.find((x) => x.id === presetId) ?? PRESETS[0]
    const A = damping < 1 ? damp(p.A, damping) : p.A
    drawPerronFrobenius(canvas, { A, steps, panel })
  }, [presetId, damping, steps, panel])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function PerronFrobeniusSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PFCanvas presetId="positive" damping={1} steps={24} panel="both" />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="Perron-Frobenius 定理" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const panel: Panel = p.panel === 'simplex' || p.panel === 'spectrum' ? p.panel : 'both'
  return (
    <PFCanvas
      presetId={typeof p.presetId === 'string' ? p.presetId : 'positive'}
      damping={typeof p.damping === 'number' ? p.damping : 1}
      steps={typeof p.steps === 'number' ? p.steps : 24}
      panel={panel}
    />
  )
}
