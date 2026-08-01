/**
 * 圆锥螺线 讲解场景渲染器
 *
 * 曲线用 Canvas 2D + lib/drawCurve 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawSpaceCurve } from '../../../../lib/drawCurve'
import { conicalSpiralAlpha, T_RANGE, CLASSIC } from '../../../../experiments/conical-spiral/conicalSpiral'

const W = 640
const H = 540
const TITLES: Record<string, { title: string; subtitle: string }> = {
  'intro-1': { title: '圆锥螺线', subtitle: '对数螺线被抬上圆锥' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES: Record<string, string[]> = {
  'sum-1': ['把对数螺线抬到圆锥面上', '高度与半径成正比', '贴在锥面上'],
  'sum-2': ['底面投影精确是对数螺线', '与所有母线夹角恒定', '故称圆锥等角螺线'],
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const { title, subtitle } = TITLES[sceneId] || { title: '圆锥螺线', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">回顾</h2>
      {(SUMMARIES[sceneId] || []).map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
    </div>
  )
}

function CurveCanvas({ a }: { a: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawSpaceCurve(canvas, {
        curve: conicalSpiralAlpha(a),
        tRange: T_RANGE,
        title: '圆锥螺线',
        subtitle: '半顶角 ' + ((a * 180) / Math.PI).toFixed(1) + '° · 投影为对数螺线',
        showFrames: 0,
        showProjection: true,
        steps: 900,
        ramp: 'plasma',
        yaw: 0.6 + el * 0.22,
        progress: Math.min(1, el / 3),
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [a])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function ConicalSpiralSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CurveCanvas a={CLASSIC.alpha} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  return <CurveCanvas a={typeof p.a === 'number' ? p.a : CLASSIC.alpha} />
}
