/**
 * 维维亚尼曲线 讲解场景渲染器
 *
 * 曲线用 Canvas 2D + lib/drawCurve 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawSpaceCurve } from '../../../../lib/drawCurve'
import { vivianiCurve, T_RANGE } from '../../../../experiments/viviani-curve/vivianiCurve'

const W = 640
const H = 540
const TITLES: Record<string, { title: string; subtitle: string }> = {
  'intro-1': { title: '维维亚尼曲线', subtitle: '球与柱的交线' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES: Record<string, string[]> = {
  'sum-1': ['半径 2a 的球面', '与半径 a 过球心的圆柱面', '两者的交线'],
  'sum-2': ['参数周期是 4π', '只取 [0,2π] 漏掉下半条', '三投影得圆/抛物线/双纽线'],
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const { title, subtitle } = TITLES[sceneId] || { title: '维维亚尼曲线', subtitle: '' }
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
        curve: vivianiCurve(a),
        tRange: T_RANGE,
        title: '维维亚尼曲线',
        subtitle: '球面 ∩ 圆柱面 · t∈[0,4π]',
        showFrames: 0,
        showProjection: true,
        steps: 800,
        ramp: 'ocean',
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

export default function VivianiCurveSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CurveCanvas a={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  return <CurveCanvas a={typeof p.a === 'number' ? p.a : 1} />
}
