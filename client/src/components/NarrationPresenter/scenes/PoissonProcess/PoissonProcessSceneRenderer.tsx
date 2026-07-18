/**
 * 泊松过程场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { simulateArrivals } from '../../../../experiments/poisson-process/poissonProcess'
import { drawPoissonProcess } from '../../../../experiments/poisson-process/draw'

const W = 640
const H = 540
const T = 30

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '泊松过程', subtitle: '随机到达的计数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '泊松过程', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-gap': ['间隔服从指数分布', '负对数除以速率采样', '累加得到达时刻'],
    'sum-dist': ['N(t) 是阶梯函数', '窗内次数服从泊松', '平均到达数 λt'],
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

function PoissonCanvas({ rate }: { rate: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const arrivals = simulateArrivals(rate, T, 1)
    drawPoissonProcess(canvas, arrivals, T)
  }, [rate])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PoissonProcessSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PoissonCanvas rate={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const rate = (scene.lineState?.params?.rate as number | undefined) ?? 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PoissonCanvas key={rate} rate={rate} />
}
