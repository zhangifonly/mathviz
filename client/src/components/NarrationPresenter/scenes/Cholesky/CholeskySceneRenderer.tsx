/**
 * Cholesky 分解场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_MATRICES } from '../../../../experiments/cholesky/cholesky'
import { drawCholesky } from '../../../../experiments/cholesky/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'Cholesky 分解', subtitle: '对称正定 = 下三角乘转置' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'Cholesky 分解', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['对称正定矩阵专属', '分解为 L 乘 L 转置', 'L 是对角为正的下三角'],
    'sum-use': ['计算量约为 LU 一半', '数值稳定', '用于解方程组与随机采样'],
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

function CholeskyCanvas({ matrix, step }: { matrix: number; step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawCholesky(canvas, SAMPLE_MATRICES[matrix] ?? SAMPLE_MATRICES[0], step)
  }, [matrix, step])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function CholeskySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CholeskyCanvas matrix={0} step={99} />
  const id = scene.scene.id
  const type = scene.scene.type
  const matrix = (scene.lineState?.params?.matrix as number | undefined) ?? 0
  const step = (scene.lineState?.params?.step as number | undefined) ?? 99

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CholeskyCanvas key={`${matrix}-${step}`} matrix={matrix} step={step} />
}
