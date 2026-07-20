/**
 * 卢卡斯数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawLucasNumbers } from '../../../../experiments/lucas-numbers/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '卢卡斯数', subtitle: '斐波那契的孪生数列' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '卢卡斯数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['同用加法递推', '起点 2 和 1', '与斐波那契同宗同源'],
    'sum-link': ['相邻比趋于黄金比', 'Ln = Fn-1 + Fn+1', '简单规则,一样的美'],
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

function LucasCanvas({ terms, showFib }: { terms: number; showFib: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawLucasNumbers(canvas, terms, showFib)
  }, [terms, showFib])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LucasNumbersSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <LucasCanvas terms={12} showFib={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const terms = (scene.lineState?.params?.terms as number | undefined) ?? 12
  const showFib = (scene.lineState?.params?.showFib as boolean | undefined) ?? false

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <LucasCanvas key={`${terms}-${showFib}`} terms={terms} showFib={showFib} />
}
