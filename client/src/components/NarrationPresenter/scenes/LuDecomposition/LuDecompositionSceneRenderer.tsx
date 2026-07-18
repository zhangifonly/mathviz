/**
 * LU 分解场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_MATRICES } from '../../../../experiments/lu-decomposition/luDecomposition'
import { drawLuDecomposition } from '../../../../experiments/lu-decomposition/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'LU分解', subtitle: '矩阵分解为下三角乘上三角' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'LU分解', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['A 分解为 L 与 U', 'L 是单位下三角', 'U 是上三角'],
    'sum-reuse': ['一次分解反复使用', '前代解 L·y=b', '回代解 U·x=y'],
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

function LuCanvas({ matrix }: { matrix: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const A = SAMPLE_MATRICES[matrix % SAMPLE_MATRICES.length]
    drawLuDecomposition(canvas, A)
  }, [matrix])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LuDecompositionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <LuCanvas matrix={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const matrix = (scene.lineState?.params?.matrix as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <LuCanvas key={matrix} matrix={matrix} />
}
