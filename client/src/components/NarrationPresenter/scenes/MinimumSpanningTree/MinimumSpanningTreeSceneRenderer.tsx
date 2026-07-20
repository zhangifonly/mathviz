/**
 * 最小生成树场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_GRAPH, runMST, type Algorithm } from '../../../../experiments/minimum-spanning-tree/minimumSpanningTree'
import { drawMinimumSpanningTree } from '../../../../experiments/minimum-spanning-tree/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '最小生成树', subtitle: '用最省的成本连通所有点' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '最小生成树', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['连通所有节点', '无环，恰 n-1 条边', '总权重最小'],
    'sum-algos': ['Kruskal 排序加边', 'Prim 从一点扩展', '两种贪心同一最优解'],
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

function MSTCanvas({ algo, step }: { algo: Algorithm; step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const result = runMST(SAMPLE_GRAPH, algo)
    drawMinimumSpanningTree(canvas, SAMPLE_GRAPH, result.mstEdges, step)
  }, [algo, step])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function MinimumSpanningTreeSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <MSTCanvas algo="kruskal" step={7} />
  const id = scene.scene.id
  const type = scene.scene.type
  const algo = (scene.lineState?.params?.algo as Algorithm | undefined) ?? 'kruskal'
  const step = (scene.lineState?.params?.step as number | undefined) ?? 7

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <MSTCanvas key={`${algo}-${step}`} algo={algo} step={step} />
}
