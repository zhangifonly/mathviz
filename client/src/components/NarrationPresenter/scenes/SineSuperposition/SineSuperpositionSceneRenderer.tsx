/**
 * 波的叠加场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { WAVE_SCENARIOS } from '../../../../experiments/sine-superposition/sineSuperposition'
import { drawSineSuperposition } from '../../../../experiments/sine-superposition/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '波的叠加', subtitle: '两列正弦波相加涌现的干涉与拍频' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '波的叠加', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['总位移 = 各波位移之和', '逐点代数相加', '叠加原理'],
    'sum-rules': ['同相 → 相长干涉', '反相 → 相消干涉', '频率相近 → 拍频'],
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

function WaveCanvas({ scenarioId }: { scenarioId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const scenario = WAVE_SCENARIOS.find((s) => s.id === scenarioId) ?? WAVE_SCENARIOS[0]
    let raf = 0
    let progress = 0
    const tick = () => {
      progress += 0.006
      if (progress > 1) progress -= 1
      drawSineSuperposition(canvas, scenario.waves, progress)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scenarioId])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={540} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SineSuperpositionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <WaveCanvas scenarioId="harmonics" />
  const id = scene.scene.id
  const type = scene.scene.type
  const scenarioId = (scene.lineState?.params?.scenario as string | undefined) ?? 'harmonics'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <WaveCanvas key={scenarioId} scenarioId={scenarioId} />
}
