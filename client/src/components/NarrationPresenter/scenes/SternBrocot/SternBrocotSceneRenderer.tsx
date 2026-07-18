/**
 * Stern-Brocot 树场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawSternBrocot } from '../../../../experiments/stern-brocot/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'Stern-Brocot树', subtitle: '生成所有既约分数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'Stern-Brocot树', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['中位数 (a+c)/(b+d)', '在 0/1 与 1/0 间递归', '排成有序的分数树'],
    'sum-cf': ['每个既约分数唯一', '不重复也不遗漏', '路径对应连分数展开'],
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

function TreeCanvas({ depth }: { depth: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawSternBrocot(canvas, depth)
  }, [depth])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function SternBrocotSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TreeCanvas depth={4} />
  const id = scene.scene.id
  const type = scene.scene.type
  const depth = (scene.lineState?.params?.depth as number | undefined) ?? 4

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TreeCanvas key={depth} depth={depth} />
}
