/**
 * 绝对值函数场景渲染器
 * 渲染 V 形图像、顶点、平移缩放、零点等可视化
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawAbsoluteValue } from '../../../../experiments/absolute-value/draw'

const RANGE = 6

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '绝对值函数', subtitle: '从距离到 V 形折线' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '绝对值函数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['绝对值 = 到零的距离', '距离非负，图像对称', '基本形是开口向上的 V'],
    'sum-params': ['减去数 → 顶点右移', '加上数 → 整体上抬', '系数控制开口宽窄与方向'],
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

function AbsCanvas({ a, h, k }: { a: number; h: number; k: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawAbsoluteValue(canvas, { a, h, k, range: RANGE }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [a, h, k])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={600} height={600} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function AbsoluteValueSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <AbsCanvas a={1} h={0} k={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params ?? {}
  const a = (p.a as number | undefined) ?? 1
  const h = (p.h as number | undefined) ?? 0
  const k = (p.k as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <AbsCanvas key={`${a}-${h}-${k}`} a={a} h={h} k={k} />
}
