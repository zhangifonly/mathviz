/**
 * 二次曲面分类 讲解场景渲染器
 *
 * 曲面用 Canvas 2D + lib/draw3d 逐帧自转(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawQuadric } from '../../../../experiments/quadric-surfaces/draw'
import {
  KINDS, QUADRIC_INFO, type QuadricKind,
} from '../../../../experiments/quadric-surfaces/quadricSurfaces'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '二次曲面分类', subtitle: '三元二次方程的六张面孔' },
    'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '二次曲面', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  if (sceneId === 'sum-1') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <h2 className="text-3xl font-bold text-white mb-2">六类非退化二次曲面</h2>
        {QUADRIC_INFO.map((q) => (
          <div key={q.kind} className="text-lg text-white/80 flex items-center gap-3">
            <span className="text-emerald-400">✓</span>
            <span className="w-32">{q.label}</span>
            <span className="text-white/50 text-sm">{q.equation}</span>
          </div>
        ))}
      </div>
    )
  }
  const items = ['符号组合决定类型', '系数大小只改变胖瘦', '单叶双曲面与马鞍面是直纹面']
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">回顾</h2>
      {items.map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
    </div>
  )
}

function SurfaceCanvas({ kind, a }: { kind: QuadricKind; a: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  // kind/a 进依赖数组: 切句时曲面类型变了要重启动画。
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
      drawQuadric(canvas, { kind, a, yaw: 0.6 + el * 0.26 })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [kind, a])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function QuadricSurfacesSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SurfaceCanvas kind="ellipsoid" a={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  const raw = p.kind
  const kind = (KINDS as readonly string[]).includes(raw as string)
    ? (raw as QuadricKind)
    : 'ellipsoid'
  return <SurfaceCanvas kind={kind} a={typeof p.a === 'number' ? p.a : 1} />
}
