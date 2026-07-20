/**
 * 复合函数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { getFunc, DEMO_XS } from '../../../../experiments/composite-function/compositeFunction'
import { drawCompositeFunction } from '../../../../experiments/composite-function/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '复合函数', subtitle: '函数的链式作用' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '复合函数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['f(g(x)) 先内层再外层', '内层 g 先作用于 x', '外层 f 二次塑形'],
    'sum-order': ['次序不可随意交换', 'f∘g 通常不等于 g∘f', '拆解组合搭建复杂关系'],
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

function CompositeCanvas({ gKey, fKey, demo }: { gKey: string; fKey: string; demo: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const demoX = demo >= 0 && demo < DEMO_XS.length ? DEMO_XS[demo] : null
    drawCompositeFunction(canvas, getFunc(fKey).fn, getFunc(gKey).fn, demoX)
  }, [gKey, fKey, demo])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function CompositeFunctionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CompositeCanvas gKey="sine" fKey="square" demo={-1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params ?? {}
  const gKey = (p.g as string | undefined) ?? 'sine'
  const fKey = (p.f as string | undefined) ?? 'square'
  const demo = (p.demo as number | undefined) ?? -1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CompositeCanvas key={`${gKey}-${fKey}-${demo}`} gKey={gKey} fKey={fKey} demo={demo} />
}
