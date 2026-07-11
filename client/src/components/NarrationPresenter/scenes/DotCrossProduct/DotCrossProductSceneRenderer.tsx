/**
 * 点积与叉积场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { DOT_CROSS_OPTIONS } from '../../../../experiments/dot-cross-product/dotCrossProduct'
import { drawDotCrossProduct, type DrawMode } from '../../../../experiments/dot-cross-product/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '点积与叉积', subtitle: '两种向量乘法背后的几何意义' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '点积与叉积', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-dot': ['点积结果是标量', '等于长度乘积乘余弦', '衡量投影与做功'],
    'sum-cross': ['叉积结果是向量', '模长等于正弦乘积', '衡量面积与力矩'],
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

function VectorCanvas({ mode, pairId }: { mode: DrawMode; pairId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const option = DOT_CROSS_OPTIONS.find((o) => o.id === pairId) ?? DOT_CROSS_OPTIONS[1]
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawDotCrossProduct(canvas, { a: option.a, b: option.b, mode }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mode, pairId])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={560} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function DotCrossProductSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <VectorCanvas mode="dot" pairId="general" />
  const id = scene.scene.id
  const type = scene.scene.type
  const mode = (scene.lineState?.params?.mode as DrawMode | undefined) ?? 'dot'
  const pairId = (scene.lineState?.params?.pair as string | undefined) ?? 'general'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <VectorCanvas key={`${mode}-${pairId}`} mode={mode} pairId={pairId} />
}
