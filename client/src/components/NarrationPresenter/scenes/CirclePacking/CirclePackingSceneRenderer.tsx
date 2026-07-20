/**
 * 圆填充场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { type PackMode } from '../../../../experiments/circle-packing/circlePacking'
import { drawCirclePacking } from '../../../../experiments/circle-packing/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '圆填充', subtitle: '最密堆积的艺术' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '圆填充', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['密度=圆面积/区域面积', '衡量填满空间的效率', '总有缝隙无法填满'],
    'sum-best': ['六边形最密约 90.7%', '方形约 78.5%', '随机堆积密度最低'],
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

function PackingCanvas({ mode }: { mode: PackMode }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawCirclePacking(canvas, mode, 26, 1)
  }, [mode])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function CirclePackingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PackingCanvas mode="hex" />
  const id = scene.scene.id
  const type = scene.scene.type
  const mode = (scene.lineState?.params?.mode as PackMode | undefined) ?? 'hex'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PackingCanvas key={mode} mode={mode} />
}
