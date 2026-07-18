/**
 * 阻尼振荡场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawDampedOscillation } from '../../../../experiments/damped-oscillation/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '阻尼振荡', subtitle: '欠阻尼 · 临界 · 过阻尼' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '阻尼振荡', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['同一方程三种命运', '关键是阻尼比 ζ', 'x(0)=1, x′(0)=0'],
    'sum-three': ['欠阻尼：振荡衰减', '临界：最快回位', '过阻尼：缓慢归零'],
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

function DampedCanvas({ zeta }: { zeta?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawDampedOscillation(canvas, 1, 20, zeta)
  }, [zeta])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DampedOscillationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DampedCanvas />
  const id = scene.scene.id
  const type = scene.scene.type
  const zeta = scene.lineState?.params?.zeta as number | undefined

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <DampedCanvas key={String(zeta)} zeta={zeta} />
}
