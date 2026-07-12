/**
 * 利萨茹与玫瑰曲线场景渲染器
 * PPT 讲解模式下用 Canvas 渲染对称曲线
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { buildFigure, type FigureKind } from '../../../../experiments/lissajous/lissajous'
import { drawFigure } from '../../../../experiments/lissajous/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '利萨茹与玫瑰曲线', subtitle: '频率与角度编织的对称花纹' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '对称曲线', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['利萨茹由两个垂直振动合成', '频率比决定形状', '整数比图形闭合'],
    'sum-rose': ['玫瑰曲线 r=cos(kθ)', 'k 奇 → k 瓣', 'k 偶 → 2k 瓣'],
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

function FigureCanvas({ kind }: { kind: FigureKind }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const pts = buildFigure(kind)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.006)
      drawFigure(canvas, pts, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [kind])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={560} height={560} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LissajousSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <FigureCanvas kind="lissajous-3-2" />
  const id = scene.scene.id
  const type = scene.scene.type
  const kind = (scene.lineState?.params?.figure as FigureKind | undefined) ?? 'lissajous-3-2'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <FigureCanvas key={kind} kind={kind} />
}
