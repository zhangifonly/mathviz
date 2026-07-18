/**
 * 保守场与势函数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { FIELDS } from '../../../../experiments/vector-calculus-field/vectorCalculusField'
import { drawVectorCalculusField } from '../../../../experiments/vector-calculus-field/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '保守场与势函数', subtitle: '做功只依赖起终点' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '保守场与势函数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['旋度处处为零', '存在势函数 phi', 'F 等于 phi 的梯度'],
    'sum-path': ['做功 = 势值之差', '与路径完全无关', '爬山与静电场皆如此'],
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

function FieldCanvas({ fieldIdx, showEq, showPaths }: { fieldIdx: number; showEq: boolean; showPaths: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawVectorCalculusField(canvas, FIELDS[fieldIdx], { showEquipotential: showEq, showPaths })
  }, [fieldIdx, showEq, showPaths])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function VectorCalculusFieldSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <FieldCanvas fieldIdx={0} showEq showPaths />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params || {}
  const fieldIdx = (p.fieldIdx as number | undefined) ?? 0
  const showEq = (p.showEq as boolean | undefined) ?? true
  const showPaths = (p.showPaths as boolean | undefined) ?? true

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <FieldCanvas key={`${fieldIdx}-${showEq}-${showPaths}`} fieldIdx={fieldIdx} showEq={showEq} showPaths={showPaths} />
}
