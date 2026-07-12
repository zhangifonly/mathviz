/**
 * 相似三角形场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { computeSimilar } from '../../../../experiments/similar-triangles/similarTriangles'
import { drawSimilarTriangles } from '../../../../experiments/similar-triangles/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '相似三角形', subtitle: '形状相同，大小可变的秘密' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '相似三角形', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['形状相同，大小可变', '对应角相等', '对应边成比例'],
    'sum-area': ['边长按相似比变化', '面积按相似比的平方变化', '边 2 倍则面积 4 倍'],
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

function SimilarCanvas({ k }: { k: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const data = computeSimilar(k)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawSimilarTriangles(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [k])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={560} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SimilarTrianglesSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SimilarCanvas k={2} />
  const id = scene.scene.id
  const type = scene.scene.type
  const k = (scene.lineState?.params?.k as number | undefined) ?? 2

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SimilarCanvas key={k} k={k} />
}
