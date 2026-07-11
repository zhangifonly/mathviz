/**
 * 模拟退火场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { runAnneal, ENERGY_OPTIONS } from '../../../../experiments/simulated-annealing/simulatedAnnealing'
import type { CoolingSchedule } from '../../../../experiments/simulated-annealing/simulatedAnnealing'
import { drawSimulatedAnnealing } from '../../../../experiments/simulated-annealing/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '模拟退火', subtitle: '向大自然学来的全局优化算法' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '模拟退火', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function FormulaScene() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <h2 className="text-2xl font-bold text-white/80">Metropolis 接受概率</h2>
      <div className="text-5xl md:text-6xl font-mono text-amber-300">
        P = e<sup className="text-3xl">-ΔE / T</sup>
      </div>
      <p className="text-lg text-white/60 max-w-md text-center">
        能量差 ΔE 越大、温度 T 越低，接受变坏一步的概率就越小。
      </p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'cool-metal': ['先高温自由跳动', '再缓慢冷却降温', '模仿金属退火成晶体'],
    'sum-temp': ['高温大胆探索', '低温精细收敛', '温度平衡两者'],
    'sum-badstep': ['偶尔接受变坏一步', '借此翻过山脊', '跳出局部最优'],
  }
  const list = items[sceneId] || []
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">要点</h2>
      {list.map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
    </div>
  )
}

function AnnealCanvas({ energyId, schedule }: { energyId: string; schedule: CoolingSchedule }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const opt = ENERGY_OPTIONS.find((o) => o.id === energyId) ?? ENERGY_OPTIONS[0]
    const data = runAnneal({
      energy: opt.energy,
      domain: opt.domain,
      x0: opt.x0,
      T0: 6,
      rate: schedule === 'exponential' ? 0.006 : 0.99,
      steps: 2000,
      stepSize: 1.1,
      schedule,
      seed: 20260712,
    })
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.01)
      drawSimulatedAnnealing(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [energyId, schedule])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={640} height={560} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SimulatedAnnealingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <AnnealCanvas energyId="multi-well" schedule="geometric" />
  const id = scene.scene.id
  const type = scene.scene.type
  const energyId = (scene.lineState?.params?.energyId as string | undefined) ?? 'multi-well'
  const schedule = (scene.lineState?.params?.schedule as CoolingSchedule | undefined) ?? 'geometric'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'formula') return <FormulaScene />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <AnnealCanvas key={`${energyId}-${schedule}`} energyId={energyId} schedule={schedule} />
}
