/**
 * 逻辑回归场景渲染器
 */
import { useEffect, useRef, useMemo } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { train, DATASET, LEARNING_RATE } from '../../../../experiments/logistic-regression/logisticRegression'
import { drawLogisticRegression } from '../../../../experiments/logistic-regression/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '逻辑回归', subtitle: 'S形函数分类' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '逻辑回归', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['sigmoid 输出分类概率', '得分为零处概率 0.5', '概率梯度呈 S 形'],
    'sum-train': ['以对数损失为目标', '梯度下降更新权重', '学出最佳决策边界'],
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

function LogisticCanvas({ step }: { step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const history = useMemo(
    () => train(DATASET.points, DATASET.labels, LEARNING_RATE, 150),
    [],
  )
  const s = Math.min(step, history.length - 1)
  const w = history[s].weights
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawLogisticRegression(canvas, DATASET.points, DATASET.labels, w, 4)
  }, [w])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LogisticRegressionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <LogisticCanvas step={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const step = (scene.lineState?.params?.step as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <LogisticCanvas key={step} step={step} />
}
