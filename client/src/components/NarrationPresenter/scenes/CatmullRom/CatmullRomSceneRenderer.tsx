/**
 * Catmull-Rom 样条场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { CONTROL_POINTS } from '../../../../experiments/catmull-rom/catmullRom'
import { drawCatmullRom } from '../../../../experiments/catmull-rom/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'Catmull-Rom样条', subtitle: '过控制点的插值曲线' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'Catmull-Rom样条', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['相邻点估计切线', '曲线穿过每个控制点', '三次多项式平滑插值'],
    'sum-use': ['插值样条的代表', '动画路径随处可见', '插值过点·逼近不过点'],
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

function CatmullRomCanvas({ samples, compare }: { samples: number; compare: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current) drawCatmullRom(ref.current, CONTROL_POINTS, samples, compare, -1)
  }, [samples, compare])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function CatmullRomSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CatmullRomCanvas samples={16} compare={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const samples = (scene.lineState?.params?.samples as number | undefined) ?? 16
  const compare = ((scene.lineState?.params?.compare as number | undefined) ?? 0) === 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CatmullRomCanvas key={`${samples}-${compare}`} samples={samples} compare={compare} />
}
