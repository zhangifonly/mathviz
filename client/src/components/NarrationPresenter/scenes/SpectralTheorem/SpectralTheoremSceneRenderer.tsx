/**
 * 谱分解场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_MATRICES } from '../../../../experiments/spectral-theorem/spectralTheorem'
import { drawSpectralTheorem } from '../../../../experiments/spectral-theorem/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '谱分解', subtitle: '对称矩阵的正交对角化' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '谱分解', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['特征值全为实数', '特征向量互相正交', '可选标准正交基'],
    'sum-geo': ['M = Σ λ v vᵀ', '单位圆变椭圆', '主轴即特征向量'],
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

function SpectralCanvas({ mat }: { mat: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const matrix = SAMPLE_MATRICES[mat % SAMPLE_MATRICES.length].matrix
    drawSpectralTheorem(canvas, matrix, true)
  }, [mat])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function SpectralTheoremSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SpectralCanvas mat={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const mat = (scene.lineState?.params?.mat as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SpectralCanvas key={mat} mat={mat} />
}
