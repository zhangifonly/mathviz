/**
 * 旋转体体积场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { findCurve } from '../../../../experiments/solid-of-revolution/solidOfRevolution'
import { drawSolidOfRevolution } from '../../../../experiments/solid-of-revolution/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '旋转体体积', subtitle: '圆盘法与壳层法' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '旋转体体积', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['旋转体是区域绕轴旋转', '圆盘法沿 x 切薄片', '壳层法沿 y 套圆筒'],
    'sum-agree': ['两法都用积分累加', '算的是同一个立体', '结果完全一致'],
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

function SolidCanvas({ curveId, b }: { curveId: string; b: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const c = findCurve(curveId)
    drawSolidOfRevolution(canvas, c.fn, c.a, Math.min(b, c.b), 22)
  }, [curveId, b])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function SolidOfRevolutionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SolidCanvas curveId="sqrt" b={4} />
  const id = scene.scene.id
  const type = scene.scene.type
  const curveId = (scene.lineState?.params?.curveId as string | undefined) ?? 'sqrt'
  const b = (scene.lineState?.params?.b as number | undefined) ?? 4

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SolidCanvas key={`${curveId}-${b}`} curveId={curveId} b={b} />
}
