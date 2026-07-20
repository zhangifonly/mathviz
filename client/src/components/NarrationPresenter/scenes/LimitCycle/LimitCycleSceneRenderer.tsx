/**
 * 极限环场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawLimitCycle } from '../../../../experiments/limit-cycle/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '极限环', subtitle: '范德波尔的自持振荡' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '极限环', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-energy': ['小振幅负阻尼供能', '大振幅正阻尼耗能', '两者平衡自持振荡'],
    'sum-orbit': ['结果是孤立闭轨', '内外轨线都被吸引', '简单非线性生成节律'],
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

function LimitCycleCanvas({ mu, progress }: { mu: number; progress: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawLimitCycle(canvas, mu, progress)
  }, [mu, progress])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LimitCycleSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <LimitCycleCanvas mu={1} progress={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const mu = (scene.lineState?.params?.mu as number | undefined) ?? 1
  const progress = (scene.lineState?.params?.progress as number | undefined) ?? 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <LimitCycleCanvas key={`${mu}-${progress}`} mu={mu} progress={progress} />
}
