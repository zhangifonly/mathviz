/**
 * 九点圆场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { PRESET_TRIANGLES } from '../../../../experiments/nine-point-circle/ninePointCircle'
import { drawNinePointCircle, type Highlight } from '../../../../experiments/nine-point-circle/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '九点圆', subtitle: '九个特殊点共圆' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '九点圆', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['三边中点', '三高垂足', '垂心连线中点'],
    'sum-order': ['九点共处一圆', '圆心=外心垂心中点', '半径=外接圆一半'],
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

function NinePointCircleCanvas({ tri, highlight }: { tri: number; highlight: Highlight }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const t = PRESET_TRIANGLES[tri] ?? PRESET_TRIANGLES[0]
    drawNinePointCircle(canvas, t, highlight)
  }, [tri, highlight])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function NinePointCircleSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <NinePointCircleCanvas tri={0} highlight="all" />
  const id = scene.scene.id
  const type = scene.scene.type
  const tri = (scene.lineState?.params?.tri as number | undefined) ?? 0
  const highlight = (scene.lineState?.params?.highlight as Highlight | undefined) ?? 'all'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <NinePointCircleCanvas key={`${tri}-${highlight}`} tri={tri} highlight={highlight} />
}
