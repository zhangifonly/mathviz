/**
 * 组合恒等式场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawCombinatorialProof } from '../../../../experiments/combinatorial-proof/draw'
import type { DrawData } from '../../../../experiments/combinatorial-proof/draw'

const ROWS = 9

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '组合恒等式', subtitle: '用数格子的方式证明二项式恒等式' },
    'end-bye': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '组合恒等式', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'end-recap': ['求和：整行之和 = 2 的 n 次方', '对称：选 k 个 = 剔除 n 减 k 个', '帕斯卡：每格 = 上方两格之和'],
    'end-meaning': ['曲棍球棒：斜线累加落到下一格', '组合证明：两边在数同一样东西', '数与形完美交融'],
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

function TriangleCanvas({ data }: { data: DrawData }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.04)
      drawCombinatorialProof(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [data])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={560} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function CombinatorialProofSceneRenderer({ scene }: SceneRendererProps) {
  const defaultData: DrawData = { identity: 'sum', n: 4, k: 2, rows: ROWS }
  if (!scene) return <TriangleCanvas data={defaultData} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params ?? {}
  const identity = (p.identity as DrawData['identity'] | undefined) ?? 'sum'
  const n = (p.n as number | undefined) ?? 4
  const k = (p.k as number | undefined) ?? 2
  const data: DrawData = { identity, n, k, rows: ROWS }

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TriangleCanvas key={`${identity}-${n}-${k}`} data={data} />
}
