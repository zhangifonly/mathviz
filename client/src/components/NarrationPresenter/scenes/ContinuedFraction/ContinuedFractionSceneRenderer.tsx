/**
 * 连分数讲解场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import {
  continuedFractionCoeffs,
  convergents,
  NUMBER_OPTIONS,
} from '../../../../experiments/continued-fraction/continuedFraction'
import { drawContinuedFraction } from '../../../../experiments/continued-fraction/draw'
import type { ContinuedFractionData } from '../../../../experiments/continued-fraction/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '连分数', subtitle: '用无穷嵌套的分数逼近实数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '连分数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-nest': ['实数 = 层层嵌套的分数', '整数部分 + 倒数递归', '揭示算术骨架'],
    'sum-approx': ['渐近分数逐步逼近', '最小分母给出最好逼近', '从 π 到黄金比例'],
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

function CFCanvas({ numberKey }: { numberKey: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const option =
      NUMBER_OPTIONS.find((o) => o.key === numberKey) ?? NUMBER_OPTIONS[0]
    const coeffs = continuedFractionCoeffs(option.value, 12)
    const data: ContinuedFractionData = {
      value: option.value,
      label: option.label,
      coeffs,
      convergents: convergents(coeffs),
    }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawContinuedFraction(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [numberKey])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function ContinuedFractionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CFCanvas numberKey="pi" />
  const id = scene.scene.id
  const type = scene.scene.type
  const numberKey = (scene.lineState?.params?.numberKey as string | undefined) ?? 'pi'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CFCanvas key={numberKey} numberKey={numberKey} />
}
