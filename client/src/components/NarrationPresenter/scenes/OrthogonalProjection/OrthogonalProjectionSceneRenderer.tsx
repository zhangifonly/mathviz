/**
 * 正交投影场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLES } from '../../../../experiments/orthogonal-projection/orthogonalProjection'
import { drawOrthogonalProjection } from '../../../../experiments/orthogonal-projection/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '正交投影', subtitle: '向子空间的最近点' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '正交投影', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['proj = (v·u/u·u) u', 'v = 投影 + 残差', '两块互相垂直'],
    'sum-lsq': ['垂足是最近点', '残差与方向正交', '最小二乘的几何根基'],
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

function ProjectionCanvas({ sample, angle }: { sample: number; angle: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const s = SAMPLES[sample] ?? SAMPLES[0]
    drawOrthogonalProjection(canvas, { x: s.vx, y: s.vy }, angle)
  }, [sample, angle])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function OrthogonalProjectionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <ProjectionCanvas sample={0} angle={20} />
  const id = scene.scene.id
  const type = scene.scene.type
  const sample = (scene.lineState?.params?.sample as number | undefined) ?? 0
  const angle = (scene.lineState?.params?.angle as number | undefined) ?? 20

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <ProjectionCanvas key={`${sample}-${angle}`} sample={sample} angle={angle} />
}
