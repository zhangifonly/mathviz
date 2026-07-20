/**
 * 佩尔方程场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { fundamentalSolution } from '../../../../experiments/pell-equation/pellEquation'
import { drawPellEquation } from '../../../../experiments/pell-equation/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '佩尔方程', subtitle: 'x²-Ny²=1 的整数解' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '佩尔方程', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['丢番图整数方程', 'x²-Ny²=1', '求整数对 (x,y)'],
    'sum-method': ['连分数求基本解', '递推展开无穷解', '几何上是双曲线'],
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

function PellCanvas({ n }: { n: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawPellEquation(canvas, n, 3)
  }, [n])
  const base = fundamentalSolution(n)
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
      <p className="text-lg text-white/80">
        N = {n}
        {base ? `，基本解 (${base.x}, ${base.y})` : ''}
      </p>
    </div>
  )
}

export default function PellEquationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PellCanvas n={2} />
  const id = scene.scene.id
  const type = scene.scene.type
  const n = (scene.lineState?.params?.n as number | undefined) ?? 2

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PellCanvas key={n} n={n} />
}
