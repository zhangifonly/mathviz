/**
 * 高斯混合模型场景渲染器
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { makeData, fitEM } from '../../../../experiments/gaussian-mixture/gaussianMixture'
import { drawGaussianMixture } from '../../../../experiments/gaussian-mixture/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '高斯混合模型', subtitle: 'EM 算法分离簇' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '高斯混合模型', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['数据由多个高斯混合', '各分量有 μ σ 与权重', '加权和拟合整体'],
    'sum-em': ['E 步计算责任度', 'M 步更新参数', '似然单调收敛到簇'],
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

function GmmCanvas({ step }: { step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const data = useMemo(() => makeData(600, 42), [])
  const history = useMemo(() => fitEM(data, 3), [data])
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const s = Math.min(step, history.length - 1)
    drawGaussianMixture(canvas, data, history[s])
  }, [data, history, step])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function GaussianMixtureSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GmmCanvas step={12} />
  const id = scene.scene.id
  const type = scene.scene.type
  const step = (scene.lineState?.params?.step as number | undefined) ?? 12

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GmmCanvas key={step} step={step} />
}
