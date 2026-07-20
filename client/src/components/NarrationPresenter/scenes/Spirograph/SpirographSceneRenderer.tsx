/**
 * 万花尺（内摆线）场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawSpirograph } from '../../../../experiments/spirograph/draw'
import { petalCount } from '../../../../experiments/spirograph/spirograph'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '万花尺', subtitle: '内摆线的花纹' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '万花尺', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['小圆在大圆内滚动', '笔尖轨迹即内摆线', '对称优美的花纹'],
    'sum-gcd': ['花瓣数 = R / gcd(R, r)', '比值决定花朵形状', '简单规则画出繁花'],
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

function SpiroCanvas({ R, r, d }: { R: number; r: number; d: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawSpirograph(canvas, { R, r, d }, 1)
  }, [R, r, d])
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-slate-900" />
      <p className="text-white/70 text-sm">{petalCount(R, r)} 瓣 · R={R} r={r} d={d}</p>
    </div>
  )
}

export default function SpirographSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SpiroCanvas R={100} r={40} d={40} />
  const id = scene.scene.id
  const type = scene.scene.type
  const params = scene.lineState?.params ?? {}
  const R = (params.R as number | undefined) ?? 100
  const r = (params.r as number | undefined) ?? 40
  const d = (params.d as number | undefined) ?? 40

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SpiroCanvas key={`${R}-${r}-${d}`} R={R} r={r} d={d} />
}
