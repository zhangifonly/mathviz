/**
 * 自相关场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { makeSignal, SIGNAL_PRESETS } from '../../../../experiments/autocorrelation/autocorrelation'
import { drawAutocorrelation } from '../../../../experiments/autocorrelation/draw'

const W = 640
const H = 540
const N = 320

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '自相关', subtitle: '从噪声里揪出周期' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '自相关', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['信号与延迟副本比较', '错位相乘再求和', '衡量隔多久还像自己'],
    'sum-freq': ['周期倍数处出现峰值', '从噪声中提取基频', '语音音高检测的利器'],
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

function AutocorrCanvas({ presetKey }: { presetKey: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const preset = SIGNAL_PRESETS.find((p) => p.key === presetKey) ?? SIGNAL_PRESETS[0]
    const signal = makeSignal(N, preset.period, preset.noise, 1)
    drawAutocorrelation(canvas, signal)
  }, [presetKey])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function AutocorrelationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <AutocorrCanvas presetKey="clean" />
  const id = scene.scene.id
  const type = scene.scene.type
  const presetKey = (scene.lineState?.params?.preset as string | undefined) ?? 'clean'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <AutocorrCanvas key={presetKey} presetKey={presetKey} />
}
