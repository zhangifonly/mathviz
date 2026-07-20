/**
 * 汉诺塔场景渲染器
 */
import { useEffect, useRef, useMemo } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { solveHanoi } from '../../../../experiments/tower-of-hanoi/towerOfHanoi'
import { drawTowerOfHanoi } from '../../../../experiments/tower-of-hanoi/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '汉诺塔', subtitle: '递归之美与指数增长' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '汉诺塔', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['先移上面 n-1 个', '再移最大盘', '递归拆解大问题'],
    'sum-exp': ['最少 2ⁿ-1 步', '每加一盘步数翻倍', '指数增长的典范'],
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

function HanoiCanvas({ n, step }: { n: number; step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const steps = useMemo(() => solveHanoi(n, 'A', 'C', 'B'), [n])
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawTowerOfHanoi(canvas, n, steps, Math.min(step, steps.length))
  }, [n, steps, step])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function TowerOfHanoiSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <HanoiCanvas n={3} step={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const n = (scene.lineState?.params?.n as number | undefined) ?? 3
  const step = (scene.lineState?.params?.step as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <HanoiCanvas key={`${n}-${step}`} n={n} step={step} />
}
