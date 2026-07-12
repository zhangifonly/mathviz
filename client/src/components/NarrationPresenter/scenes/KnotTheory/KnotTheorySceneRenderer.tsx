/**
 * 纽结理论场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { knotCurve, KNOT_OPTIONS } from '../../../../experiments/knot-theory/knotTheory'
import { drawKnotTheory } from '../../../../experiments/knot-theory/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '纽结理论', subtitle: '如何用数学分辨打结的绳圈' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '纽结理论', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['纽结 = 三维空间的闭合曲线', '交叉数：最少的上下穿越数', '亏格：填补曲面的复杂度'],
    'sum-jones': ['琼斯多项式区分纽结', '在变量取一时恒等于一', '连接拓扑与量子物理'],
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

function KnotCanvas({ knotId }: { knotId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const info = KNOT_OPTIONS.find((k) => k.id === knotId) ?? KNOT_OPTIONS[1]
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const pts = knotCurve(knotId, 500)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.006)
      drawKnotTheory(canvas, pts, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [knotId])
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={620} height={560} className="max-w-full max-h-full rounded-lg" />
      <div className="text-white/70 text-sm flex gap-6">
        <span>{info.name} ({info.symbol})</span>
        <span>交叉数 {info.crossingNumber}</span>
        <span>亏格 {info.genus}</span>
      </div>
    </div>
  )
}

export default function KnotTheorySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <KnotCanvas knotId="trefoil" />
  const id = scene.scene.id
  const type = scene.scene.type
  const knotId = (scene.lineState?.params?.knot as string | undefined) ?? 'trefoil'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <KnotCanvas key={knotId} knotId={knotId} />
}
