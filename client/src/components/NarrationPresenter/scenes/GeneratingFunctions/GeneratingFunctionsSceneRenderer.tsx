/**
 * 生成函数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { EXAMPLES } from '../../../../experiments/generating-functions/generatingFunctions'
import { drawGeneratingFunctions } from '../../../../experiments/generating-functions/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '生成函数', subtitle: '把数列装进幂级数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '生成函数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['数列编码为幂级数系数', '第k项放在xᵏ前面', '柱高即对应系数'],
    'sum-conv': ['相乘等于系数卷积', '天然对应组合计数', '一个级数装下整串数列'],
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

function CoeffCanvas({ idx }: { idx: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ex = EXAMPLES[idx] ?? EXAMPLES[0]
    drawGeneratingFunctions(canvas, ex.coeffs, '#6366f1')
  }, [idx])
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
      <p className="text-white/70 text-lg">{(EXAMPLES[idx] ?? EXAMPLES[0]).label}</p>
    </div>
  )
}

export default function GeneratingFunctionsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CoeffCanvas idx={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const idx = (scene.lineState?.params?.idx as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CoeffCanvas key={idx} idx={idx} />
}
