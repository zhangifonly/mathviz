/**
 * 中值定理场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { FUNCTIONS, INTERVALS } from '../../../../experiments/mean-value-theorem/meanValueTheorem'
import { drawMeanValueTheorem } from '../../../../experiments/mean-value-theorem/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '中值定理', subtitle: '切线平行于割线' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '中值定理', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['平均变化率=割线斜率', '必有 c 使瞬时追平平均', 'f\'(c)=(f(b)-f(a))/(b-a)'],
    'sum-geo': ['切线平行于割线', '罗尔定理是水平特例', '数值法可求出中值点 c'],
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

function MvtCanvas({ fnIdx, ivIdx }: { fnIdx: number; ivIdx: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const { f } = FUNCTIONS[fnIdx] ?? FUNCTIONS[0]
    const { a, b } = INTERVALS[ivIdx] ?? INTERVALS[0]
    drawMeanValueTheorem(canvas, f, a, b)
  }, [fnIdx, ivIdx])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function MeanValueTheoremSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <MvtCanvas fnIdx={0} ivIdx={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const fnIdx = (scene.lineState?.params?.fnIdx as number | undefined) ?? 0
  const ivIdx = (scene.lineState?.params?.ivIdx as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <MvtCanvas key={`${fnIdx}-${ivIdx}`} fnIdx={fnIdx} ivIdx={ivIdx} />
}
