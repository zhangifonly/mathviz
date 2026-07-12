/**
 * 小波变换场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { generateSignal, cwt, makeScales } from '../../../../experiments/wavelet/wavelet'
import { drawWavelet } from '../../../../experiments/wavelet/draw'

const N = 256
const SCALE_COUNT = 40

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-title': { title: '小波变换', subtitle: '同时看见时间与频率' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '小波变换', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['平移小波定位时间', '伸缩小波选择频率', '突破傅里叶的时间盲区'],
    'sum-apply': ['图像压缩 JPEG2000', '信号去噪', '地震与心电分析'],
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

function WaveletCanvas({ signal, wavelet }: { signal: string; wavelet: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const sig = generateSignal(signal, N)
    const scales = makeScales(1, 48, SCALE_COUNT)
    const scaleogram = cwt(sig, scales, wavelet)
    const data = { signal: sig, scaleogram }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawWavelet(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [signal, wavelet])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={640} height={560} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function WaveletSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <WaveletCanvas signal="chirp" wavelet="mexican" />
  const id = scene.scene.id
  const type = scene.scene.type
  const signal = (scene.lineState?.params?.signal as string | undefined) ?? 'chirp'
  const wavelet = (scene.lineState?.params?.wavelet as string | undefined) ?? 'mexican'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <WaveletCanvas key={`${signal}-${wavelet}`} signal={signal} wavelet={wavelet} />
}
