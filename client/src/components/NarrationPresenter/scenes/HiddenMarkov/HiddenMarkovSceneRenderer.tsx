/**
 * 隐马尔可夫模型场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { generateSequence, MODELS } from '../../../../experiments/hidden-markov/hiddenMarkov'
import { drawHiddenMarkov } from '../../../../experiments/hidden-markov/draw'

const W = 640
const H = 540
const model = MODELS[0]

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '隐马尔可夫模型', subtitle: '维特比解码隐藏状态' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '隐马尔可夫模型', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-model': ['隐状态按马尔可夫链转移', '发射概率产生观测', '看不见的状态藏在序列里'],
    'sum-viterbi': ['维特比用动态规划解码', '逐列记录最优路径', '回溯得全局最可能序列'],
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

function HMMCanvas({ length, showDecoded }: { length: number; showDecoded: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const seq = generateSequence(model, length, 1)
    drawHiddenMarkov(canvas, model, seq, showDecoded)
  }, [length, showDecoded])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function HiddenMarkovSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <HMMCanvas length={20} showDecoded />
  const id = scene.scene.id
  const type = scene.scene.type
  const length = (scene.lineState?.params?.length as number | undefined) ?? 20
  const showDecoded = (scene.lineState?.params?.showDecoded as boolean | undefined) ?? true

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <HMMCanvas key={`${length}-${showDecoded}`} length={length} showDecoded={showDecoded} />
}
