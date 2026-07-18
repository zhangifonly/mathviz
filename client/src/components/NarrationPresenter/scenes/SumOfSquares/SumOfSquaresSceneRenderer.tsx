/**
 * 平方和定理场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawSumOfSquares } from '../../../../experiments/sum-of-squares/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '平方和定理', subtitle: '哪些数是两平方和' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '平方和定理', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['a² + b² = n 的判定', '看 4k+3 型质因子', '需出现偶数次'],
    'sum-geom': ['格点圆的整点', '数论翻译成几何', '数与形彼此照亮'],
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

function SquaresCanvas({ mode, pick, range }: { mode: 'grid' | 'circle'; pick: number; range: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawSumOfSquares(canvas, range, mode, pick)
  }, [mode, pick, range])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function SumOfSquaresSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SquaresCanvas mode="grid" pick={25} range={100} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params
  const mode = (p?.mode as 'grid' | 'circle' | undefined) ?? 'grid'
  const pick = (p?.pick as number | undefined) ?? 25
  const range = (p?.range as number | undefined) ?? 100

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SquaresCanvas key={`${mode}-${pick}-${range}`} mode={mode} pick={pick} range={range} />
}
