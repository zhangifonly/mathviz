/**
 * 空间曲线与活动标架 讲解场景渲染器
 *
 * 曲线用 Canvas 2D + lib/drawCurve 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawSpaceCurve } from '../../../../lib/drawCurve'
import { curveOf, rangeOf, infoOf, CURVE_KINDS, type CurveKind } from '../../../../experiments/space-curve-frenet/spaceCurveFrenet'

const W = 640
const H = 540
const TITLES: Record<string, { title: string; subtitle: string }> = {
  'intro-1': { title: '空间曲线与活动标架', subtitle: '两个数决定一条曲线' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES: Record<string, string[]> = {
  'sum-1': ['曲率与挠率完全决定曲线形状', '差一个刚体运动', '曲线论基本定理'],
  'sum-2': ['挠率恒为零 ⟺ 平面曲线', '此时副法向量固定不动', 'Frenet 标架沿曲线滚动'],
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const { title, subtitle } = TITLES[sceneId] || { title: '空间曲线与活动标架', subtitle: '' }
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

function CurveCanvas({ kind }: { kind: CurveKind }) {
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
        curve: curveOf(kind),
        tRange: rangeOf(kind),
        title: infoOf(kind).label,
        subtitle: infoOf(kind).note,
        showFrames: 6,
        showProjection: false,
        steps: 700,
        ramp: 'plasma',
        yaw: 0.6 + el * 0.22,
        progress: Math.min(1, el / 3),
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [kind])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SpaceCurveFrenetSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CurveCanvas kind="helix" />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  const raw = p.kind
  const kind = (CURVE_KINDS as readonly string[]).includes(raw as string)
    ? (raw as CurveKind)
    : 'helix'
  return <CurveCanvas kind={kind} />
}
