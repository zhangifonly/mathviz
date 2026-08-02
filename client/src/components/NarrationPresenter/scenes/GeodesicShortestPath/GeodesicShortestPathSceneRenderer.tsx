/**
 * 球面测地线 讲解场景渲染器
 *
 * 球面用 Canvas 2D + lib/drawSphere 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 * 场景构造与实验页共用 experiments/.../scene.ts, 不重复写。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawSphereScene } from '../../../../lib/drawSphere'
import { buildRouteScene } from '../../../../experiments/geodesic-shortest-path/scene'
import { toKilometers } from '../../../../experiments/geodesic-shortest-path/geodesicShortestPath'

const W = 640
const H = 540
const TITLES = {
  'intro-1': { title: '球面测地线', subtitle: '为什么跨洋航班往北飞' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['球面最短路径是大圆弧', '比沿纬线航线短', '北京到纽约省三千多公里'],
  'sum-2': ['测地曲率为零才算直', '大圆弧满足', '纬线除赤道外都不满足'],
}

function RouteCanvas({ pairIndex, detour }: { pairIndex: number; detour: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const scene = useMemo(() => buildRouteScene(pairIndex, detour), [pairIndex, detour])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawSphereScene(canvas, {
        title: `${scene.pair.from} → ${scene.pair.to}`,
        subtitle: `大圆距离 ${toKilometers(scene.gc).toFixed(0)} km`,
        paths: scene.paths,
        markers: scene.markers,
        yaw: 0.6 + el * 0.18,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [scene])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function GeodesicShortestPathSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <RouteCanvas pairIndex={0} detour={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="球面测地线" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <RouteCanvas
      pairIndex={typeof p.pairIndex === 'number' ? p.pairIndex : 0}
      detour={typeof p.detour === 'number' ? p.detour : 0}
    />
  )
}
