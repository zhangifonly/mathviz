/**
 * 割线法场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { FUNCTIONS } from '../../../../experiments/secant-method/secantMethod'
import { drawSecantMethod } from '../../../../experiments/secant-method/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '割线法', subtitle: '无需导数的求根' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '割线法', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['两点割线代替切线', '无需计算导数', '割线交 x 轴得新估计'],
    'sum-conv': ['收敛阶约 1.618', '超线性收敛', '快过二分法'],
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

function SecantCanvas({ fnIdx, step }: { fnIdx: number; step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const entry = FUNCTIONS[fnIdx] ?? FUNCTIONS[0]
    drawSecantMethod(canvas, entry.fn, entry.x0, entry.x1, step)
  }, [fnIdx, step])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function SecantMethodSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SecantCanvas fnIdx={0} step={2} />
  const id = scene.scene.id
  const type = scene.scene.type
  const fnIdx = (scene.lineState?.params?.fnIdx as number | undefined) ?? 0
  const step = (scene.lineState?.params?.step as number | undefined) ?? 2

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SecantCanvas key={`${fnIdx}-${step}`} fnIdx={fnIdx} step={step} />
}
