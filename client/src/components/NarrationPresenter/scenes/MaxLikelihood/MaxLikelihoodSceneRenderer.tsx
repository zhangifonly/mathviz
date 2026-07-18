/**
 * 最大似然估计场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { DATASETS, mleMu } from '../../../../experiments/max-likelihood/maxLikelihood'
import { drawMaxLikelihood } from '../../../../experiments/max-likelihood/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '最大似然估计', subtitle: '寻找最可能的参数' },
    'sum-end': { title: '感谢观看', subtitle: '让数据说出真相' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '最大似然估计', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['似然衡量生成数据的可能性', '取对数把连乘化为连加', '峰值位置保持不变'],
    'sum-mle': ['最大化对数似然得到 MLE', '正态均值的 MLE 是样本均值', '数据约束越强峰顶越尖'],
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

function MaxLikelihoodCanvas({ dsIndex, muOffset }: { dsIndex: number; muOffset: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dataset = DATASETS[dsIndex] ?? DATASETS[0]
    const mle = mleMu(dataset.values)
    drawMaxLikelihood(canvas, dataset, 1, mle + muOffset)
  }, [dsIndex, muOffset])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function MaxLikelihoodSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <MaxLikelihoodCanvas dsIndex={0} muOffset={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const dsIndex = (scene.lineState?.params?.dsIndex as number | undefined) ?? 0
  const muOffset = (scene.lineState?.params?.muOffset as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <MaxLikelihoodCanvas key={`${dsIndex}-${muOffset}`} dsIndex={dsIndex} muOffset={muOffset} />
}
