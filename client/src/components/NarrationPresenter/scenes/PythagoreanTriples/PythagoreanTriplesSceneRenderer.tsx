/**
 * 勾股数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawPythagoreanTriples } from '../../../../experiments/pythagorean-triples/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '勾股数', subtitle: '整数直角三角形' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '勾股数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['a²+b²=c² 的整数解', '3-4-5 是最小一组', '平面上放射状分布'],
    'sum-formula': ['欧几里得公式 m,n', 'a=m²-n², b=2mn, c=m²+n²', '本原乘整数得派生'],
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

function TriplesCanvas({ limit }: { limit: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawPythagoreanTriples(canvas, limit, null)
  }, [limit])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PythagoreanTriplesSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TriplesCanvas limit={120} />
  const id = scene.scene.id
  const type = scene.scene.type
  const limit = (scene.lineState?.params?.limit as number | undefined) ?? 120

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TriplesCanvas key={limit} limit={limit} />
}
