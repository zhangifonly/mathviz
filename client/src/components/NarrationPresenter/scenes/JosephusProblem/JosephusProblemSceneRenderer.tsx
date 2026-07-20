/**
 * 约瑟夫问题场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawJosephusProblem } from '../../../../experiments/josephus-problem/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '约瑟夫问题', subtitle: '循环报数出局的生死游戏' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '约瑟夫问题', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['n 人围圈报数', '每数到 k 出局', '循环到剩一人'],
    'sum-formula': ['J(1,k)=0 起递推', 'J(n,k)=(J(n-1,k)+k)%n', '几步预言幸存者'],
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

function JosephusCanvas({ n, k, step }: { n: number; k: number; step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (canvas) drawJosephusProblem(canvas, n, k, step)
  }, [n, k, step])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function JosephusProblemSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <JosephusCanvas n={7} k={3} step={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params ?? {}
  const n = (p.n as number | undefined) ?? 7
  const k = (p.k as number | undefined) ?? 3
  const step = (p.step as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <JosephusCanvas key={`${n}-${k}-${step}`} n={n} k={k} step={step} />
}
