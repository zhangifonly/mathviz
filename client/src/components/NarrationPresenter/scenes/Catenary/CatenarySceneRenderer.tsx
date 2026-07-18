/**
 * 悬链线场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawCatenary } from '../../../../experiments/catenary/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '悬链线', subtitle: '双曲余弦的曲线' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '悬链线', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['链条自然下垂的形状', 'y = a·cosh(x/a)', '双曲余弦描述'],
    'sum-arch': ['像抛物线却不是', '倒置成纯受压的拱', '弧长 2a·sinh(x₀/a)'],
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

function CatenaryCanvas({ a, parabola, invert }: { a: number; parabola: boolean; invert: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawCatenary(canvas, a, parabola, invert)
  }, [a, parabola, invert])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function CatenarySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CatenaryCanvas a={70} parabola={false} invert={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const params = scene.lineState?.params
  const a = (params?.a as number | undefined) ?? 70
  const parabola = Boolean(params?.parabola)
  const invert = Boolean(params?.invert)

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CatenaryCanvas key={`${a}-${parabola}-${invert}`} a={a} parabola={parabola} invert={invert} />
}
