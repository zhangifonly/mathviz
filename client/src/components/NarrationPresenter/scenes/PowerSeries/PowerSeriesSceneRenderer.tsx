/**
 * 幂级数收敛场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SERIES_OPTIONS } from '../../../../experiments/power-series/powerSeries'
import { drawPowerSeries } from '../../../../experiments/power-series/draw'
import type { DrawData } from '../../../../experiments/power-series/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '幂级数收敛', subtitle: '无穷项相加如何逼近一个函数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '幂级数收敛', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['无穷项相加逼近函数', '部分和项数越多越准', '黄线不断压向蓝线'],
    'sum-radius': ['收敛半径划定范围', '边界以内收敛', '越过边界即发散'],
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

/** 按级数选择合适的绘图范围 */
function buildData(seriesId: string, terms: number): DrawData | null {
  const series = SERIES_OPTIONS.find((o) => o.id === seriesId)
  if (!series) return null
  if (seriesId === 'exp') {
    return { series, terms, xMin: -3, xMax: 3, yMin: -2, yMax: 12 }
  }
  if (seriesId === 'geometric') {
    return { series, terms, xMin: -1.6, xMax: 1.6, yMin: -3, yMax: 6 }
  }
  // ln(1+x) 与 arctan(x)
  return { series, terms, xMin: -1.6, xMax: 1.6, yMin: -2.5, yMax: 2.5 }
}

function SeriesCanvas({ seriesId, terms }: { seriesId: string; terms: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const data = buildData(seriesId, terms)
    if (!data) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawPowerSeries(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seriesId, terms])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={640} height={520} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function PowerSeriesSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SeriesCanvas seriesId="geometric" terms={6} />
  const id = scene.scene.id
  const type = scene.scene.type
  const seriesId = (scene.lineState?.params?.seriesId as string | undefined) ?? 'geometric'
  const terms = (scene.lineState?.params?.terms as number | undefined) ?? 6

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SeriesCanvas key={`${seriesId}-${terms}`} seriesId={seriesId} terms={terms} />
}
