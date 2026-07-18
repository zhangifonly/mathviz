/**
 * 鸽巢原理场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawPigeonhole } from '../../../../experiments/pigeonhole/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '鸽巢原理', subtitle: '抽屉里藏着的必然' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '鸽巢原理', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['物品多于抽屉', '必有抽屉不止一个', '至少 ⌈n/m⌉ 个'],
    'sum-nec': ['简单计数即证明', '碰撞无从躲避', '数学的必然性'],
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

function PigeonholeCanvas({ items, holes, seed }: { items: number; holes: number; seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawPigeonhole(canvas, items, holes, seed)
  }, [items, holes, seed])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PigeonholeSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PigeonholeCanvas items={13} holes={12} seed={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const items = (scene.lineState?.params?.items as number | undefined) ?? 13
  const holes = (scene.lineState?.params?.holes as number | undefined) ?? 12

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PigeonholeCanvas key={`${items}-${holes}`} items={items} holes={holes} seed={1} />
}
