/**
 * 容斥原理场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLES } from '../../../../experiments/inclusion-exclusion/inclusionExclusion'
import { drawInclusionExclusion } from '../../../../experiments/inclusion-exclusion/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '容斥原理', subtitle: '交替加减算并集' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '容斥原理', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['直接相加会重复计数', '容斥用加减交替修正', '并集精确无遗漏'],
    'sum-general': ['奇数交集取正号', '偶数交集取负号', '推广到任意多集合'],
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

function VennCanvas({ idx }: { idx: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawInclusionExclusion(canvas, SAMPLES[idx] ?? SAMPLES[0])
  }, [idx])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function InclusionExclusionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <VennCanvas idx={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const idx = (scene.lineState?.params?.idx as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <VennCanvas key={idx} idx={idx} />
}
