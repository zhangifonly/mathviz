/**
 * 反向传播场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { NETWORK, LEARNING_RATE, XOR_SAMPLES, trainStep, type Network, type Grads } from '../../../../experiments/backpropagation/backpropagation'
import { drawBackpropagation } from '../../../../experiments/backpropagation/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '反向传播', subtitle: '链式法则求梯度' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '反向传播', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-fwd': ['前向传播算出预测', '损失衡量与目标的差距', '目标是让损失最小'],
    'sum-back': ['链式法则反向求梯度', '沿负梯度更新权重', '循环往复即深度学习'],
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

/** 按阶段预训练网络：train 阶段多跑几轮以呈现下降的损失曲线 */
function simulate(phase: string) {
  let net: Network = NETWORK
  const losses: number[] = []
  const rounds = phase === 'train' ? 120 : phase === 'backward' ? 8 : 0
  let grads: Grads | null = null
  for (let k = 0; k < rounds; k++) {
    const s = XOR_SAMPLES[k % XOR_SAMPLES.length]
    const r = trainStep(net, s.input, s.target, LEARNING_RATE)
    net = r.next; grads = r.grads; losses.push(r.loss)
  }
  const sample = XOR_SAMPLES[1]
  const showGrad = phase === 'backward' || phase === 'train'
  if (!showGrad) grads = null
  else if (rounds === 0) grads = trainStep(net, sample.input, sample.target, 0).grads
  return { net, grads, losses, sample }
}

function BackpropCanvas({ phase }: { phase: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const { net, grads, losses, sample } = simulate(phase)
    drawBackpropagation(canvas, net, sample.input, sample.target, grads, losses)
  }, [phase])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function BackpropagationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <BackpropCanvas phase="forward" />
  const id = scene.scene.id
  const type = scene.scene.type
  const phase = (scene.lineState?.params?.phase as string | undefined) ?? 'forward'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <BackpropCanvas key={phase} phase={phase} />
}
