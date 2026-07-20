/**
 * 黎曼和场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { FUNCTIONS, type RiemannMode } from '../../../../experiments/riemann-sum/riemannSum'
import { drawRiemannSum } from '../../../../experiments/riemann-sum/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '黎曼和', subtitle: '矩形逼近曲线下面积' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '黎曼和', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['矩形逼近弯曲面积', '同宽·取样定高', '面积相加得黎曼和'],
    'sum-precise': ['分段越多越精确', '左和低估右和高估', 'n→∞ 极限即定积分'],
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

function RiemannCanvas({ n, mode }: { n: number; mode: RiemannMode }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawRiemannSum(canvas, FUNCTIONS[0], n, mode)
  }, [n, mode])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function RiemannSumSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <RiemannCanvas n={8} mode="mid" />
  const id = scene.scene.id
  const type = scene.scene.type
  const n = (scene.lineState?.params?.n as number | undefined) ?? 8
  const mode = (scene.lineState?.params?.mode as RiemannMode | undefined) ?? 'mid'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <RiemannCanvas key={`${n}-${mode}`} n={n} mode={mode} />
}
