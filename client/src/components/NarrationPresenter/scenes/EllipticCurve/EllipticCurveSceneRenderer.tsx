/**
 * 椭圆曲线场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { CURVES, curveY, type Point } from '../../../../experiments/elliptic-curve/ellipticCurve'
import { drawEllipticCurve } from '../../../../experiments/elliptic-curve/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '椭圆曲线', subtitle: '曲线上点的加法群' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '椭圆曲线', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-group': ['点用弦切法相加', '结果仍在曲线上', '构成交换群'],
    'sum-identity': ['无穷远点是单位元', '翻折给出负元', '守护现代信息安全'],
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

function CurveCanvas({ ci, xp, xq }: { ci: number; xp: number; xq: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const c = CURVES[ci] ?? CURVES[0]
    const yp = curveY(c, xp)
    const yq = curveY(c, xq)
    const P: Point | null = yp === null ? null : { x: xp, y: yp }
    const Q: Point | null = yq === null ? null : { x: xq, y: yq }
    drawEllipticCurve(canvas, c, P, Q, true)
  }, [ci, xp, xq])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function EllipticCurveSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CurveCanvas ci={0} xp={-1} xq={1.5} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params
  const ci = (p?.ci as number | undefined) ?? 0
  const xp = (p?.xp as number | undefined) ?? -1
  const xq = (p?.xq as number | undefined) ?? 1.5

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CurveCanvas key={`${ci}-${xp}-${xq}`} ci={ci} xp={xp} xq={xq} />
}
