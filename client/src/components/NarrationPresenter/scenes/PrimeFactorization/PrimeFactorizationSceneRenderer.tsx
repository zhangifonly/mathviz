/**
 * 质因数分解场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawPrimeFactorization } from '../../../../experiments/prime-factorization/draw'
import { formatFactorization } from '../../../../experiments/prime-factorization/primeFactorization'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '质因数分解', subtitle: '算术基本定理' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '质因数分解', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['整数拆成质数乘积', '质数是基本积木', '用分解树逐层拆解'],
    'sum-unique': ['分解结果唯一确定', '与拆解顺序无关', '数论的重要基石'],
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

function TreeCanvas({ n }: { n: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawPrimeFactorization(canvas, n)
  }, [n])
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
      <p className="text-lg text-white/80">{n} = {formatFactorization(n)}</p>
    </div>
  )
}

export default function PrimeFactorizationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TreeCanvas n={60} />
  const id = scene.scene.id
  const type = scene.scene.type
  const n = (scene.lineState?.params?.n as number | undefined) ?? 60

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TreeCanvas key={n} n={n} />
}
