/**
 * 对称之美场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SYMMETRY_OPTIONS } from '../../../../experiments/symmetry/symmetry'
import { drawSymmetry } from '../../../../experiments/symmetry/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '对称之美', subtitle: '藏在蝴蝶与雪花里的数学规律' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '对称之美', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['对称 = 变换后与自己重合', '镜子两半完全一样', '中心转动仍然一样'],
    'sum-two': ['翻一翻是镜像对称', '转一转是旋转对称', '自然中处处是对称'],
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

function SymmetryCanvas({ optionId }: { optionId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const option = SYMMETRY_OPTIONS.find((o) => o.id === optionId) ?? SYMMETRY_OPTIONS[0]
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawSymmetry(canvas, option, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [optionId])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={600} height={560} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SymmetrySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SymmetryCanvas optionId="butterfly" />
  const id = scene.scene.id
  const type = scene.scene.type
  const optionId = (scene.lineState?.params?.optionId as string | undefined) ?? 'butterfly'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SymmetryCanvas key={optionId} optionId={optionId} />
}
