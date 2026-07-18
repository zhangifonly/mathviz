/**
 * 环面与克莱因瓶 场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawTorusKlein } from '../../../../experiments/torus-klein/draw'
import type { Surface } from '../../../../experiments/torus-klein/torusKlein'
import { isOrientable } from '../../../../experiments/torus-klein/torusKlein'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '环面与克莱因瓶', subtitle: '边的粘合造出曲面' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '环面与克莱因瓶', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['同一张正方形', '粘法不同结果不同', '环面与克莱因瓶'],
    'sum-orient': ['环面可定向有里外', '克莱因瓶不可定向', '拓扑学的迷人之处'],
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

function TorusKleinCanvas({ surface }: { surface: Surface }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawTorusKlein(canvas, surface, 0.7, 0.5)
  }, [surface])
  const label = surface === 'torus' ? '环面 · 可定向' : '克莱因瓶 · 不可定向'
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
      <div className="text-white/70 text-lg">{label} {isOrientable(surface) ? '↺' : '⊘'}</div>
    </div>
  )
}

export default function TorusKleinSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TorusKleinCanvas surface="torus" />
  const id = scene.scene.id
  const type = scene.scene.type
  const surface = ((scene.lineState?.params?.surface as Surface | undefined) ?? 'torus')

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TorusKleinCanvas key={surface} surface={surface} />
}
