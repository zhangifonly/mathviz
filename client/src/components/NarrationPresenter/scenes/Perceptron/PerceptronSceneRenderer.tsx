/**
 * 感知机场景渲染器
 */
import { useEffect, useRef, useMemo } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { generateDataset, trainPerceptron, DATASETS } from '../../../../experiments/perceptron/perceptron'
import { drawPerceptron } from '../../../../experiments/perceptron/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '感知机', subtitle: '一条直线分两类' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '感知机', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['加权求和加符号激活', '把平面切成两半', '大于零一类小于零另一类'],
    'sum-learn': ['误分类才更新权重', '直线一步步转到正确位置', '从一个神经元到深度网络'],
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

function PerceptronCanvas({ step }: { step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { points, history } = useMemo(() => {
    const d = DATASETS[1]
    const pts = generateDataset(d.count, d.seed)
    return { points: pts, history: trainPerceptron(pts) }
  }, [])
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const cur = Math.min(step, history.length - 1)
    drawPerceptron(canvas, points, history[cur], cur > 0)
  }, [step, points, history])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PerceptronSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PerceptronCanvas step={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const step = (scene.lineState?.params?.step as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PerceptronCanvas key={step} step={step} />
}
