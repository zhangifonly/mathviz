/**
 * 置信区间场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { manyIntervals } from '../../../../experiments/confidence-interval/confidenceInterval'
import { drawConfidenceInterval } from '../../../../experiments/confidence-interval/draw'

const W = 640
const H = 540
const TRUE_MU = 50
const SIGMA = 10
const N = 30
const TRIALS = 40

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '置信区间', subtitle: '95%置信到底啥意思' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '置信区间', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['用范围表达估计', '均值 ± z·标准误', '样本越多区间越窄'],
    'sum-longrun': ['真值固定区间随机', '长期覆盖率≈置信水平', '读懂数据的分寸感'],
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

function IntervalCanvas({ level, seed }: { level: number; seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const { intervals } = manyIntervals(TRUE_MU, SIGMA, N, TRIALS, level, seed)
    drawConfidenceInterval(canvas, intervals, TRUE_MU, SIGMA, N)
  }, [level, seed])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function ConfidenceIntervalSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <IntervalCanvas level={0.95} seed={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const level = (scene.lineState?.params?.level as number | undefined) ?? 0.95
  const seed = (scene.lineState?.params?.seed as number | undefined) ?? 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <IntervalCanvas key={`${level}-${seed}`} level={level} seed={seed} />
}
