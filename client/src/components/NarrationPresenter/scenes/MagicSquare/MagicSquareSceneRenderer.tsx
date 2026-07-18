/**
 * 幻方场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { siameseMagicSquare, type LineKind } from '../../../../experiments/magic-square/magicSquare'
import { drawMagicSquare, type HighlightLine } from '../../../../experiments/magic-square/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-luoshu': { title: '幻方', subtitle: '洛书千年的数字奇迹' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '幻方', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['行列对角和都相等', '公共和即幻常数', '一条简单规则'],
    'sum-history': ['源自洛书传说', '暹罗法构造奇数阶', '数字里的秩序之美'],
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

function MagicCanvas({ order, line, index }: { order: number; line?: LineKind; index?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const square = siameseMagicSquare(order)
    const highlight: HighlightLine | undefined = line ? { kind: line, index } : undefined
    drawMagicSquare(canvas, square, highlight)
  }, [order, line, index])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function MagicSquareSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <MagicCanvas order={3} />
  const id = scene.scene.id
  const type = scene.scene.type
  const params = scene.lineState?.params
  const order = (params?.order as number | undefined) ?? 3
  const line = params?.line as LineKind | undefined
  const index = params?.index as number | undefined

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <MagicCanvas key={`${order}-${line}-${index}`} order={order} line={line} index={index} />
}
