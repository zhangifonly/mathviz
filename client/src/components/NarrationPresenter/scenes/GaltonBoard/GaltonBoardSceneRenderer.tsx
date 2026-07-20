/**
 * 高尔顿板场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { simulate, ROWS } from '../../../../experiments/galton-board/galtonBoard'
import { drawGaltonBoard } from '../../../../experiments/galton-board/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '高尔顿板', subtitle: '钉板堆出正态分布' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '高尔顿板', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['每层左右五五开', '落槽=向右次数', '计数服从二项分布'],
    'sum-clt': ['大量小球叠加', '轮廓逼近钟形曲线', '演示中心极限定理'],
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

function GaltonCanvas({ balls }: { balls: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const counts = simulate(ROWS, balls, 1)
    drawGaltonBoard(canvas, ROWS, counts)
  }, [balls])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function GaltonBoardSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GaltonCanvas balls={1000} />
  const id = scene.scene.id
  const type = scene.scene.type
  const balls = (scene.lineState?.params?.balls as number | undefined) ?? 1000

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GaltonCanvas key={balls} balls={balls} />
}
