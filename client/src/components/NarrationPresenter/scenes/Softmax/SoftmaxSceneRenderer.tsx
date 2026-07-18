/**
 * Softmax 函数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_LOGITS } from '../../../../experiments/softmax/softmax'
import { drawSoftmax } from '../../../../experiments/softmax/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'Softmax函数', subtitle: '分数归一化成概率' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'Softmax函数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['指数放大差距', '除以总和归一化', '输出和为 1'],
    'sum-temp': ['温度调节尖锐度', 'T 小更果断', '藏在分类器与注意力里'],
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

function SoftmaxCanvas({ temp }: { temp: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawSoftmax(canvas, SAMPLE_LOGITS, temp)
  }, [temp])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function SoftmaxSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SoftmaxCanvas temp={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const temp = (scene.lineState?.params?.temp as number | undefined) ?? 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SoftmaxCanvas key={temp} temp={temp} />
}
