/**
 * 布朗运动场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawBrownianMotion } from '../../../../experiments/brownian-motion/draw'
import type { Mode } from '../../../../experiments/brownian-motion/brownianMotion'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '布朗运动', subtitle: '连续随机漫步的几何' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '布朗运动', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['独立高斯增量', 'Box-Muller 生成', '累加成随机轨迹'],
    'sum-props': ['方差随时间线性增长', '偏离正比于 √t', '连续却处处不可导'],
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

function BrownianCanvas({ mode, steps }: { mode: Mode; steps: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawBrownianMotion(canvas, mode, steps, 1)
  }, [mode, steps])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function BrownianMotionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <BrownianCanvas mode="1d" steps={500} />
  const id = scene.scene.id
  const type = scene.scene.type
  const mode = (scene.lineState?.params?.mode as Mode | undefined) ?? '1d'
  const steps = (scene.lineState?.params?.steps as number | undefined) ?? 500

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <BrownianCanvas key={`${mode}-${steps}`} mode={mode} steps={steps} />
}
