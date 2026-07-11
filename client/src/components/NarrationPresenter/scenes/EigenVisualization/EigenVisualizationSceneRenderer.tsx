/**
 * 特征值与特征向量讲解场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { MATRIX_OPTIONS, type Matrix2 } from '../../../../experiments/eigen-visualization/eigenVisualization'
import { drawEigenVisualization } from '../../../../experiments/eigen-visualization/draw'

function matrixOf(optId: string): Matrix2 {
  return (MATRIX_OPTIONS.find((o) => o.id === optId) ?? MATRIX_OPTIONS[0]).matrix
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '特征值与特征向量', subtitle: '变换下方向不变的特殊向量' },
    'sum-end': { title: '感谢观看', subtitle: '看清线性变换的灵魂' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '特征值与特征向量', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function FormulaScene({ sceneId }: { sceneId: string }) {
  const formulas: Record<string, { main: string; note: string }> = {
    'eig-formula': { main: 'A · v = λ · v', note: '矩阵乘特征向量 = 特征值乘特征向量' },
    'solve-eq': { main: 'λ² − tr(A)·λ + det(A) = 0', note: '二阶矩阵特征方程' },
  }
  const { main, note } = formulas[sceneId] || { main: 'A · v = λ · v', note: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-4xl md:text-5xl font-mono text-amber-300">{main}</div>
      <p className="text-lg text-white/70">{note}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['特征向量：方向不变', '特征值：缩放倍数', 'A v = λ v'],
    'sum-apply': ['主成分分析 PCA', '结构振动模态', '量子力学能级'],
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

function EigenCanvas({ optId }: { optId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const matrix = matrixOf(optId)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawEigenVisualization(canvas, matrix, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [optId])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function EigenVisualizationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <EigenCanvas optId="stretch" />
  const id = scene.scene.id
  const type = scene.scene.type
  const optId = (scene.lineState?.params?.optId as string | undefined) ?? 'stretch'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'formula') return <FormulaScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <EigenCanvas key={optId} optId={optId} />
}
