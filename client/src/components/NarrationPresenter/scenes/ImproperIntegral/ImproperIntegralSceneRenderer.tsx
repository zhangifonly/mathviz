/**
 * 反常积分场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { FUNCTIONS, MAX_T } from '../../../../experiments/improper-integral/improperIntegral'
import { drawImproperIntegral } from '../../../../experiments/improper-integral/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '反常积分', subtitle: '无穷区间与无界函数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '反常积分', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['面积延伸到无穷区间', '也延伸到无界函数', '核心工具是极限'],
    'sum-crit': ['极限存在即收敛', '极限不存在即发散', '无限区域可有有限面积'],
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

function IntegralCanvas({ fnKey, upper }: { fnKey: string; upper: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const info = FUNCTIONS.find((f) => f.key === fnKey) ?? FUNCTIONS[0]
    drawImproperIntegral(canvas, info.fn, upper, MAX_T)
  }, [fnKey, upper])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function ImproperIntegralSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <IntegralCanvas fnKey="inv-sq" upper={20} />
  const id = scene.scene.id
  const type = scene.scene.type
  const fnKey = (scene.lineState?.params?.fnKey as string | undefined) ?? 'inv-sq'
  const upper = (scene.lineState?.params?.upper as number | undefined) ?? 20

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <IntegralCanvas key={`${fnKey}-${upper}`} fnKey={fnKey} upper={upper} />
}
