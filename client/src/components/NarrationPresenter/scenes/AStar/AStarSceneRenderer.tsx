/**
 * A星寻路场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawAStar, frameCount } from '../../../../experiments/a-star/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'A星寻路', subtitle: '启发式最短路搜索' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'A星寻路', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['g 是已走的实际代价', 'h 是到终点的启发估计', 'f = g + h 优先扩展'],
    'sum-heuristic': ['不高估的 h 保证最短路', 'A* 比 Dijkstra 更定向', '启发式让搜索又快又准'],
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

function AStarCanvas({ useHeuristic, frame }: { useHeuristic: boolean; frame: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawAStar(canvas, useHeuristic, frame)
  }, [useHeuristic, frame])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function AStarSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <AStarCanvas useHeuristic frame={-1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const algo = (scene.lineState?.params?.algo as string | undefined) ?? 'astar'
  const useHeuristic = algo !== 'dijkstra'
  const rawFrame = (scene.lineState?.params?.frame as number | undefined) ?? -1
  const total = frameCount(useHeuristic)
  const frame = rawFrame < 0 ? -1 : Math.min(rawFrame, total)

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <AStarCanvas key={`${algo}-${frame}`} useHeuristic={useHeuristic} frame={frame} />
}
