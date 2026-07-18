/**
 * 克拉默法则场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_SYSTEMS } from '../../../../experiments/cramers-rule/cramersRule'
import { drawCramersRule } from '../../../../experiments/cramers-rule/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '克拉默法则', subtitle: '行列式之比解方程' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '克拉默法则', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['系数行列式 det A 作分母', '替换列的行列式作分子', 'x_i = det A_i / det A'],
    'sum-geo': ['行列式即平行四边形面积', '解是两块面积的比值', 'det A = 0 时无唯一解'],
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

function CramersCanvas({ sys }: { sys: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const s = SAMPLE_SYSTEMS[sys % SAMPLE_SYSTEMS.length]
    drawCramersRule(canvas, s.A, s.b, 40)
  }, [sys])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function CramersRuleSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CramersCanvas sys={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const sys = (scene.lineState?.params?.sys as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CramersCanvas key={sys} sys={sys} />
}
