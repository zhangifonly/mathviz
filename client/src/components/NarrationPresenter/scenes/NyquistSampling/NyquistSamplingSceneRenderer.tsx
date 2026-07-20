/**
 * 奈奎斯特采样场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawNyquistSampling } from '../../../../experiments/nyquist-sampling/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '奈奎斯特采样', subtitle: '采样定理与信号重建' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '奈奎斯特采样', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['采样率超过两倍最高频', '一周期取两点以上', '采样无损'],
    'sum-sinc': ['每点叠加一个 sinc 波', '离散点连成连续信号', '数字还原真实声音'],
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

function NyquistCanvas({ freq, fs }: { freq: number; fs: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawNyquistSampling(canvas, freq, fs)
  }, [freq, fs])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function NyquistSamplingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <NyquistCanvas freq={2} fs={10} />
  const id = scene.scene.id
  const type = scene.scene.type
  const freq = (scene.lineState?.params?.freq as number | undefined) ?? 2
  const fs = (scene.lineState?.params?.fs as number | undefined) ?? 10

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <NyquistCanvas key={`${freq}-${fs}`} freq={freq} fs={fs} />
}
