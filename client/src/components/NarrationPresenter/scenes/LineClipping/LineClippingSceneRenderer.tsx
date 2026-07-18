/**
 * 线段裁剪场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SEGMENTS } from '../../../../experiments/line-clipping/lineClipping'
import { drawLineClipping } from '../../../../experiments/line-clipping/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '线段裁剪', subtitle: 'Cohen-Sutherland 算法' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '线段裁剪', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-code': ['四位区域码编码端点', '两码全零直接接受', '按位与非零直接拒绝'],
    'sum-iter': ['其余情况迭代求交', '换端点重新编码', '几步剪到窗口边界'],
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

function ClippingCanvas({ showOutside }: { showOutside: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // 场景窗口按渲染尺寸略微放大，居中呈现
    const win = { xmin: 170, ymin: 150, xmax: 470, ymax: 390 }
    const segs = SEGMENTS.map((s) => ({ x1: s.x1 + 20, y1: s.y1 + 30, x2: s.x2 + 20, y2: s.y2 + 30 }))
    drawLineClipping(canvas, win, segs, showOutside)
  }, [showOutside])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LineClippingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <ClippingCanvas showOutside={true} />
  const id = scene.scene.id
  const type = scene.scene.type
  const showOutside = ((scene.lineState?.params?.showOutside as number | undefined) ?? 1) !== 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <ClippingCanvas key={String(showOutside)} showOutside={showOutside} />
}
