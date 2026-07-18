/**
 * 朴素贝叶斯场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { makeDataset } from '../../../../experiments/naive-bayes/naiveBayes'
import { drawNaiveBayes } from '../../../../experiments/naive-bayes/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '朴素贝叶斯', subtitle: '用概率给样本分类' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '朴素贝叶斯', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['后验正比先验乘似然', '后验最大者胜出', '概率驱动的分类'],
    'sum-boundary': ['特征独立→似然相乘', '高斯估计均值方差', '画出优雅决策边界'],
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

function NaiveBayesCanvas({ count }: { count: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const train = makeDataset(count, 1)
    drawNaiveBayes(canvas, train, 8, true)
  }, [count])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function NaiveBayesSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <NaiveBayesCanvas count={40} />
  const id = scene.scene.id
  const type = scene.scene.type
  const count = (scene.lineState?.params?.count as number | undefined) ?? 40

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <NaiveBayesCanvas key={count} count={count} />
}
