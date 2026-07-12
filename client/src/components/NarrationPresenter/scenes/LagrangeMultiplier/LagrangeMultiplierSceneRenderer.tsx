/**
 * 拉格朗日乘数法场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawLagrangeMultiplier, type DrawData } from '../../../../experiments/lagrange-multiplier/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '拉格朗日乘数', subtitle: '在约束下寻找极值的优雅方法' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '拉格朗日乘数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-tangent': ['约束曲线与等高线相切', '相切之处即约束极值', '几何直觉一目了然'],
    'sum-eq': ['平行写成 ∇f = λ∇g', 'λ 串起两个梯度', '几何与代数完美统一'],
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

function LagrangeCanvas({ data }: { data: DrawData }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawLagrangeMultiplier(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [data])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function LagrangeMultiplierSceneRenderer({ scene }: SceneRendererProps) {
  const fallback: DrawData = { a: 1, b: 1, r: 1 }
  if (!scene) return <LagrangeCanvas data={fallback} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params
  const data: DrawData = {
    a: (p?.a as number | undefined) ?? 1,
    b: (p?.b as number | undefined) ?? 1,
    r: (p?.r as number | undefined) ?? 1,
  }

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <LagrangeCanvas key={`${data.a}-${data.b}-${data.r}`} data={data} />
}
