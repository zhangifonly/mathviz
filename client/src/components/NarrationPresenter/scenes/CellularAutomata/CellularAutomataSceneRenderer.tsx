/**
 * 元胞自动机讲解场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { evolve } from '../../../../experiments/cellular-automata/cellularAutomata'
import { drawCellularAutomata } from '../../../../experiments/cellular-automata/draw'

const WIDTH = 121
const GENS = 100

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '元胞自动机', subtitle: '最简单的规则，最复杂的世界' },
    'sum-end': { title: '感谢观看', subtitle: '探索简单规则中的复杂之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '元胞自动机', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['规则 30 → 混沌随机', '规则 90 → 谢尔宾斯基分形', '规则 110 → 图灵完备'],
    'sum-cosmos': ['局部规则驱动全局', '复杂无需复杂法则', '简单之中藏着无穷'],
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

function CACanvas({ rule }: { rule: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const grid = evolve(rule, WIDTH, GENS)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawCellularAutomata(canvas, grid, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [rule])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={520} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function CellularAutomataSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CACanvas rule={90} />
  const id = scene.scene.id
  const type = scene.scene.type
  const rule = (scene.lineState?.params?.rule as number | undefined) ?? 90

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CACanvas key={rule} rule={rule} />
}
