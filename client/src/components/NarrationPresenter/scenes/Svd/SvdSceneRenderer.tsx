/**
 * 奇异值分解场景渲染器
 * 复用实验内核与 Canvas 绘制，按讲解行切换预设矩阵与画面类型。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawSvd } from '../../../../experiments/svd/draw'
import { MATRIX_OPTIONS, type Mat2 } from '../../../../experiments/svd/svd'

function matrixById(id: string): Mat2 {
  return (MATRIX_OPTIONS.find((o) => o.id === id) ?? MATRIX_OPTIONS[2]).matrix
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '奇异值分解', subtitle: '任意矩阵都是旋转、拉伸、再旋转' },
    'sum-3': { title: '感谢观看', subtitle: '压缩与降维背后的数学' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '奇异值分解', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function FormulaScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, { formula: string; desc: string }> = {
    'dec-1': { formula: 'A = U Σ Vᵀ', desc: '任意矩阵都能这样三步分解' },
    'dec-2': { formula: 'Vᵀ : 旋转', desc: '先把主轴对齐到坐标轴' },
    'dec-3': { formula: 'Σ : 沿轴拉伸 → U : 旋转', desc: '再拉伸, 最后转到应有朝向' },
    'rank-2': { formula: 'A₁ = σ₁ u₁ v₁ᵀ', desc: '保留最大奇异值即最佳秩一逼近' },
  }
  const { formula, desc } = items[sceneId] || items['dec-1']
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="px-10 py-8 bg-white/10 rounded-2xl backdrop-blur">
        <span className="text-3xl md:text-4xl font-semibold text-white tracking-wide">{formula}</span>
      </div>
      <p className="text-white/70 text-lg">{desc}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-1': ['矩阵 = 旋转 + 拉伸 + 旋转', 'A = U Σ Vᵀ', '再复杂也拆成三步'],
    'sum-2': ['奇异值 = 椭圆半轴', 'σ1 是最大伸缩尺度', 'σ 恒为非负'],
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

function SvdCanvas({ matrix }: { matrix: Mat2 }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawSvd(canvas, matrix, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [matrix])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SvdSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SvdCanvas matrix={matrixById('rotate-scale')} />
  const id = scene.scene.id
  const type = scene.scene.type
  const matrixId = (scene.lineState?.params?.matrixId as string | undefined) ?? 'rotate-scale'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  if (type === 'formula') return <FormulaScene sceneId={id} />
  return <SvdCanvas key={matrixId} matrix={matrixById(matrixId)} />
}
