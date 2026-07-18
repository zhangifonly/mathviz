/**
 * 外观数列场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TERMS } from '../../../../experiments/look-and-say/lookAndSay'
import { drawLookAndSay } from '../../../../experiments/look-and-say/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '外观数列', subtitle: '读出上一项的数列' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '外观数列', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-rule': ['规则=读出上一项', '几个几连读', '1 到 11 到 21 到 1211'],
    'sum-law': ['从 1 起只含 1、2、3', '项长按固定倍数增长', '长度比趋于康威常数 1.303'],
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

function LookAndSayCanvas({ shown }: { shown: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawLookAndSay(canvas, TERMS, Math.min(shown, TERMS))
  }, [shown])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LookAndSaySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <LookAndSayCanvas shown={TERMS} />
  const id = scene.scene.id
  const type = scene.scene.type
  const shown = (scene.lineState?.params?.shown as number | undefined) ?? TERMS

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <LookAndSayCanvas key={shown} shown={shown} />
}
