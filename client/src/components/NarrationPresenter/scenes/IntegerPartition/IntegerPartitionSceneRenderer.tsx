/**
 * 整数分拆场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { partitions } from '../../../../experiments/integer-partition/integerPartition'
import { drawIntegerPartition } from '../../../../experiments/integer-partition/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '整数分拆', subtitle: '杨氏图与分拆数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '整数分拆', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['无序正整数之和', '分拆总数记作 p(n)', 'p(n) 增长飞快'],
    'sum-conj': ['杨氏图逐行画方块', '转置得到共轭分拆', '简单加法藏组合之美'],
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

function PartitionCanvas({ n, idx, conj }: { n: number; idx: number; conj: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const all = partitions(n)
    const p = all[Math.min(idx, all.length - 1)] ?? []
    drawIntegerPartition(canvas, p, conj)
  }, [n, idx, conj])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function IntegerPartitionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PartitionCanvas n={5} idx={0} conj={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const params = scene.lineState?.params ?? {}
  const n = (params.n as number | undefined) ?? 5
  const idx = (params.idx as number | undefined) ?? 0
  const conj = (params.conj as boolean | undefined) ?? false

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PartitionCanvas key={`${n}-${idx}-${conj}`} n={n} idx={idx} conj={conj} />
}
