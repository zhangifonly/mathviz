/**
 * 地图投影与失真 讲解场景渲染器
 *
 * 这个实验画的是**平面地图**而非球面, 用本实验专属的 draw.ts。
 * 地图是静态的, 不需要逐帧动画。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawMap } from '../../../../experiments/map-projections/draw'
import {
  PROJECTIONS, type ProjectionKind,
} from '../../../../experiments/map-projections/mapProjections'

const W = 660
const H = 540
const TITLES = {
  'intro-1': { title: '地图投影与失真', subtitle: '为什么格陵兰看着比非洲还大' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['球面高斯曲率恒为 1', '不为零就摊不平', '任何投影必然失真'],
  'sum-2': ['Tissot 椭圆量化失真', '等角 ⟺ h=k', '等积 ⟺ 面积因子为 1'],
}

function MapCanvas({
  kind, heatmap, probeLat,
}: { kind: ProjectionKind; heatmap: 'none' | 'area' | 'angle'; probeLat: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawMap(canvas, { kind, heatmap, showTissot: true, highlightLat: probeLat })
  }, [kind, heatmap, probeLat])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function MapProjectionsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <MapCanvas kind="mercator" heatmap="area" probeLat={60} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="地图投影与失真" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const raw = p.kind
  const kind = (PROJECTIONS as readonly string[]).includes(raw as string)
    ? (raw as ProjectionKind)
    : 'mercator'
  const hm = p.heatmap
  const heatmap = hm === 'angle' ? 'angle' : hm === 'none' ? 'none' : 'area'
  return (
    <MapCanvas
      kind={kind}
      heatmap={heatmap}
      probeLat={typeof p.probeLat === 'number' ? p.probeLat : 60}
    />
  )
}
