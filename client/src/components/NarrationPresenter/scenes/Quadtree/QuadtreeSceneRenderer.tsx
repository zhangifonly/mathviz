/**
 * 四叉树场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { makePoints } from '../../../../experiments/quadtree/quadtree'
import { drawQuadtree } from '../../../../experiments/quadtree/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '四叉树', subtitle: '空间递归四分索引' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '四叉树', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-rule': ['大矩形框住所有点', '超容量就四分', '递归索引整个平面'],
    'sum-speed': ['点密处细点疏处粗', '边界剪枝跳过子树', '范围查询大提速'],
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

function QuadtreeCanvas({ count, capacity }: { count: number; capacity: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const pts = makePoints(count, W, H, 1)
    drawQuadtree(canvas, pts, capacity, [W * 0.55, H * 0.12, W * 0.32, H * 0.3])
  }, [count, capacity])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function QuadtreeSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <QuadtreeCanvas count={80} capacity={4} />
  const id = scene.scene.id
  const type = scene.scene.type
  const count = (scene.lineState?.params?.count as number | undefined) ?? 80
  const capacity = (scene.lineState?.params?.capacity as number | undefined) ?? 4

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <QuadtreeCanvas key={`${count}-${capacity}`} count={count} capacity={capacity} />
}
