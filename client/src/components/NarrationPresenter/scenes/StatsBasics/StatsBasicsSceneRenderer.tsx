/**
 * 统计初步场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { DATASET_OPTIONS, summarize } from '../../../../experiments/stats-basics/statsBasics'
import { drawStatsBasics } from '../../../../experiments/stats-basics/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '统计初步', subtitle: '用几个数字读懂一组数据' },
    'sum-end': { title: '感谢观看', subtitle: '读懂数据的故事' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '统计初步', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-center': ['平均数看整体水平', '中位数看中间位置', '众数看最常出现的值'],
    'sum-spread': ['极差看最大最小之差', '方差、标准差看分散程度', '选对统计量读懂数据'],
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

function StatsCanvas({ datasetKey }: { datasetKey: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const option = DATASET_OPTIONS.find((o) => o.key === datasetKey) ?? DATASET_OPTIONS[0]
  const stats = summarize(option.data)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const data = option.data
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawStatsBasics(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [option])
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4">
      <canvas ref={ref} width={620} height={440} className="max-w-full max-h-full rounded-lg" />
      <div className="text-white/80 text-sm flex flex-wrap gap-x-6 gap-y-1 justify-center">
        <span>平均数 {stats.mean.toFixed(1)}</span>
        <span>中位数 {stats.median.toFixed(1)}</span>
        <span>标准差 {stats.stdDev.toFixed(1)}</span>
      </div>
    </div>
  )
}

export default function StatsBasicsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <StatsCanvas datasetKey="scores" />
  const id = scene.scene.id
  const type = scene.scene.type
  const datasetKey = (scene.lineState?.params?.dataset as string | undefined) ?? 'scores'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <StatsCanvas key={datasetKey} datasetKey={datasetKey} />
}
