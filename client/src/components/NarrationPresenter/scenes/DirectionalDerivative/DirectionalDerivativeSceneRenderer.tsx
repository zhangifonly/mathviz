/**
 * 方向导数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { fieldById } from '../../../../experiments/directional-derivative/directionalDerivative'
import { drawDirectionalDerivative } from '../../../../experiments/directional-derivative/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '方向导数', subtitle: '任意方向的变化率' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '方向导数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['沿任意方向的变化率', '玫瑰图半径即方向导数', '方向不同坡度不同'],
    'sum-key': ['D_u f = ∇f · u', '梯度方向最陡 =|∇f|', '垂直方向导数为零'],
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

function DirDerivCanvas({ fieldId, angle }: { fieldId: string; angle: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const field = fieldById(fieldId)
    drawDirectionalDerivative(canvas, field, 1, 1, (angle * Math.PI) / 180)
  }, [fieldId, angle])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DirectionalDerivativeSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DirDerivCanvas fieldId="paraboloid" angle={45} />
  const id = scene.scene.id
  const type = scene.scene.type
  const fieldId = (scene.lineState?.params?.field as string | undefined) ?? 'paraboloid'
  const angle = (scene.lineState?.params?.angle as number | undefined) ?? 45

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <DirDerivCanvas key={`${fieldId}-${angle}`} fieldId={fieldId} angle={angle} />
}
