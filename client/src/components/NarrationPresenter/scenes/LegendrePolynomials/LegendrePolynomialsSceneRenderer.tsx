/**
 * 勒让德多项式场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import {
  drawLegendrePolynomials,
  drawOrthogonalityMatrix,
} from '../../../../experiments/legendre-polynomials/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '勒让德多项式', subtitle: '区间上的正交基' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '勒让德多项式', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['三项 Bonnet 递推生成', '区间 [-1,1] 上两两正交', 'P0=1, P1=x 起步'],
    'sum-apply': ['高斯-勒让德数值积分', '球谐函数的径向基', '把函数拆成正交分量'],
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

function CurveCanvas({ maxN }: { maxN: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current) drawLegendrePolynomials(ref.current, maxN)
  }, [maxN])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

function MatrixCanvas({ maxN }: { maxN: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const degs: number[] = []
    for (let i = 0; i <= maxN; i++) degs.push(i)
    if (ref.current) drawOrthogonalityMatrix(ref.current, degs)
  }, [maxN])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={480} height={480} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LegendrePolynomialsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CurveCanvas maxN={4} />
  const id = scene.scene.id
  const type = scene.scene.type
  const maxN = (scene.lineState?.params?.maxN as number | undefined) ?? 4

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  if (type === 'comparison') return <MatrixCanvas key={maxN} maxN={maxN} />
  return <CurveCanvas key={maxN} maxN={maxN} />
}
