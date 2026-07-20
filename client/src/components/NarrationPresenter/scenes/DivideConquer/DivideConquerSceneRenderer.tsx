/**
 * 分治算法场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_ARRAY } from '../../../../experiments/divide-conquer/divideConquer'
import { drawDivideConquer } from '../../../../experiments/divide-conquer/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '分治算法', subtitle: '分而治之再合并' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '分治算法', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['分解：大问题二分', '求解：递归攻子问题', '合并：拼回整体解'],
    'sum-apps': ['归并排序', '快速排序', '最大子数组分治'],
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

function TreeCanvas({ depth, merge }: { depth: number; merge: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawDivideConquer(canvas, SAMPLE_ARRAY, depth, merge === 1)
  }, [depth, merge])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DivideConquerSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TreeCanvas depth={-1} merge={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const depth = (scene.lineState?.params?.depth as number | undefined) ?? -1
  const merge = (scene.lineState?.params?.merge as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TreeCanvas key={`${depth}-${merge}`} depth={depth} merge={merge} />
}
