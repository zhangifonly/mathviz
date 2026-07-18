/**
 * 骰子与古典概率场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawDiceProbability } from '../../../../experiments/dice-probability/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '骰子与古典概率', subtitle: '频率逼近概率' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '骰子与古典概率', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-classical': ['等可能结果', '有利数÷总数', '精确的理论值'],
    'sum-law': ['大量试验', '频率逼近概率', '这就是大数定律'],
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

function DiceCanvas({ numDice, trials }: { numDice: number; trials: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawDiceProbability(canvas, numDice, trials, 1)
  }, [numDice, trials])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DiceProbabilitySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DiceCanvas numDice={2} trials={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const numDice = (scene.lineState?.params?.numDice as number | undefined) ?? 2
  const trials = (scene.lineState?.params?.trials as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <DiceCanvas key={`${numDice}-${trials}`} numDice={numDice} trials={trials} />
}
