/**
 * 球面几何场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { PRESET_POINTS } from '../../../../experiments/spherical-geometry/sphericalGeometry'
import { drawSphericalGeometry } from '../../../../experiments/spherical-geometry/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '球面几何', subtitle: '大圆与球面三角形' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '球面几何', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['大圆是球面上的直线', '两点最短路径是大圆弧', '大圆又叫测地线'],
    'sum-excess': ['内角和大于180度', '盈余=内角和-180', '盈余×R²等于面积'],
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

function SphereCanvas({ preset, rot }: { preset: string; rot: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const pts = PRESET_POINTS[preset] || PRESET_POINTS.cities
    drawSphericalGeometry(canvas, pts, rot, true)
  }, [preset, rot])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function SphericalGeometrySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SphereCanvas preset="cities" rot={0.5} />
  const id = scene.scene.id
  const type = scene.scene.type
  const preset = (scene.lineState?.params?.preset as string | undefined) ?? 'cities'
  const rot = (scene.lineState?.params?.rot as number | undefined) ?? 0.5

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SphereCanvas key={`${preset}-${rot}`} preset={preset} rot={rot} />
}
