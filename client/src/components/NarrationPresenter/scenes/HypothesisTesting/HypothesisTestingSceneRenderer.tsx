/**
 * 假设检验场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { runTest } from '../../../../experiments/hypothesis-testing/hypothesisTesting'
import { drawHypothesisTesting } from '../../../../experiments/hypothesis-testing/draw'

const W = 640
const H = 540
const MU0 = 100
const SIGMA = 15
const N = 30

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '假设检验', subtitle: '用数据判断原假设' },
    'sum-end': { title: '感谢观看', subtitle: '让数据替我们说话' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '假设检验', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['先立原假设 H0', '构造 z 检验统计量', '衡量数据的反常程度'],
    'sum-rule': ['p 值小于 α 则拒绝', '否则暂且保留 H0', '理性做出判断'],
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

function TestCanvas({ mean, alpha }: { mean: number; alpha: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawHypothesisTesting(canvas, runTest(mean, MU0, SIGMA, N, alpha), alpha)
  }, [mean, alpha])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function HypothesisTestingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TestCanvas mean={106} alpha={0.05} />
  const id = scene.scene.id
  const type = scene.scene.type
  const mean = (scene.lineState?.params?.mean as number | undefined) ?? 106
  const alpha = (scene.lineState?.params?.alpha as number | undefined) ?? 0.05

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TestCanvas key={`${mean}-${alpha}`} mean={mean} alpha={alpha} />
}
