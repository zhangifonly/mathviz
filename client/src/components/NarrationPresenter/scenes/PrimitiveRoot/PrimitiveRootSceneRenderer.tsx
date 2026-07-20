/**
 * 原根场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawPrimitiveRoot } from '../../../../experiments/primitive-root/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '原根', subtitle: '模 p 的生成元' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '原根', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['乘法循环群的生成元', '幂遍历全部非零余数', '一个 g 生成整个群'],
    'sum-link': ['连接费马小定理', '离散对数难以反算', '现代密码学的基石'],
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

function PrimitiveRootCanvas({ g, p }: { g: number; p: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawPrimitiveRoot(canvas, g, p)
  }, [g, p])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PrimitiveRootSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PrimitiveRootCanvas g={3} p={7} />
  const id = scene.scene.id
  const type = scene.scene.type
  const g = (scene.lineState?.params?.g as number | undefined) ?? 3
  const p = (scene.lineState?.params?.p as number | undefined) ?? 7

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PrimitiveRootCanvas key={`${g}-${p}`} g={g} p={p} />
}
