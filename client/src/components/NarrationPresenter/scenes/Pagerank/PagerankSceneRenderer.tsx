/**
 * PageRank 场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { pagerank, WEB_GRAPH } from '../../../../experiments/pagerank/pagerank'
import { drawPagerank } from '../../../../experiments/pagerank/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'PageRank', subtitle: '网页链接的稳态分布' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'PageRank', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['随机浏览者模型', '停留概率即重要性', 'rank 是稳态分布'],
    'sum-iterate': ['权重沿链接转移', '阻尼因子平滑跳转', '幂迭代快速收敛'],
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

function PagerankCanvas({ iter, damping }: { iter: number; damping: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const { history } = pagerank(WEB_GRAPH, damping, 20)
    const frame = Math.min(iter, history.length - 1)
    drawPagerank(canvas, WEB_GRAPH, history[frame])
  }, [iter, damping])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PagerankSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PagerankCanvas iter={20} damping={0.85} />
  const id = scene.scene.id
  const type = scene.scene.type
  const iter = (scene.lineState?.params?.iter as number | undefined) ?? 20
  const damping = (scene.lineState?.params?.damping as number | undefined) ?? 0.85

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PagerankCanvas key={`${iter}-${damping}`} iter={iter} damping={damping} />
}
