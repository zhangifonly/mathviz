/**
 * 曼德博集与朱利亚集场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawMandelbrotJulia, type FractalData } from '../../../../experiments/mandelbrot-julia/draw'

const MAX_ITER = 160

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '曼德博与朱利亚集', subtitle: '一个平方迭代里生长出的无穷宇宙' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '曼德博与朱利亚集', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['z → z² + c 反复迭代', '逃逸时间映射成颜色', '边界处涌现无穷细节'],
    'sum-index': ['曼德博集索引朱利亚集', 'c 在内则连通，在外成尘', '简单规则孕育无穷'],
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

function FractalCanvas({ mode, cx, cy }: { mode: 'mandelbrot' | 'julia'; cx: number; cy: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const data: FractalData =
      mode === 'mandelbrot'
        ? { mode, cx: 0, cy: 0, centerX: -0.5, centerY: 0, scale: 1.3, maxIter: MAX_ITER }
        : { mode, cx, cy, centerX: 0, centerY: 0, scale: 1.5, maxIter: MAX_ITER }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.06)
      drawMandelbrotJulia(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mode, cx, cy])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg bg-slate-900" />
    </div>
  )
}

export default function MandelbrotJuliaSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <FractalCanvas mode="mandelbrot" cx={0} cy={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const params = scene.lineState?.params ?? {}
  const mode = ((params.mode as string) === 'julia' ? 'julia' : 'mandelbrot') as 'mandelbrot' | 'julia'
  const cx = (params.cx as number | undefined) ?? -0.4
  const cy = (params.cy as number | undefined) ?? 0.6

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <FractalCanvas key={`${mode}-${cx}-${cy}`} mode={mode} cx={cx} cy={cy} />
}
