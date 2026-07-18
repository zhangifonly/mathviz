/**
 * Delaunay 三角剖分场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { makePoints } from '../../../../experiments/delaunay-triangulation/delaunayTriangulation'
import { drawDelaunayTriangulation } from '../../../../experiments/delaunay-triangulation/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'Delaunay三角剖分', subtitle: '最优三角网格' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'Delaunay三角剖分', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['空圆性质连出网', '最大化最小角', 'Bowyer-Watson 增量'],
    'sum-dual': ['对偶沃罗诺伊图', '匀称三角网格', '计算几何的基石'],
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

function DelaunayCanvas({ count, circle }: { count: number; circle: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const pts = makePoints(count, W, H, 1)
    drawDelaunayTriangulation(canvas, pts, circle ? 0 : -1)
  }, [count, circle])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DelaunayTriangulationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DelaunayCanvas count={16} circle={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const count = (scene.lineState?.params?.count as number | undefined) ?? 16
  const circle = ((scene.lineState?.params?.circle as number | undefined) ?? 0) === 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <DelaunayCanvas key={`${count}-${circle}`} count={count} circle={circle} />
}
