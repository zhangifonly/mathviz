/**
 * 奇偶数与整除场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { buildGrid } from '../../../../experiments/even-odd/evenOdd'
import { drawEvenOdd } from '../../../../experiments/even-odd/draw'

const COUNT = 100

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '奇偶数与整除', subtitle: '藏在数字里的规律' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '奇偶数与整除', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['偶数能被 2 整除，奇数不能', '偶+偶=偶，奇+奇=偶，奇+偶=奇', '奇×奇才是奇，其余积为偶'],
    'sum-divide': ['整除即余数为 0', '被整除的数就是除数的倍数', '数格花纹揭示规律'],
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

function GridCanvas({ divisor }: { divisor: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const cells = buildGrid(COUNT, divisor)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.04)
      drawEvenOdd(canvas, cells, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [divisor])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={600} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function EvenOddSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GridCanvas divisor={2} />
  const id = scene.scene.id
  const type = scene.scene.type
  const divisor = (scene.lineState?.params?.divisor as number | undefined) ?? 2

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GridCanvas key={divisor} divisor={divisor} />
}
