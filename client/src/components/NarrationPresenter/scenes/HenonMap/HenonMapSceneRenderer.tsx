/**
 * 埃农映射场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawHenonMap } from '../../../../experiments/henon-map/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '埃农映射', subtitle: '二维混沌吸引子' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '埃农映射', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ["x'=1-a·x²+y", "y'=b·x", '简单公式反复迭代'],
    'sum-fractal': ['轨道收敛到吸引子', '自相似分形结构', '简单孕育复杂混沌'],
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

function HenonCanvas({ a, b }: { a: number; b: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawHenonMap(canvas, a, b, 20000)
  }, [a, b])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-slate-900" />
    </div>
  )
}

export default function HenonMapSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <HenonCanvas a={1.4} b={0.3} />
  const id = scene.scene.id
  const type = scene.scene.type
  const a = (scene.lineState?.params?.a as number | undefined) ?? 1.4
  const b = (scene.lineState?.params?.b as number | undefined) ?? 0.3

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <HenonCanvas key={`${a}-${b}`} a={a} b={b} />
}
