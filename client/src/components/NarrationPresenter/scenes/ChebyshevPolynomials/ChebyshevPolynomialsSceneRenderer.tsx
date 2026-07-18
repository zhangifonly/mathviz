/**
 * 切比雪夫多项式场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawChebyshevPolynomials } from '../../../../experiments/chebyshev-polynomials/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '切比雪夫多项式', subtitle: '极小化最大误差' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '切比雪夫多项式', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['递推 T(n+1)=2xTn-T(n-1)', '区间内 ±1 等幅振荡', '波峰波谷顶到极值'],
    'sum-nodes': ['根 cos((2k+1)π/2n)', '两端加密的节点', '抑制龙格现象'],
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

function ChebyshevCanvas({ degree }: { degree: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawChebyshevPolynomials(canvas, degree, true)
  }, [degree])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function ChebyshevPolynomialsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <ChebyshevCanvas degree={4} />
  const id = scene.scene.id
  const type = scene.scene.type
  const degree = (scene.lineState?.params?.degree as number | undefined) ?? 4

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <ChebyshevCanvas key={degree} degree={degree} />
}
