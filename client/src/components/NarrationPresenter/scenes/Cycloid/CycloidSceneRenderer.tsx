/**
 * 旋轮线场景渲染器
 * PPT 讲解模式下用 Canvas 渲染滚动曲线
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { buildCurve, type CurveKind } from '../../../../experiments/cycloid/cycloid'
import { drawCurveScene } from '../../../../experiments/cycloid/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '旋轮线家族', subtitle: '一个圆滚动画出的优美曲线' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '旋轮线', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['摆线由圆滚动生成', '它是最速降线', '也是等时曲线'],
    'sum-family': ['内摆线 → 星形线', '外摆线 → 心脏线', '尖点数取决于半径之比'],
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

function CurveCanvas({ kind }: { kind: CurveKind }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const pts = buildCurve(kind)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.008)
      drawCurveScene(canvas, kind, pts, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [kind])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={760} height={540} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function CycloidSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CurveCanvas kind="cycloid" />
  const id = scene.scene.id
  const type = scene.scene.type
  const kind = (scene.lineState?.params?.curve as CurveKind | undefined) ?? 'cycloid'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CurveCanvas key={kind} kind={kind} />
}
