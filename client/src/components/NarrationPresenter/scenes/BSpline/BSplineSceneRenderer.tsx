/**
 * B样条曲线场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { CONTROL_POINTS, DEGREE } from '../../../../experiments/b-spline/bSpline'
import { drawBSpline } from '../../../../experiments/b-spline/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'B样条曲线', subtitle: '控制点与基函数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'B样条曲线', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['控制点拉扯出曲线', '基函数给出权重', '求和恒为一的单位分解'],
    'sum-local': ['局部支撑只改附近', '比贝塞尔更灵活', '几何设计的基石'],
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

function BSplineCanvas({ highlight }: { highlight: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // 场景画布(640x540)按比例放大实验坐标(600x480)
    const pts = CONTROL_POINTS.map((p) => ({ x: p.x * (W / 600), y: p.y * (H / 480) }))
    drawBSpline(canvas, pts, DEGREE, highlight, true)
  }, [highlight])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function BSplineSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <BSplineCanvas highlight={-1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const highlight = (scene.lineState?.params?.highlight as number | undefined) ?? -1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <BSplineCanvas key={highlight} highlight={highlight} />
}
