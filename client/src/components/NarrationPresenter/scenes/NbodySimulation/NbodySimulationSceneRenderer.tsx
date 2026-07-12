/**
 * N 体引力仿真场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { PRESET_OPTIONS, step, type Body } from '../../../../experiments/nbody-simulation/nbodySimulation'
import { drawNbodySimulation, type NbodyDrawData } from '../../../../experiments/nbody-simulation/draw'

const TRAIL_LEN = 400

function viewRadiusOf(bodies: Body[]): number {
  let r = 0.5
  for (const b of bodies) r = Math.max(r, Math.abs(b.x), Math.abs(b.y))
  return r * 1.3
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-sky': { title: 'N 体引力仿真', subtitle: '从两体的优雅到三体的混沌' },
    'sum-end': { title: '感谢观看', subtitle: '探索引力之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'N 体引力仿真', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['同一条万有引力定律', '两体可解，轨道优雅', '三体混沌，长期难测'],
    'sum-conserve': ['能量与动量守恒', 'Verlet 积分长期稳定', '守恒律检验仿真可信度'],
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

function NbodyCanvas({ presetId }: { presetId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const preset = PRESET_OPTIONS.find((p) => p.id === presetId) ?? PRESET_OPTIONS[0]
    let bodies = preset.bodies.map((b) => ({ ...b }))
    const params = { G: preset.G, softening: preset.softening, dt: preset.dt }
    const trails: { x: number; y: number }[][] = bodies.map((b) => [{ x: b.x, y: b.y }])
    const viewRadius = viewRadiusOf(bodies)
    let raf = 0
    const tick = () => {
      for (let s = 0; s < 4; s++) bodies = step(bodies, params)
      bodies.forEach((b, i) => {
        trails[i].push({ x: b.x, y: b.y })
        if (trails[i].length > TRAIL_LEN) trails[i].shift()
      })
      const data: NbodyDrawData = { trails, bodies, viewRadius }
      drawNbodySimulation(canvas, data, 1)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [presetId])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function NbodySimulationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <NbodyCanvas presetId="binary" />
  const id = scene.scene.id
  const type = scene.scene.type
  const presetId = (scene.lineState?.params?.preset as string | undefined) ?? 'binary'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <NbodyCanvas key={presetId} presetId={presetId} />
}
