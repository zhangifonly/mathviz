/**
 * 牛顿分形场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawNewtonFractal } from '../../../../experiments/newton-fractal/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '牛顿分形', subtitle: '复平面上的收敛盆地' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '牛顿分形', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['起点决定收敛的根', '同色=同一收敛盆地', '亮度表示收敛速度'],
    'sum-boundary': ['盆地边界是分形', '无穷放大自相似', '微小差异导致混沌'],
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

function FractalCanvas({ poly, scale }: { poly: string; scale: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawNewtonFractal(canvas, poly, 0, 0, scale, 40)
  }, [poly, scale])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-slate-900" />
    </div>
  )
}

export default function NewtonFractalSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <FractalCanvas poly="z^3-1" scale={1.6} />
  const id = scene.scene.id
  const type = scene.scene.type
  const poly = (scene.lineState?.params?.poly as string | undefined) ?? 'z^3-1'
  const scale = (scene.lineState?.params?.scale as number | undefined) ?? 1.6

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <FractalCanvas key={`${poly}-${scale}`} poly={poly} scale={scale} />
}
