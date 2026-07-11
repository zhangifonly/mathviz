/**
 * 渗流模型场景渲染器
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { createRng, generateLattice } from '../../../../experiments/percolation/percolation'
import { drawPercolation } from '../../../../experiments/percolation/draw'

const SIZE = 80

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '渗流模型', subtitle: '随机点阵上的连通相变' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '渗流模型', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['随机开放格点组成连通簇', '临界点上巨簇突然涌现', '刻画连通性的相变'],
    'sum-universal': ['临界概率 p_c ≈ 0.5927', '最大簇占比是序参量', '临界点呈分形与标度不变'],
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

function PercolationCanvas({ p, seed }: { p: number; seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const grid = useMemo(() => generateLattice(SIZE, p, createRng(seed)), [p, seed])
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawPercolation(canvas, { grid, p }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [grid, p])
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={600} height={600} className="max-w-full max-h-full rounded-lg" />
      <div className="text-white/70 text-lg">开放概率 p = {p.toFixed(2)}</div>
    </div>
  )
}

export default function PercolationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PercolationCanvas p={0.59} seed={7} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = (scene.lineState?.params?.p as number | undefined) ?? 0.59
  const seed = (scene.lineState?.params?.seed as number | undefined) ?? 7

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PercolationCanvas key={`${p}-${seed}`} p={p} seed={seed} />
}
