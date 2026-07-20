/**
 * 函数图象变换场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { getBase, type Transform } from '../../../../experiments/function-transform/functionTransform'
import { drawFunctionTransform } from '../../../../experiments/function-transform/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '函数图象变换', subtitle: '平移·伸缩·翻折' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '函数图象变换', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['h、k 负责平移', 'a、b 负责伸缩', '形状随参数变化'],
    'sum-flip': ['a<0 沿 x 轴翻折', 'b<0 沿 y 轴翻折', '四参数掌控整个家族'],
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

function TransformCanvas({ baseKey, t }: { baseKey: string; t: Transform }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawFunctionTransform(canvas, getBase(baseKey).fn, t)
  }, [baseKey, t])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

const DEFAULT_T: Transform = { a: 1, b: 1, h: 0, k: 0 }

export default function FunctionTransformSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TransformCanvas baseKey="square" t={DEFAULT_T} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params ?? {}
  const baseKey = (p.base as string | undefined) ?? 'square'
  const t: Transform = {
    a: (p.a as number | undefined) ?? 1,
    b: (p.b as number | undefined) ?? 1,
    h: (p.h as number | undefined) ?? 0,
    k: (p.k as number | undefined) ?? 0,
  }

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TransformCanvas key={`${baseKey}-${t.a}-${t.b}-${t.h}-${t.k}`} baseKey={baseKey} t={t} />
}
