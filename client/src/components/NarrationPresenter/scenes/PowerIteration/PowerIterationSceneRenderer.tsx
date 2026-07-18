/**
 * 幂迭代场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_MATRICES } from '../../../../experiments/power-iteration/powerIteration'
import { drawPowerIteration } from '../../../../experiments/power-iteration/draw'

const W = 640
const H = 540
const V0: [number, number] = [1, 0]
const ITERS = 24

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '幂迭代', subtitle: '反复乘矩阵求主特征向量' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '幂迭代', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['反复做 v ← Av/|Av|', '归一化只留方向', '收敛到主特征向量'],
    'sum-apply': ['瑞利商估计主特征值', '主值越突出收敛越快', 'PageRank 的数学内核'],
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

function PowerIterationCanvas({ mi, step }: { mi: number; step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const matrix = SAMPLE_MATRICES[mi]?.matrix ?? SAMPLE_MATRICES[0].matrix
    drawPowerIteration(canvas, matrix, V0, step, ITERS)
  }, [mi, step])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PowerIterationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PowerIterationCanvas mi={0} step={6} />
  const id = scene.scene.id
  const type = scene.scene.type
  const mi = (scene.lineState?.params?.mi as number | undefined) ?? 0
  const step = (scene.lineState?.params?.step as number | undefined) ?? 6

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PowerIterationCanvas key={`${mi}-${step}`} mi={mi} step={step} />
}
