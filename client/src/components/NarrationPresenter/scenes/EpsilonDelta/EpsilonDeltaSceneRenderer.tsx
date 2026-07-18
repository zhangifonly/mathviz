/**
 * ε-δ 极限定义场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { FUNCTIONS } from '../../../../experiments/epsilon-delta/epsilonDelta'
import { drawEpsilonDelta } from '../../../../experiments/epsilon-delta/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'ε-δ极限定义', subtitle: '极限的严格刻画' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'ε-δ极限定义', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['对任意 ε 都存在 δ', 'δ 内必落在 ε 内', '这是一场博弈'],
    'sum-pair': ['ε 管纵向的接近', 'δ 管横向的接近', '把趋近说得滴水不漏'],
  }
  const list = items[sceneId] || []
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">回顾</h2>
      {list.map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
    </div>
  )
}

function EpsilonDeltaCanvas({ funcId, eps }: { funcId: string; eps: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const func = FUNCTIONS.find((f) => f.id === funcId) ?? FUNCTIONS[0]
    drawEpsilonDelta(canvas, func, eps)
  }, [funcId, eps])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function EpsilonDeltaSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <EpsilonDeltaCanvas funcId="linear" eps={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const funcId = (scene.lineState?.params?.funcId as string | undefined) ?? 'linear'
  const eps = (scene.lineState?.params?.eps as number | undefined) ?? 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <EpsilonDeltaCanvas key={`${funcId}-${eps}`} funcId={funcId} eps={eps} />
}
