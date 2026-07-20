/**
 * 广度与深度优先搜索场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { MAZE, START, GOAL, search, type Mode } from '../../../../experiments/bfs-dfs/bfsDfs'
import { drawBfsDfs } from '../../../../experiments/bfs-dfs/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '广度与深度优先搜索', subtitle: '层层扩散 vs 一路到底' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '广度与深度优先搜索', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['BFS 用队列层层扩散', 'DFS 用栈一路到底', '访问顺序截然不同'],
    'sum-tradeoff': ['BFS 保证最短路', 'DFS 实现简洁省空间', '各有各的用武之地'],
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

function MazeCanvas({ mode }: { mode: Mode }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const total = search(mode, MAZE, START, GOAL).order.length
    let frame = 0
    let raf = 0
    const tick = () => {
      frame += Math.max(1, Math.round(total / 60))
      drawBfsDfs(canvas, MAZE, mode, frame, true)
      if (frame < total) raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [mode])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function BfsDfsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <MazeCanvas mode="bfs" />
  const type = scene.scene.type
  const mode = ((scene.lineState?.params?.mode as Mode | undefined) ?? 'bfs')

  if (type === 'title') return <TitleScene sceneId={scene.scene.id} />
  if (type === 'summary') return <SummaryScene sceneId={scene.scene.id} />
  return <MazeCanvas key={mode} mode={mode} />
}
