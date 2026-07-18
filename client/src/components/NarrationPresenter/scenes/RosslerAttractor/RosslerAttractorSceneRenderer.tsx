/**
 * Rössler 吸引子讲解场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { simulate, ROSSLER_PRESETS } from '../../../../experiments/rossler-attractor/rosslerAttractor'
import { drawRosslerAttractor } from '../../../../experiments/rossler-attractor/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'Rössler 吸引子', subtitle: '极简方程孕育的螺旋混沌' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'Rössler 吸引子', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recipe': ['三行极简方程', '仅一个非线性项', '却演示混沌配方'],
    'sum-mech': ['螺旋负责拉伸', '折叠负责搅乱', '相乘便是混沌'],
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

function RosslerCanvas({ presetId, steps }: { presetId: string; steps: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const preset = ROSSLER_PRESETS.find((p) => p.id === presetId) ?? ROSSLER_PRESETS[0]
    const pts = simulate({ x: 1, y: 1, z: 1 }, preset.params, steps, 0.02)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.008)
      drawRosslerAttractor(canvas, pts, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [presetId, steps])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function RosslerAttractorSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <RosslerCanvas presetId="classic" steps={9000} />
  const id = scene.scene.id
  const type = scene.scene.type
  const presetId = (scene.lineState?.params?.preset as string | undefined) ?? 'classic'
  const steps = (scene.lineState?.params?.steps as number | undefined) ?? 6000

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <RosslerCanvas key={`${presetId}-${steps}`} presetId={presetId} steps={steps} />
}
