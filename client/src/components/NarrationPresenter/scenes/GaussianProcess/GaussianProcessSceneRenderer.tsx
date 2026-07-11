/**
 * 高斯过程讲解场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { KERNEL_OPTIONS } from '../../../../experiments/gaussian-process/gaussianProcess'
import { drawGaussianProcess, type GPData } from '../../../../experiments/gaussian-process/draw'

const X_TRAIN = [-4, -2.5, -1, 0.5, 2, 3.5]
const Y_TRAIN = [-0.8, 1.2, 0.3, -1.1, 0.9, 0.1]
const DOMAIN: [number, number] = [-5, 5]

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '高斯过程', subtitle: '为函数本身赋予概率分布' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '高斯过程', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['高斯过程 = 函数上的高斯分布', '核函数编码光滑度假设', '任意有限点服从多元高斯'],
    'sum-meanvar': ['后验均值给出预测', '后验方差给出不确定性', '贝叶斯优化的核心工具'],
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

function GPCanvas({ optIndex }: { optIndex: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const data: GPData = {
      xTrain: X_TRAIN,
      yTrain: Y_TRAIN,
      opt: KERNEL_OPTIONS[optIndex] ?? KERNEL_OPTIONS[0],
      domain: DOMAIN,
    }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawGaussianProcess(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [optIndex])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={660} height={500} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function GaussianProcessSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GPCanvas optIndex={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const optIndex = (scene.lineState?.params?.optIndex as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GPCanvas key={optIndex} optIndex={optIndex} />
}
