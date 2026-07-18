/**
 * 抛体运动场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { ANGLES } from '../../../../experiments/projectile-motion/projectileMotion'
import { drawProjectileMotion } from '../../../../experiments/projectile-motion/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '抛体运动', subtitle: '抛物线轨迹的秘密' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '抛体运动', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['水平方向匀速运动', '竖直方向匀变速', '两方向独立叠加'],
    'sum-key': ['轨迹是一条抛物线', '射程 R = v0² sin2θ / g', '45° 发射射程最远'],
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

function ProjectileCanvas({ v0 }: { v0: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawProjectileMotion(canvas, v0, ANGLES, 9.8)
  }, [v0])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function ProjectileMotionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <ProjectileCanvas v0={20} />
  const id = scene.scene.id
  const type = scene.scene.type
  const v0 = (scene.lineState?.params?.v0 as number | undefined) ?? 20

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <ProjectileCanvas key={v0} v0={v0} />
}
