/**
 * 图着色场景渲染器
 */
import { useEffect, useRef, useMemo } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { greedyColoring, chromaticNumber, SAMPLE_GRAPHS } from '../../../../experiments/graph-coloring/graphColoring'
import { drawGraphColoring } from '../../../../experiments/graph-coloring/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '图着色', subtitle: '相邻不同色，最少几种颜色' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '图着色', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['相邻节点颜色必须不同', '同色相邻即冲突', '目标是颜色尽量少'],
    'sum-method': ['贪心法快但未必最优', '回溯法求真正色数', '四色定理保证平面图'],
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

function GraphCanvas({ graphKey, mode }: { graphKey: string; mode: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const sample = useMemo(
    () => SAMPLE_GRAPHS.find((s) => s.key === graphKey) ?? SAMPLE_GRAPHS[0],
    [graphKey],
  )
  const colors = useMemo(() => {
    if (mode === 'greedy') return greedyColoring(sample.graph)
    if (mode === 'conflict') return new Array(sample.graph.nodes.length).fill(0)
    return chromaticNumber(sample.graph).colors
  }, [sample, mode])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawGraphColoring(canvas, sample.graph, colors)
  }, [sample, colors])

  const used = new Set(colors).size
  const label = mode === 'conflict' ? '全同色·冲突边标红' : `用了 ${used} 种颜色`
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
      <p className="text-white/80 text-lg">{sample.name} · {label}</p>
    </div>
  )
}

export default function GraphColoringSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GraphCanvas graphKey="map" mode="chromatic" />
  const id = scene.scene.id
  const type = scene.scene.type
  const graphKey = (scene.lineState?.params?.graphKey as string | undefined) ?? 'map'
  const mode = (scene.lineState?.params?.mode as string | undefined) ?? 'chromatic'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GraphCanvas key={`${graphKey}-${mode}`} graphKey={graphKey} mode={mode} />
}
