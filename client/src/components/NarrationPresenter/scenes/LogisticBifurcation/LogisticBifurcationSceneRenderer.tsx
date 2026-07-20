/**
 * Logistic 分岔图场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { R_WINDOWS } from '../../../../experiments/logistic-bifurcation/logisticBifurcation'
import { drawLogisticBifurcation } from '../../../../experiments/logistic-bifurcation/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'Logistic分岔图', subtitle: '通往混沌的倍周期' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'Logistic分岔图', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['x = r·x·(1−x)', '一个乘法串起秩序', '与混沌相连'],
    'sum-ladder': ['倍周期 1→2→4→8', '费根鲍姆常数收缩', '简单中藏着深邃'],
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

function BifurcationCanvas({ win }: { win: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const [rMin, rMax] = R_WINDOWS[win] ?? R_WINDOWS[0]
    drawLogisticBifurcation(canvas, rMin, rMax, 520)
  }, [win])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-slate-900" />
    </div>
  )
}

export default function LogisticBifurcationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <BifurcationCanvas win={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const win = (scene.lineState?.params?.win as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <BifurcationCanvas key={win} win={win} />
}
