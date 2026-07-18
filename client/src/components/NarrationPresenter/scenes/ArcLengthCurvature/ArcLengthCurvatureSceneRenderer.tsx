/**
 * 弧长与曲率场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { CURVES } from '../../../../experiments/arc-length-curvature/arcLengthCurvature'
import { drawArcLengthCurvature } from '../../../../experiments/arc-length-curvature/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '弧长与曲率', subtitle: '曲线的长度与弯曲' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '弧长与曲率', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-len': ['曲线切成微小段', '每段长≈速度×dt', '积分得到总弧长'],
    'sum-cur': ['曲率衡量弯曲快慢', '曲率半径=1/κ', '密切圆最贴合曲线'],
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

function CurveCanvas({ curveIdx, t }: { curveIdx: number; t: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const curve = CURVES[curveIdx] ?? CURVES[1]
    const tc = Math.max(curve.tMin, Math.min(curve.tMax, t))
    drawArcLengthCurvature(canvas, curve, tc)
  }, [curveIdx, t])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function ArcLengthCurvatureSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CurveCanvas curveIdx={1} t={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const curveIdx = (scene.lineState?.params?.curveIdx as number | undefined) ?? 1
  const t = (scene.lineState?.params?.t as number | undefined) ?? 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CurveCanvas key={`${curveIdx}-${t}`} curveIdx={curveIdx} t={t} />
}
