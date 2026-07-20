/**
 * 对数螺线场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawLogarithmSpiral } from '../../../../experiments/logarithm-spiral/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '对数螺线', subtitle: '自相似的等角螺线' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '对数螺线', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['r = a·e^(b·θ)', '半径随角度指数增长', 'a 定起点 b 定松紧'],
    'sum-props': ['切线与径向定角不变', '每圈放大 e^(2πb) 倍', '处处自相似'],
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

function SpiralCanvas({ b, compare }: { b: number; compare: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawLogarithmSpiral(canvas, 6, b, 4, compare)
  }, [b, compare])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LogarithmSpiralSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SpiralCanvas b={0.2} compare={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const b = (scene.lineState?.params?.b as number | undefined) ?? 0.2
  const compare = ((scene.lineState?.params?.compare as number | undefined) ?? 0) === 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SpiralCanvas key={`${b}-${compare}`} b={b} compare={compare} />
}
