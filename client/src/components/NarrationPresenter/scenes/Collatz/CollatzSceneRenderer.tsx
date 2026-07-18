/**
 * 考拉兹猜想场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { START_VALUES } from '../../../../experiments/collatz/collatz'
import { drawCollatz } from '../../../../experiments/collatz/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '考拉兹猜想', subtitle: '3n+1 的未解之谜' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '考拉兹猜想', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-rule': ['偶数除以 2', '奇数乘 3 加 1', '规则简单到极点'],
    'sum-open': ['轨迹像冰雹般难测', '海量验证都归 1', '是否总归 1 仍是悬案'],
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

function CollatzCanvas({ starts }: { starts: number[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawCollatz(canvas, starts)
  }, [starts])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function CollatzSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CollatzCanvas starts={[27]} />
  const id = scene.scene.id
  const type = scene.scene.type
  const params = scene.lineState?.params
  const overlay = params?.overlay as boolean | undefined
  const start = (params?.start as number | undefined) ?? 27
  const starts = overlay ? START_VALUES : [start]

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CollatzCanvas key={overlay ? 'overlay' : start} starts={starts} />
}
