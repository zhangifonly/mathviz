/**
 * 单摆相空间场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawPendulumPhase } from '../../../../experiments/pendulum-phase/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '单摆相空间', subtitle: '从摆动到翻转' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '单摆相空间', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-rk4': ['方程 θ\'\'=-(g/L)sinθ', 'sinθ 使其非线性', 'RK4 忠实积分轨迹'],
    'sum-orbits': ['闭合曲线是振荡', '波浪线是翻转', '分界线泾渭分明'],
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

function PhaseCanvas({ count, highlight }: { count: number; highlight: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawPendulumPhase(canvas, count, Math.min(highlight, count - 1))
  }, [count, highlight])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PendulumPhaseSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PhaseCanvas count={6} highlight={-1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const count = (scene.lineState?.params?.count as number | undefined) ?? 6
  const highlight = (scene.lineState?.params?.highlight as number | undefined) ?? -1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PhaseCanvas key={`${count}-${highlight}`} count={count} highlight={highlight} />
}
