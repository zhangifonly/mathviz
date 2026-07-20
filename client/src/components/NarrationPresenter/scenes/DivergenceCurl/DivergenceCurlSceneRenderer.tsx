/**
 * 散度与旋度场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { getField, type FieldId } from '../../../../experiments/divergence-curl/divergenceCurl'
import { drawDivergenceCurl } from '../../../../experiments/divergence-curl/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '散度与旋度', subtitle: '向量场的源与涡' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '散度与旋度', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['散度看源与汇', '旋度看涡旋', '共同刻画向量场'],
    'sum-physics': ['电磁定律的语言', '流体运动的语言', '一喷一转皆有序'],
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

function FieldCanvas({ field, grid }: { field: FieldId; grid: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawDivergenceCurl(canvas, getField(field), grid, true)
  }, [field, grid])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DivergenceCurlSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <FieldCanvas field="source" grid={11} />
  const id = scene.scene.id
  const type = scene.scene.type
  const field = (scene.lineState?.params?.field as FieldId | undefined) ?? 'source'
  const grid = (scene.lineState?.params?.grid as number | undefined) ?? 11

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <FieldCanvas key={`${field}-${grid}`} field={field} grid={grid} />
}
