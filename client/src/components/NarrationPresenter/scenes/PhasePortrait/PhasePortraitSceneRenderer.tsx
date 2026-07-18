/**
 * 相图分析场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SYSTEMS } from '../../../../experiments/phase-portrait/phasePortrait'
import { drawPhasePortrait } from '../../../../experiments/phase-portrait/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '相图分析', subtitle: '平衡点的类型' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '相图分析', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['不解方程也能看清行为', '向量场指引运动方向', '轨线描出系统演化'],
    'sum-four': ['结点：同号实特征值', '鞍点：异号实特征值', '焦点与中心：复特征值'],
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

function PhaseCanvas({ sys }: { sys: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawPhasePortrait(canvas, SYSTEMS[sys].A, true)
  }, [sys])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PhasePortraitSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PhaseCanvas sys={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const raw = (scene.lineState?.params?.sys as number | undefined) ?? 0
  const sys = Math.max(0, Math.min(SYSTEMS.length - 1, raw))

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PhaseCanvas key={sys} sys={sys} />
}
