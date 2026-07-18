/**
 * 最速降线场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawBrachistochrone } from '../../../../experiments/brachistochrone/draw'
import { descentTime, straightPath } from '../../../../experiments/brachistochrone/brachistochrone'

const W = 640
const H = 540
const BX = 460
const BY = 380

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-drop': { title: '最速降线', subtitle: '下滑最快的曲线' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '最速降线', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['速度只取决于下落高度', '先陡后缓反而更快', '最短的直线并非最快'],
    'sum-history': ['伯努利1696年公开征解', '牛顿一夜解出', '催生了变分法'],
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

function RaceCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const total = descentTime(straightPath(BX, BY))
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const elapsed = ((ts - start) / 1000) % (total + 0.8)
      drawBrachistochrone(canvas, BX, BY, elapsed)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function BrachistochroneSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <RaceCanvas />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <RaceCanvas />
}
