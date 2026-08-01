/**
 * 三叶结曲面 讲解场景渲染器
 *
 * 曲面用 Canvas 2D + lib/draw3d 逐帧自转(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawTrefoil } from '../../../../experiments/trefoil-surface/draw'
import { CROSSING_NUMBER } from '../../../../experiments/trefoil-surface/trefoilSurface'

const W = 640
const H = 540
const TITLES: Record<string, { title: string; subtitle: string }> = {
  'intro-1': { title: '三叶结曲面', subtitle: '最简单的非平凡纽结' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES: Record<string, string[]> = {
  'sum-1': [`交叉数为 ${CROSSING_NUMBER}`, '非平凡纽结的最小值', '纽结表上编号排第一'],
  'sum-2': ['Δ(t) = t² − t + 1', '不等于平凡纽结的常数 1', '这严格证明了它打不开'],
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const { title, subtitle } = TITLES[sceneId] || { title: '三叶结', subtitle: '' }
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

function KnotCanvas({ p, q, showInfo }: { p: number; q: number; showInfo: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  // p/q 进依赖数组: 切句时纽结类型变了要重启动画。
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
      drawTrefoil(canvas, { p, q, showInfo, yaw: 0.6 + el * 0.26 })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [p, q, showInfo])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function TrefoilSurfaceSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <KnotCanvas p={2} q={3} showInfo={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const s = scene.lineState?.params ?? {}
  return (
    <KnotCanvas
      p={typeof s.p === 'number' ? s.p : 2}
      q={typeof s.q === 'number' ? s.q : 3}
      showInfo={s.showInfo === true}
    />
  )
}
