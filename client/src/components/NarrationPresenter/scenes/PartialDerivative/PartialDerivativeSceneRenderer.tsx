/**
 * 偏导数与梯度场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { fieldById } from '../../../../experiments/partial-derivative/partialDerivative'
import { drawPartialDerivative } from '../../../../experiments/partial-derivative/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '偏导数与梯度', subtitle: '多元函数的变化率' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '偏导数与梯度', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['偏导数=沿单方向坡度', '两个偏导拼成梯度', '梯度 = [fx, fy]'],
    'sum-perp': ['梯度垂直于等高线', '指向上升最陡方向', '模长就是坡度大小'],
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

function GradientCanvas({ fnId, px, py }: { fnId: string; px: number; py: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawPartialDerivative(canvas, fieldById(fnId), px, py, 3)
  }, [fnId, px, py])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PartialDerivativeSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GradientCanvas fnId="bowl" px={1.2} py={0.8} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params ?? {}
  const fnId = (p.fnId as string | undefined) ?? 'bowl'
  const px = (p.px as number | undefined) ?? 1.2
  const py = (p.py as number | undefined) ?? 0.8

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GradientCanvas key={`${fnId}-${px}-${py}`} fnId={fnId} px={px} py={py} />
}
