/**
 * 神经网络前向传播场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { NETWORK, INPUT_PRESETS } from '../../../../experiments/neural-network-forward/neuralNetworkForward'
import { drawNeuralNetworkForward } from '../../../../experiments/neural-network-forward/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '神经网络前向传播', subtitle: '信号层层流动' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '神经网络前向传播', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-neuron': ['输入乘权重求和', '再加偏置得加权和', '过激活函数成输出'],
    'sum-forward': ['一层输出喂下一层', '信号从左向右传播', '简单规则堆出智能'],
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

function NetworkCanvas({ preset }: { preset: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const input = INPUT_PRESETS[preset] ?? INPUT_PRESETS[0]
    drawNeuralNetworkForward(canvas, input, NETWORK)
  }, [preset])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function NeuralNetworkForwardSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <NetworkCanvas preset={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const preset = (scene.lineState?.params?.preset as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <NetworkCanvas key={preset} preset={preset} />
}
