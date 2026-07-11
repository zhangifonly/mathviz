/**
 * 双摆混沌场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import {
  rk4Step,
  PRESET_OPTIONS,
  DEFAULT_PARAMS,
  type PendulumState,
} from '../../../../experiments/double-pendulum/doublePendulum'
import {
  drawDoublePendulum,
  bobScreenPos,
  type TrailPoint,
} from '../../../../experiments/double-pendulum/draw'

const DT = 0.008
const SUBSTEPS = 3
const MAX_TRAIL = 400

function presetState(id: string): PendulumState {
  const opt = PRESET_OPTIONS.find((o) => o.id === id) ?? PRESET_OPTIONS[1]
  return { ...opt.state }
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '双摆混沌', subtitle: '两根摆杆里藏着的确定性混沌' },
    'sum-end': { title: '感谢观看', subtitle: '探索非线性之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '双摆混沌', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['最简单结构演示混沌', '拉格朗日方程 + RK4 积分', '两个自由度即可失控'],
    'sum-sensitive': ['方程完全确定', '初值敏感 → 长期不可预测', '这正是非线性的魅力'],
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

function PendulumCanvas({ preset }: { preset: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let state = presetState(preset)
    const trail: TrailPoint[] = []
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.05)
      for (let i = 0; i < SUBSTEPS; i++) state = rk4Step(state, DEFAULT_PARAMS, DT)
      trail.push(bobScreenPos(canvas, state, DEFAULT_PARAMS))
      if (trail.length > MAX_TRAIL) trail.shift()
      drawDoublePendulum(canvas, { state, trail, params: DEFAULT_PARAMS }, progress)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [preset])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function DoublePendulumSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PendulumCanvas preset="chaotic" />
  const id = scene.scene.id
  const type = scene.scene.type
  const preset = (scene.lineState?.params?.preset as string | undefined) ?? 'chaotic'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PendulumCanvas key={preset} preset={preset} />
}
