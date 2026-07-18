/**
 * Dijkstra 最短路场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_GRAPH } from '../../../../experiments/dijkstra/dijkstra'
import { drawDijkstra } from '../../../../experiments/dijkstra/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'Dijkstra最短路', subtitle: '贪心扩展最近节点' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'Dijkstra最短路', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['每步选最近未定节点', '用它松弛所有邻边', '非负权保证一次确定'],
    'sum-tree': ['前驱指针连成路径树', '覆盖全部可达节点', '导航路由处处用它'],
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

function DijkstraCanvas({ source, target }: { source: number; target: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawDijkstra(canvas, SAMPLE_GRAPH, source, target)
  }, [source, target])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DijkstraSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DijkstraCanvas source={0} target={7} />
  const id = scene.scene.id
  const type = scene.scene.type
  const source = (scene.lineState?.params?.source as number | undefined) ?? 0
  const target = (scene.lineState?.params?.target as number | undefined) ?? 7

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <DijkstraCanvas key={`${source}-${target}`} source={source} target={target} />
}
