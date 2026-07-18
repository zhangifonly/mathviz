/**
 * 级数收敛判别场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SERIES } from '../../../../experiments/series-convergence/seriesConvergence'
import { drawSeriesConvergence } from '../../../../experiments/series-convergence/draw'

const W = 640
const H = 540

const LIMITS: Record<string, number | undefined> = {
  geometric: 2,
  harmonic: undefined,
  p2: (Math.PI * Math.PI) / 6,
  alternating: Math.LN2,
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '级数收敛判别', subtitle: '无穷和何时有限' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '级数收敛判别', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['收敛=部分和有极限', '发散=部分和无界', '关键看序列走势'],
    'sum-cases': ['几何级数收敛', 'p>1 收敛，调和发散', '比值与 p 级数判据'],
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

function SeriesCanvas({ seriesKey, N }: { seriesKey: string; N: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const def = SERIES.find((s) => s.key === seriesKey) ?? SERIES[0]
    drawSeriesConvergence(canvas, def.term, N, def.converges ? LIMITS[def.key] : undefined)
  }, [seriesKey, N])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function SeriesConvergenceSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SeriesCanvas seriesKey="geometric" N={50} />
  const id = scene.scene.id
  const type = scene.scene.type
  const seriesKey = (scene.lineState?.params?.key as string | undefined) ?? 'geometric'
  const N = (scene.lineState?.params?.N as number | undefined) ?? 50

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SeriesCanvas key={seriesKey + N} seriesKey={seriesKey} N={N} />
}
