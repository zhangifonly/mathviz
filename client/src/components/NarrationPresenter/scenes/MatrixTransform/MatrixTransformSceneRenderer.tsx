/**
 * 矩阵变换场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TRANSFORM_OPTIONS } from '../../../../experiments/matrix-transform/matrixTransform'
import { drawMatrixTransform } from '../../../../experiments/matrix-transform/draw'

function resolveMatrix(optionId: string) {
  return (TRANSFORM_OPTIONS.find((o) => o.id === optionId) ?? TRANSFORM_OPTIONS[0]).matrix
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '矩阵变换', subtitle: '看 2×2 矩阵如何掰弯平面' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '矩阵变换', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-columns': ['矩阵就是线性变换', '两列 = 基向量的落点', '网格保持平行等距'],
    'sum-det': ['行列式 = 面积缩放倍数', '负号代表方向翻转', '行列式为 0 则不可逆'],
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

function MatrixCanvas({ optionId }: { optionId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const matrix = resolveMatrix(optionId)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawMatrixTransform(canvas, { matrix }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [optionId])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function MatrixTransformSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <MatrixCanvas optionId="rotate" />
  const id = scene.scene.id
  const type = scene.scene.type
  const optionId = (scene.lineState?.params?.optionId as string | undefined) ?? 'rotate'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <MatrixCanvas key={optionId} optionId={optionId} />
}
