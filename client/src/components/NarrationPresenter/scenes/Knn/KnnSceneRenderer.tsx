/**
 * K 近邻分类场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { makeDataset } from '../../../../experiments/knn/knn'
import { drawKnn } from '../../../../experiments/knn/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'K近邻分类', subtitle: '看看你的邻居都是谁' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'K近邻分类', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['按距离找最近 k 个邻居', '多数投票决定类别', '无需训练的惰性学习'],
    'sum-choosek': ['k 小则边界锯齿', 'k 大则边界平滑', '选好 k 是使用关键'],
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

function KnnCanvas({ classes, k, showQuery }: { classes: number; k: number; showQuery: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const perClass = classes === 2 ? 14 : 12
    const train = makeDataset(classes, perClass, W, H, 7)
    const query = showQuery ? { x: W / 2, y: H / 2 } : null
    drawKnn(canvas, train, k, query, 6)
  }, [classes, k, showQuery])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function KnnSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <KnnCanvas classes={3} k={5} showQuery={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params || {}
  const classes = (p.classes as number | undefined) ?? 3
  const k = (p.k as number | undefined) ?? 5
  const showQuery = (p.showQuery as boolean | undefined) ?? false

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <KnnCanvas key={`${classes}-${k}-${showQuery}`} classes={classes} k={k} showQuery={showQuery} />
}
