/**
 * 等差等比数列场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import {
  arithmeticSequence,
  geometricSequence,
  SEQUENCE_OPTIONS,
} from '../../../../experiments/sequences/sequences'
import { drawSequences } from '../../../../experiments/sequences/draw'

const TERMS = 8

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '等差等比数列', subtitle: '藏在数字排队里的两种节奏' },
    'end-bye': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '等差等比数列', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'end-recap': ['等差靠相加 · 公差定步伐', '等比靠相乘 · 公比定节奏'],
    'end-formula': ['等差通项 a_n = a1+(n-1)d', '等比通项 a_n = a1·r^(n-1)', '两式即可求任意项与总和'],
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

function SequenceCanvas({ optionIndex }: { optionIndex: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const opt = SEQUENCE_OPTIONS[optionIndex] ?? SEQUENCE_OPTIONS[0]
    const seq =
      opt.kind === 'arithmetic'
        ? arithmeticSequence(opt.a1, opt.step, TERMS)
        : geometricSequence(opt.a1, opt.step, TERMS)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawSequences(canvas, seq, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [optionIndex])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={420} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SequencesSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SequenceCanvas optionIndex={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const optionIndex = (scene.lineState?.params?.optionIndex as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SequenceCanvas key={optionIndex} optionIndex={optionIndex} />
}
