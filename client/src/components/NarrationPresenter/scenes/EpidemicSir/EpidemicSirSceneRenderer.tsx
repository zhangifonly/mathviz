/**
 * SIR 传染病模型场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { simulateSIR, computeR0 } from '../../../../experiments/epidemic-sir/epidemicSir'
import { drawEpidemicSir } from '../../../../experiments/epidemic-sir/draw'

const DAYS = 160
const DT = 0.5
const I0 = 0.001

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-hook': { title: 'SIR 传染病模型', subtitle: '用三条曲线看懂疫情的兴衰' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'SIR 传染病模型', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['人群分为 S / I / R 三类', '传染率与康复率两条速率', '感染者呈钟形曲线'],
    'sum-r0': ['R0 = 传染率 / 康复率', 'R0 > 1 爆发，< 1 消退', '压低传染率即压低 R0'],
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

function SirCanvas({ beta, gamma }: { beta: number; gamma: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const series = simulateSIR({ beta, gamma, i0: I0, days: DAYS, dt: DT })
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawEpidemicSir(canvas, series, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [beta, gamma])
  const r0 = computeR0(beta, gamma)
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={640} height={480} className="max-w-full max-h-full rounded-lg" />
      <div className="text-white/80 text-lg">
        R0 = <span className="font-bold text-amber-400">{r0.toFixed(2)}</span>
        {r0 > 1 ? '（疫情爆发）' : '（疫情消退）'}
      </div>
    </div>
  )
}

export default function EpidemicSirSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SirCanvas beta={0.6} gamma={0.1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const beta = (scene.lineState?.params?.beta as number | undefined) ?? 0.6
  const gamma = (scene.lineState?.params?.gamma as number | undefined) ?? 0.1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SirCanvas key={`${beta}-${gamma}`} beta={beta} gamma={gamma} />
}
