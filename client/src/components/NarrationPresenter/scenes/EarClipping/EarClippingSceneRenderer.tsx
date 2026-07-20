/**
 * 耳切三角剖分场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { POLYGONS } from '../../../../experiments/ear-clipping/earClipping'
import { drawEarClipping } from '../../../../experiments/ear-clipping/draw'

const W = 640
const H = 540
const SCALE = 1.25

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '耳切三角剖分', subtitle: '把简单多边形切成三角形' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '耳切三角剖分', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['寻找耳朵：凸+空三角', '切下后顶点减一', '反复切耳化整为零'],
    'sum-classic': ['n 边切成 n-2 个三角形', '至少存在两只耳', '图形学三角化经典法'],
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

function EarClippingCanvas({ poly, step }: { poly: string; step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const polygon = POLYGONS[poly] ?? POLYGONS['L形']
    drawEarClipping(canvas, polygon, step, SCALE)
  }, [poly, step])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function EarClippingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <EarClippingCanvas poly="L形" step={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const poly = (scene.lineState?.params?.poly as string | undefined) ?? 'L形'
  const step = (scene.lineState?.params?.step as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <EarClippingCanvas key={`${poly}-${step}`} poly={poly} step={step} />
}
