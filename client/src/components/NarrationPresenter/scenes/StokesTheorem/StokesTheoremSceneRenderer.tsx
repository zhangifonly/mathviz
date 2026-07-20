/**
 * 斯托克斯定理场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { FIELDS, REGIONS } from '../../../../experiments/stokes-theorem/stokesTheorem'
import { drawStokesTheorem } from '../../../../experiments/stokes-theorem/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '斯托克斯定理', subtitle: '边界环量等于内部旋度' },
    'sum-end': { title: '感谢观看', subtitle: '边界与内部，本是一体' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '斯托克斯定理', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['边界环量 ∮F·dr', '等于内部旋度积分', '一条曲线连起整块区域'],
    'sum-echo': ['格林定理即平面特例', '内部边界两两抵消', '微积分基本定理的高维回响'],
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

function StokesCanvas({ fieldId, regionId }: { fieldId: string; regionId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const field = FIELDS.find((f) => f.id === fieldId) ?? FIELDS[0]
    const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0]
    drawStokesTheorem(canvas, field, region, true)
  }, [fieldId, regionId])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function StokesTheoremSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <StokesCanvas fieldId="rotation" regionId="circle" />
  const id = scene.scene.id
  const type = scene.scene.type
  const fieldId = (scene.lineState?.params?.field as string | undefined) ?? 'rotation'
  const regionId = (scene.lineState?.params?.region as string | undefined) ?? 'circle'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <StokesCanvas key={`${fieldId}-${regionId}`} fieldId={fieldId} regionId={regionId} />
}
