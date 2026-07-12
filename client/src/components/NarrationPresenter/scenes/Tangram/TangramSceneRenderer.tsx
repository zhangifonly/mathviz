/**
 * 七巧板场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { tangramPieces, SHAPE_OPTIONS } from '../../../../experiments/tangram/tangram'
import { drawTangram } from '../../../../experiments/tangram/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '七巧板', subtitle: '一块正方形，切出千变万化' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '七巧板', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-6xl mb-6">🧩</div>
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['正方形切成七块', '五个三角形 + 正方形 + 平行四边形', '小三角为 1 份，合计 16 份'],
    'sum-conserve': ['无论拼成什么，面积守恒', '旋转平移不改变面积', '数与形的巧妙结合'],
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

function TangramCanvas({ shape }: { shape: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const pieces = tangramPieces()
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawTangram(canvas, pieces, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [shape])
  const opt = SHAPE_OPTIONS.find((o) => o.id === shape)
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={560} height={560} className="max-w-full max-h-full rounded-lg" />
      {opt && <p className="text-white/60 text-sm">目标：{opt.label} · 面积恒为 16</p>}
    </div>
  )
}

export default function TangramSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TangramCanvas shape="square" />
  const id = scene.scene.id
  const type = scene.scene.type
  const shape = (scene.lineState?.params?.shape as string | undefined) ?? 'square'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TangramCanvas key={shape} shape={shape} />
}
