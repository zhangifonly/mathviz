/**
 * 三角形四心 场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { PRESET_TRIANGLES } from '../../../../experiments/triangle-centers/triangleCenters'
import { drawTriangleCenters } from '../../../../experiments/triangle-centers/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '三角形四心', subtitle: '重心 · 外心 · 内心 · 垂心' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '三角形四心', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['重心=中线交点', '外心=垂直平分线交点', '内心=角平分线交点', '垂心=高线交点'],
    'sum-circles': ['外心配外接圆', '内心配内切圆', '三心共处欧拉线'],
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

function TriangleCanvas({ triangle }: { triangle: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const t = PRESET_TRIANGLES[triangle] ?? PRESET_TRIANGLES[0]
    drawTriangleCenters(canvas, t, { showCircum: true, showIn: true })
  }, [triangle])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function TriangleCentersSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TriangleCanvas triangle={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const triangle = (scene.lineState?.params?.triangle as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TriangleCanvas key={triangle} triangle={triangle} />
}
