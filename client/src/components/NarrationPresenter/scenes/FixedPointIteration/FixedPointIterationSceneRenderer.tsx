/**
 * 不动点迭代场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { findFunc } from '../../../../experiments/fixed-point-iteration/fixedPointIteration'
import { drawFixedPointIteration } from '../../../../experiments/fixed-point-iteration/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '不动点迭代', subtitle: '蛛网图与收敛' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '不动点迭代', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['反复代入 x→g(x)', '极限满足 g(x)=x', '不动点是曲线与对角线交点'],
    'sum-cond': ['蛛网图一竖一横', "收敛条件 |g'(x*)|<1", '斜率太陡则发散'],
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

function CobwebCanvas({ funcKey, steps }: { funcKey: string; steps: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const fn = findFunc(funcKey)
    const domain: [number, number] = funcKey === 'cos' ? [-0.5, 2] : [-0.5, 5.5]
    drawFixedPointIteration(canvas, fn, steps, domain)
  }, [funcKey, steps])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function FixedPointIterationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CobwebCanvas funcKey="cos" steps={6} />
  const id = scene.scene.id
  const type = scene.scene.type
  const funcKey = (scene.lineState?.params?.func as string | undefined) ?? 'cos'
  const steps = (scene.lineState?.params?.steps as number | undefined) ?? 6

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CobwebCanvas key={`${funcKey}-${steps}`} funcKey={funcKey} steps={steps} />
}
