/**
 * 离散余弦变换场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SIGNAL } from '../../../../experiments/discrete-cosine-transform/discreteCosineTransform'
import { drawDiscreteCosineTransform } from '../../../../experiments/discrete-cosine-transform/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '离散余弦变换', subtitle: 'JPEG 压缩的核心' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '离散余弦变换', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['信号=余弦基叠加', '低频勾勒轮廓', '能量集中在低频'],
    'sum-compress': ['丢弃微小高频系数', '逆变换近乎无损重建', 'JPEG 压缩的数学核心'],
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

function DctCanvas({ keep }: { keep: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawDiscreteCosineTransform(canvas, SIGNAL, keep)
  }, [keep])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DiscreteCosineTransformSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DctCanvas keep={8} />
  const id = scene.scene.id
  const type = scene.scene.type
  const keep = (scene.lineState?.params?.keep as number | undefined) ?? 8

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <DctCanvas key={keep} keep={keep} />
}
