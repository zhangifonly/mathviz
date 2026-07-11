/**
 * 圆的几何场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawCircleGeometry } from '../../../../experiments/circle-geometry/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '圆的几何', subtitle: '从周长面积到圆周角定理' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '圆的几何', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-formulas': ['周长 C = 2πr', '面积 S = πr²', '半径增大，面积按平方增长'],
    'sum-theorems': ['弧长 L = rθ', '扇形 S = ½r²θ', '弦长 = 2r·sin(θ/2)', '圆周角 = 圆心角的一半'],
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

function CircleCanvas({ topicId, angleDeg }: { topicId: string; angleDeg: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawCircleGeometry(canvas, { topicId, angleDeg }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [topicId, angleDeg])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function CircleGeometrySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CircleCanvas topicId="circumference" angleDeg={360} />
  const id = scene.scene.id
  const type = scene.scene.type
  const topicId = (scene.lineState?.params?.topicId as string | undefined) ?? 'circumference'
  const angleDeg = (scene.lineState?.params?.angleDeg as number | undefined) ?? 360

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CircleCanvas key={`${topicId}-${angleDeg}`} topicId={topicId} angleDeg={angleDeg} />
}
