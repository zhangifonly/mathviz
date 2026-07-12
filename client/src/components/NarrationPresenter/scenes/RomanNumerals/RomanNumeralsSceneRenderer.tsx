/**
 * 罗马数字场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { decompose } from '../../../../experiments/roman-numerals/romanNumerals'
import { drawRomanNumerals } from '../../../../experiments/roman-numerals/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '罗马数字', subtitle: '七个字母写出千以内的整数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '罗马数字', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-rules': ['七个基本符号 I V X L C D M', '加法：从大到小依次相加', '减法：小符号写在大符号左边'],
    'sum-range': ['同一符号最多连写三次', '覆盖 1 到 3999 的整数', '双向转换：数字 ↔ 罗马数字'],
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

function RomanCanvas({ value }: { value: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const data = decompose(value)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawRomanNumerals(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={640} height={440} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function RomanNumeralsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <RomanCanvas value={2024} />
  const id = scene.scene.id
  const type = scene.scene.type
  const value = (scene.lineState?.params?.value as number | undefined) ?? 2024

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <RomanCanvas key={value} value={value} />
}
