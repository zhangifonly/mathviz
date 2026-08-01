/**
 * 管状曲面 讲解场景渲染器
 *
 * 曲面用 Canvas 2D + lib/draw3d 逐帧自转(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawTube } from '../../../../experiments/tube-surface/draw'
import { CURVES, type CurveKind } from '../../../../experiments/tube-surface/tubeSurface'

const W = 640
const H = 540
const TITLES: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '管状曲面', subtitle: '沿曲线套一根圆管' },
    'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES: Record<string, string[]> = {
    'sum-1': ['难点在截面朝向', '需要沿曲线移动的正交标架', '否则管子会拧起来'],
    'sum-2': ['T 切向 N 主法向 B 副法向', '三者两两垂直', '曲率为零处标架失效'],
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const { title, subtitle } = TITLES[sceneId] || { title: '管状曲面', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items = SUMMARIES
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">回顾</h2>
      {(items[sceneId] || []).map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
    </div>
  )
}

interface SurfaceProps {
  kind: CurveKind
  radius: number; showCenter: boolean; showFrame: boolean; surfaceAlpha: number
}

function SurfaceCanvas({ kind, radius, showCenter, showFrame, surfaceAlpha }: SurfaceProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  // 参数全部进依赖数组: 切句时类型变了要重启动画。
  // 几何量一律在 loop 里按当前帧算, 不缓存任何按参数定尺寸的数组,
  // 避免「实例复用导致尺寸锁死在首次挂载值」那类越界崩溃。
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawTube(canvas, { kind, radius, showCenter, showFrame, surfaceAlpha, yaw: 0.6 + el * 0.26 })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [kind, radius, showCenter, showFrame, surfaceAlpha])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function TubeSurfaceSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SurfaceCanvas kind="helix" radius={0.25} showCenter={false} showFrame={false} surfaceAlpha={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  const raw = p.kind
  const kind = (CURVES as readonly string[]).includes(raw as string)
    ? (raw as CurveKind)
    : 'helix'
  return (
    <SurfaceCanvas
      kind={kind}
      radius={typeof p.radius === 'number' ? p.radius : 0.25}
      showCenter={p.showCenter === true}
      showFrame={p.showFrame === true}
      surfaceAlpha={typeof p.surfaceAlpha === 'number' ? p.surfaceAlpha : 1}
    />
  )
}
