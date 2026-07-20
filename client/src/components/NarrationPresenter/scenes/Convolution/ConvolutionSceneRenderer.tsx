/**
 * 卷积场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { KERNELS, SIGNAL } from '../../../../experiments/convolution/convolution'
import { drawConvolution } from '../../../../experiments/convolution/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '卷积', subtitle: '翻转滑动求重叠' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '卷积', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['翻转卷积核', '滑动逐点相乘', '乘积求和得输出'],
    'sum-filter': ['平滑核压制噪声', '差分核凸显边缘', '从信号到卷积网络'],
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

function ConvolutionCanvas({ kernel, step }: { kernel: string; step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const taps = (KERNELS[kernel] || KERNELS.gaussian).taps
    drawConvolution(canvas, SIGNAL, taps, step)
  }, [kernel, step])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function ConvolutionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <ConvolutionCanvas kernel="gaussian" step={-1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const kernel = (scene.lineState?.params?.kernel as string | undefined) ?? 'gaussian'
  const step = (scene.lineState?.params?.step as number | undefined) ?? -1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <ConvolutionCanvas key={kernel + ':' + step} kernel={kernel} step={step} />
}
