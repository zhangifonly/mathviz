/**
 * 欧几里得算法场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLES } from '../../../../experiments/euclidean-algorithm/euclideanAlgorithm'
import { drawEuclideanAlgorithm } from '../../../../experiments/euclidean-algorithm/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '欧几里得算法', subtitle: '辗转相除求最大公约数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '欧几里得算法', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['最大公约数的求法', '用余数一步步逼近', '最古老的高效算法'],
    'sum-forms': ['几何：矩形切正方形', '代数：裴蜀等式 ax+by=g', '简单取余藏着深刻数学'],
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

function TilingCanvas({ pairIndex, maxStep }: { pairIndex: number; maxStep: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [a, b] = SAMPLES[pairIndex] ?? SAMPLES[0]
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawEuclideanAlgorithm(canvas, a, b, maxStep)
  }, [a, b, maxStep])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function EuclideanAlgorithmSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TilingCanvas pairIndex={0} maxStep={-1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const pairIndex = (scene.lineState?.params?.pairIndex as number | undefined) ?? 0
  const maxStep = (scene.lineState?.params?.maxStep as number | undefined) ?? -1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TilingCanvas key={`${pairIndex}-${maxStep}`} pairIndex={pairIndex} maxStep={maxStep} />
}
