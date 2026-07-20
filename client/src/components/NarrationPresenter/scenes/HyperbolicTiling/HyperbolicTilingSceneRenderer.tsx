/**
 * 双曲镶嵌场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawHyperbolicTiling } from '../../../../experiments/hyperbolic-tiling/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '双曲镶嵌', subtitle: '庞加莱圆盘上的正多边形铺砌' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '双曲镶嵌', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-finite': ['单位圆盘=双曲平面', '边界代表无穷远', '直线是垂直边界的圆弧'],
    'sum-tiling': ['{p,q} 正则镶嵌', '瓦片处处等大', '圆反演铺满整个圆盘'],
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

function TilingCanvas({ p, q, layers }: { p: number; q: number; layers: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawHyperbolicTiling(canvas, { p, q }, layers)
  }, [p, q, layers])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function HyperbolicTilingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TilingCanvas p={5} q={4} layers={3} />
  const id = scene.scene.id
  const type = scene.scene.type
  const params = scene.lineState?.params
  const p = (params?.p as number | undefined) ?? 5
  const q = (params?.q as number | undefined) ?? 4
  const layers = (params?.layers as number | undefined) ?? 3

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TilingCanvas key={`${p}-${q}-${layers}`} p={p} q={q} layers={layers} />
}
