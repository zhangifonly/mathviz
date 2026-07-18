/**
 * 谢尔宾斯基地毯场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { fractalDimension } from '../../../../experiments/sierpinski-carpet/sierpinskiCarpet'
import { drawSierpinskiCarpet } from '../../../../experiments/sierpinski-carpet/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '谢尔宾斯基地毯', subtitle: '二维挖洞分形' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '谢尔宾斯基地毯', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['切成 3x3 九格', '挖去正中心格', '对余下八格递归'],
    'sum-dim': ['无穷自相似', '维数 log8 / log3 约 1.89', '面积趋于零'],
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

function CarpetCanvas({ level }: { level: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawSierpinskiCarpet(canvas, level, level <= 3)
  }, [level])
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
      <p className="text-white/70 text-sm">
        第 {level} 层 · 维数 log8/log3 ≈ {fractalDimension().toFixed(4)}
      </p>
    </div>
  )
}

export default function SierpinskiCarpetSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CarpetCanvas level={3} />
  const id = scene.scene.id
  const type = scene.scene.type
  const level = (scene.lineState?.params?.level as number | undefined) ?? 3

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CarpetCanvas key={level} level={level} />
}
