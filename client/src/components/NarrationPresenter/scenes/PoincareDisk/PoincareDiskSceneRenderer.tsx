/**
 * 庞加莱圆盘场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { geodesic, radialGeodesics, TILINGS } from '../../../../experiments/poincare-disk/poincareDisk'
import { drawPoincareDisk } from '../../../../experiments/poincare-disk/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '庞加莱圆盘', subtitle: '有限圆盘里的无限双曲世界' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '庞加莱圆盘', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-finite': ['单位圆盘=双曲平面', '边界代表无穷远', '越近边界越显小'],
    'sum-geo': ['测地线是垂直边界的弧', '过圆心退化为直径', '平行线有无穷多条'],
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

function DiskCanvas({ ti, parallels }: { ti: number; parallels: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const extra = parallels ? radialGeodesics(6) : []
    const chord = geodesic({ x: -0.45, y: 0.2 }, { x: 0.4, y: -0.35 })
    drawPoincareDisk(canvas, TILINGS[ti], [...extra, chord], [
      { x: -0.45, y: 0.2 },
      { x: 0.4, y: -0.35 },
    ])
  }, [ti, parallels])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PoincareDiskSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DiskCanvas ti={0} parallels={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const ti = (scene.lineState?.params?.ti as number | undefined) ?? 0
  const parallels = (scene.lineState?.params?.parallels as boolean | undefined) ?? false

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <DiskCanvas key={`${ti}-${parallels}`} ti={ti} parallels={parallels} />
}
