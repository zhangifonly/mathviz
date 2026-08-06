/**
 * 集中不等式 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawConcentration } from '../../../../experiments/concentration/draw'

const W = 680
const H = 560
const TITLES = {
  'as-1': { title: '集中不等式', subtitle: '大数定律说会收敛，这里回答收敛得有多快' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['Markov：只要 X ≥ 0', 'Chebyshev：还要知道方差', 'Hoeffding：还要求有界。假设越多，界越紧'],
  'sum-2': ['Chebyshev 随 n 线性衰减', 'Hoeffding 随 n 指数衰减', '但 n 小时 Chebyshev 反而更紧，交叉点随 t 变严而右移'],
  'sum-3': ['界虽松，却不需要知道分布', '能反解样本量，能推广到鞅与矩阵', '这是机器学习理论的基石'],
}

type Flags = [boolean, boolean, boolean]

function CNCanvas({
  t, nMax, show, camYaw,
}: { t: number; nMax: number; show: Flags; camYaw: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawConcentration(canvas, { t, nMax, show, camYaw })
  }, [t, nMax, show, camYaw])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

const isFlags = (v: unknown): v is Flags =>
  Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === 'boolean')

export default function ConcentrationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CNCanvas t={0.2} nMax={120} show={[true, true, true]} camYaw={0.82} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="集中不等式" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <CNCanvas
      t={typeof p.t === 'number' ? p.t : 0.2}
      nMax={typeof p.nMax === 'number' ? p.nMax : 120}
      show={isFlags(p.show) ? p.show : [true, true, true]}
      camYaw={typeof p.camYaw === 'number' ? p.camYaw : 0.82}
    />
  )
}
