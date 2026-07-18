/**
 * 庞加莱截面场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { PARAM_SETS } from '../../../../experiments/poincare-section/poincareSection'
import { drawPoincareSection } from '../../../../experiments/poincare-section/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '庞加莱截面', subtitle: '高维轨迹压成点图' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '庞加莱截面', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['按驱动周期频闪采样', '连续轨迹压成离散点', '高维运动降到二维'],
    'sum-two': ['几个点即周期解', '一片分形云即混沌', '数点聚散辨系统命运'],
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

function PoincareCanvas({ set, steps }: { set: string; steps: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const params = PARAM_SETS[set] || PARAM_SETS.chaotic
    const color = set === 'periodic' ? '#34d399' : '#f472b6'
    drawPoincareSection(canvas, params, steps, color)
  }, [set, steps])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-slate-900" />
    </div>
  )
}

export default function PoincareSectionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PoincareCanvas set="chaotic" steps={1500} />
  const id = scene.scene.id
  const type = scene.scene.type
  const set = (scene.lineState?.params?.set as string | undefined) ?? 'chaotic'
  const steps = (scene.lineState?.params?.steps as number | undefined) ?? 1500

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PoincareCanvas key={`${set}-${steps}`} set={set} steps={steps} />
}
