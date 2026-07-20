/**
 * 皮克定理场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { PRESET_POLYGONS } from '../../../../experiments/pick-theorem/pickTheorem'
import { drawPickTheorem } from '../../../../experiments/pick-theorem/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '皮克定理', subtitle: '数格点求出多边形面积' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '皮克定理', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['格点分内部点与边界点', '内部点 I 与边界点 B', '数格点即可求面积'],
    'sum-apply': ['面积 A = I + B/2 - 1', '鞋带公式核对无误', '简单规则见几何之美'],
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

function PickCanvas({ idx }: { idx: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const poly = PRESET_POLYGONS[idx % PRESET_POLYGONS.length].vertices
    drawPickTheorem(canvas, poly)
  }, [idx])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PickTheoremSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PickCanvas idx={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const idx = (scene.lineState?.params?.idx as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PickCanvas key={idx} idx={idx} />
}
