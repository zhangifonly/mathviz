/**
 * 排序算法场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { makeArray, runSort, ARRAY_SIZE } from '../../../../experiments/sorting-algorithms/sortingAlgorithms'
import { drawSortingAlgorithms } from '../../../../experiments/sorting-algorithms/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '排序算法可视化', subtitle: '冒泡插入快排归并' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '排序算法', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['冒泡插入 O(n²) 简单', '快排归并 O(n log n) 高效', '分治是提速关键'],
    'sum-choose': ['稳定性看是否保序', '数据规模决定选型', '选对算法省下时间'],
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

function SortCanvas({ algo, progress }: { algo: string; progress: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const steps = runSort(algo, makeArray(ARRAY_SIZE, 7))
    const idx = Math.min(steps.length - 1, Math.round(progress * (steps.length - 1)))
    drawSortingAlgorithms(canvas, steps[idx], ARRAY_SIZE)
  }, [algo, progress])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function SortingAlgorithmsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SortCanvas algo="bubble" progress={0.5} />
  const id = scene.scene.id
  const type = scene.scene.type
  const algo = (scene.lineState?.params?.algo as string | undefined) ?? 'bubble'
  const progress = (scene.lineState?.params?.progress as number | undefined) ?? 0.5

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SortCanvas key={`${algo}-${progress}`} algo={algo} progress={progress} />
}
