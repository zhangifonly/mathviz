/**
 * 巴恩斯利蕨场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawBarnsleyFern } from '../../../../experiments/barnsley-fern/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '巴恩斯利蕨', subtitle: '用数学画出一片蕨叶' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '巴恩斯利蕨', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['四个仿射变换', '按概率随机选取', '反复迭代成图'],
    'sum-emerge': ['简单规则', '涌现自然形态', '分形自相似之美'],
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

function FernCanvas({ count, highlight }: { count: number; highlight: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawBarnsleyFern(canvas, count, 1, highlight)
  }, [count, highlight])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function BarnsleyFernSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <FernCanvas count={50000} highlight={-1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const count = (scene.lineState?.params?.count as number | undefined) ?? 50000
  const highlight = (scene.lineState?.params?.highlight as number | undefined) ?? -1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <FernCanvas key={`${count}-${highlight}`} count={count} highlight={highlight} />
}
