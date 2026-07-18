/**
 * 曲线积分场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { getField, getPath, lineIntegral2 } from '../../../../experiments/line-integral/lineIntegral'
import { drawLineIntegral } from '../../../../experiments/line-integral/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '曲线积分', subtitle: '沿路径累加做功' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '曲线积分', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['向量场沿路径做功', '切段累加 F·dr', '数值积分逼近'],
    'sum-dot': ['做功正负看 F·切向', '同向正功·反向负功', '垂直则不做功'],
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

function IntegralCanvas({ fieldId, pathId }: { fieldId: string; pathId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const field = getField(fieldId)
  const path = getPath(pathId)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawLineIntegral(canvas, field, path)
  }, [field, path])
  const work = lineIntegral2(field, path)
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
      <p className="text-lg text-white/85">{field.name} · {path.name}：∫F·dr = <b>{work.toFixed(3)}</b></p>
    </div>
  )
}

export default function LineIntegralSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <IntegralCanvas fieldId="rotation" pathId="arc" />
  const id = scene.scene.id
  const type = scene.scene.type
  const fieldId = (scene.lineState?.params?.field as string | undefined) ?? 'rotation'
  const pathId = (scene.lineState?.params?.path as string | undefined) ?? 'arc'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <IntegralCanvas key={`${fieldId}-${pathId}`} fieldId={fieldId} pathId={pathId} />
}
