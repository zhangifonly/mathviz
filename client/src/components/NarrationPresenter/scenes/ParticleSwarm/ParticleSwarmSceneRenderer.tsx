/**
 * 粒子群优化场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { makeSwarm, step, SWARM_SIZE } from '../../../../experiments/particle-swarm/particleSwarm'
import { drawParticleSwarm } from '../../../../experiments/particle-swarm/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '粒子群优化', subtitle: '群体智能寻优' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '粒子群优化', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['一群粒子协作寻优', '逼近目标函数最小值', '简单规则涌现智能'],
    'sum-force': ['惯性保持方向', '认知飞向个体最优', '社会飞向全局最优'],
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

function SwarmCanvas({ iter }: { iter: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let s = makeSwarm(SWARM_SIZE, 1)
    for (let i = 0; i < iter; i++) s = step(s, i + 1)
    drawParticleSwarm(canvas, s, 4)
  }, [iter])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-slate-900" />
    </div>
  )
}

export default function ParticleSwarmSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SwarmCanvas iter={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const iter = (scene.lineState?.params?.iter as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SwarmCanvas key={iter} iter={iter} />
}
