/**
 * 二次型场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawQuadraticForm } from '../../../../experiments/quadratic-form/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '二次型', subtitle: '矩阵刻画的曲面' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '二次型', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['交叉项收进对称矩阵', 'Q = vᵀ M v', '系数排成矩阵'],
    'sum-eig': ['两个特征值定类型', '双正=碗，一正一负=鞍', '从矩阵到曲面'],
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

function QuadraticCanvas({ a, b, c }: { a: number; b: number; c: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawQuadraticForm(canvas, { a, b, c }, 2)
  }, [a, b, c])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function QuadraticFormSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <QuadraticCanvas a={2} b={0.5} c={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params
  const a = (p?.a as number | undefined) ?? 2
  const b = (p?.b as number | undefined) ?? 0.5
  const c = (p?.c as number | undefined) ?? 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <QuadraticCanvas key={`${a}-${b}-${c}`} a={a} b={b} c={c} />
}
