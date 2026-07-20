/**
 * 快速傅里叶变换场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SIGNAL_PRESETS } from '../../../../experiments/fft/fft'
import { drawFft } from '../../../../experiments/fft/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '快速傅里叶变换', subtitle: '分治的 n log n 算法' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '快速傅里叶变换', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['按奇偶下标分治', '蝶形运算合并', 'n 平方降到 n log n'],
    'sum-apply': ['音频与图像处理', '通信与频谱分析', '简单分治巨大加速'],
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

function FftCanvas({ preset, size }: { preset: number; size: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const p = SIGNAL_PRESETS[preset] ?? SIGNAL_PRESETS[0]
    drawFft(canvas, p, size)
  }, [preset, size])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function FftSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <FftCanvas preset={1} size={32} />
  const id = scene.scene.id
  const type = scene.scene.type
  const preset = (scene.lineState?.params?.preset as number | undefined) ?? 1
  const size = (scene.lineState?.params?.size as number | undefined) ?? 32

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <FftCanvas key={`${preset}-${size}`} preset={preset} size={size} />
}
