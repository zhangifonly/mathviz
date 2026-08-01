/**
 * 球谐函数 讲解场景渲染器
 *
 * 曲面用 Canvas 2D + lib/draw3d 逐帧自转(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawHarmonic } from '../../../../experiments/spherical-harmonics/draw'
import { ORBITALS } from '../../../../experiments/spherical-harmonics/sphericalHarmonics'

const W = 640
const H = 540
const TITLES: Record<string, { title: string; subtitle: string }> = {
  'intro-1': { title: '球谐函数', subtitle: '球面上的振动模态' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES: Record<string, string[]> = {
  'sum-1': ['球面上的振动模态', '由角量子数 l 与磁量子数 m 标记', '球面版的傅里叶级数'],
  'sum-2': ['节线总数恒等于 l', '纬向 l−|m| 条', '经向 |m| 条'],
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const { title, subtitle } = TITLES[sceneId] || { title: '球谐函数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  if (sceneId === 'sum-3') return <TitleScene sceneId={sceneId} />
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">回顾</h2>
      {(SUMMARIES[sceneId] || []).map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
      <div className="mt-3 text-white/50 text-sm">
        {ORBITALS.slice(0, 4).map((o) => `${o.label}`).join(' · ')}
      </div>
    </div>
  )
}

function HarmonicCanvas({ l, m, showInfo }: { l: number; m: number; showInfo: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  // 量子数进依赖数组: 切句时模态变了要重启动画。
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
      drawHarmonic(canvas, { l, m, showInfo, yaw: 0.6 + el * 0.26 })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [l, m, showInfo])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SphericalHarmonicsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <HarmonicCanvas l={2} m={0} showInfo={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  const l = typeof p.l === 'number' ? p.l : 2
  // |m| 不能超过 l, 否则球谐恒为零, 画面会空掉
  const rawM = typeof p.m === 'number' ? p.m : 0
  return (
    <HarmonicCanvas
      l={l}
      m={Math.max(-l, Math.min(l, rawM))}
      showInfo={p.showInfo === true}
    />
  )
}
