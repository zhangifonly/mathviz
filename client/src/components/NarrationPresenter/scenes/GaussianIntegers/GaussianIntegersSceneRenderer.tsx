/**
 * 高斯整数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawGaussianIntegers } from '../../../../experiments/gaussian-integers/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '高斯整数', subtitle: '复平面上的整数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '高斯整数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['整数搬上复平面', '范数 N=a²+b²', '排成方格点阵'],
    'sum-prime': ['高斯素数规则判定', '呈八重对称分布', '素数分裂焕然一新'],
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

function GaussianCanvas({ range, primesOnly }: { range: number; primesOnly: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawGaussianIntegers(canvas, range, primesOnly)
  }, [range, primesOnly])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function GaussianIntegersSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GaussianCanvas range={10} primesOnly={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const range = (scene.lineState?.params?.range as number | undefined) ?? 10
  const primesOnly = (scene.lineState?.params?.primesOnly as boolean | undefined) ?? false

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GaussianCanvas key={`${range}-${primesOnly}`} range={range} primesOnly={primesOnly} />
}
