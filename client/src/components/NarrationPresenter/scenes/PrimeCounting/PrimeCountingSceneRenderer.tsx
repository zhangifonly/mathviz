/**
 * 素数计数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawPrimeCounting } from '../../../../experiments/prime-counting/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '素数计数与素数定理', subtitle: '素数分布的宏观规律' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '素数计数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['π(x) 数出素数个数', '画出向上的阶梯', '看似杂乱却有规律'],
    'sum-approx': ['素数定理 π(x)~x/ln x', 'Li(x) 更精确', '随机中藏着秩序'],
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

function PrimeCountingCanvas({ upper }: { upper: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawPrimeCounting(canvas, upper)
  }, [upper])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PrimeCountingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PrimeCountingCanvas upper={1000} />
  const id = scene.scene.id
  const type = scene.scene.type
  const upper = (scene.lineState?.params?.upper as number | undefined) ?? 1000

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PrimeCountingCanvas key={upper} upper={upper} />
}
