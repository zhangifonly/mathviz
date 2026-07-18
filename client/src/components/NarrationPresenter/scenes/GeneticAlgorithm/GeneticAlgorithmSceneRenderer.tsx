/**
 * 遗传算法场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { runGA, POP_SIZE } from '../../../../experiments/genetic-algorithm/geneticAlgorithm'
import { drawGeneticAlgorithm } from '../../../../experiments/genetic-algorithm/draw'

const W = 640
const H = 540
const MAX_GEN = 30

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '遗传算法', subtitle: '向生命学来的进化式优化' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '遗传算法', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['个体=候选解', '适应度衡量优劣', '选择·交叉·变异驱动进化'],
    'sum-power': ['种群向最优峰收敛', '不依赖导数信息', '擅长复杂优化难题'],
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

function GACanvas({ gen }: { gen: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const history = runGA(POP_SIZE, MAX_GEN, 1)
    drawGeneticAlgorithm(canvas, history, Math.min(gen, MAX_GEN))
  }, [gen])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function GeneticAlgorithmSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GACanvas gen={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const gen = (scene.lineState?.params?.gen as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GACanvas key={gen} gen={gen} />
}
