/**
 * 动态规划场景渲染器
 */
import { useEffect, useRef, useMemo } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { lcs, knapsack01, LCS_SAMPLE, KNAPSACK_SAMPLE } from '../../../../experiments/dynamic-programming/dynamicProgramming'
import { drawDynamicProgramming, type DpView } from '../../../../experiments/dynamic-programming/draw'

const W = 640
const H = 540

function buildView(mode: string): DpView {
  if (mode === 'knap') {
    const r = knapsack01(KNAPSACK_SAMPLE.items, KNAPSACK_SAMPLE.cap)
    return {
      table: r.table,
      rowLabels: ['∅', ...r.items.map((it) => it.name)],
      colLabels: Array.from({ length: r.cap + 1 }, (_, i) => String(i)),
      path: r.path,
    }
  }
  const r = lcs(LCS_SAMPLE.s1, LCS_SAMPLE.s2)
  return {
    table: r.table,
    rowLabels: ['∅', ...r.s1.split('')],
    colLabels: ['∅', ...r.s2.split('')],
    path: r.path,
  }
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '动态规划', subtitle: '重叠子问题与记忆化' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '动态规划', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['大问题拆成子问题', '结果存表只算一次', '递归指数级变 O(mn)'],
    'sum-keys': ['重叠子问题', '最优子结构', '填表后回溯得方案'],
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

function DpCanvas({ mode, fill }: { mode: string; fill: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const view = useMemo(() => buildView(mode), [mode])
  useEffect(() => {
    const canvas = ref.current
    if (canvas) drawDynamicProgramming(canvas, view, fill)
  }, [view, fill])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DynamicProgrammingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DpCanvas mode="lcs" fill={-1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const mode = (scene.lineState?.params?.mode as string | undefined) ?? 'lcs'
  const fill = (scene.lineState?.params?.fill as number | undefined) ?? -1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <DpCanvas key={`${mode}-${fill}`} mode={mode} fill={fill} />
}
