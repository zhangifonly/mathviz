/**
 * 最小二乘法场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { makePoints } from '../../../../experiments/least-squares/leastSquares'
import { drawLeastSquares } from '../../../../experiments/least-squares/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '最小二乘法', subtitle: '寻找最优的拟合直线' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '最小二乘法', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['残差 = 竖直预测误差', '平方后求和得 RSS', '最优直线使 RSS 最小'],
    'sum-formula': ['k = cov(x,y)/var(x)', '直线穿过均值点', 'R² 越接近 1 拟合越好'],
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

function LeastSquaresCanvas({ noise, count, residuals }: { noise: number; count: number; residuals: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawLeastSquares(canvas, makePoints(count, noise, 1), residuals, true)
  }, [noise, count, residuals])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LeastSquaresSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <LeastSquaresCanvas noise={18} count={24} residuals={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const noise = (scene.lineState?.params?.noise as number | undefined) ?? 18
  const count = (scene.lineState?.params?.count as number | undefined) ?? 24
  const residuals = ((scene.lineState?.params?.residuals as number | undefined) ?? 0) > 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <LeastSquaresCanvas key={`${noise}-${count}-${residuals}`} noise={noise} count={count} residuals={residuals} />
}
