/**
 * 点在多边形内 场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { POLYGONS } from '../../../../experiments/point-in-polygon/pointInPolygon'
import { drawPointInPolygon, type Rule } from '../../../../experiments/point-in-polygon/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '点在多边形内', subtitle: '射线法与环绕数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '点在多边形内', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['射线法数交点奇偶', '环绕数看旋转圈数', '都能判定点的内外'],
    'sum-apply': ['游戏碰撞检测', '地图落区判断', '图形填充规则'],
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

function PolygonCanvas({ polyKey, rule }: { polyKey: string; rule: Rule }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const poly = POLYGONS[polyKey] || POLYGONS.convex
    // 场景画布 640x540，探针取中心便于展示星芯差异
    const probe = polyKey === 'star' ? { x: 320, y: 300 } : undefined
    drawPointInPolygon(canvas, poly, rule, 24, probe)
  }, [polyKey, rule])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PointInPolygonSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PolygonCanvas polyKey="convex" rule="ray" />
  const id = scene.scene.id
  const type = scene.scene.type
  const polyKey = (scene.lineState?.params?.poly as string | undefined) ?? 'convex'
  const rule = (scene.lineState?.params?.rule as Rule | undefined) ?? 'ray'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PolygonCanvas key={`${polyKey}-${rule}`} polyKey={polyKey} rule={rule} />
}
