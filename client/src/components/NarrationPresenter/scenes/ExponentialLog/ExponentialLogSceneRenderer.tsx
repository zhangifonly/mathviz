/**
 * 指数与对数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawExponentialLog, type DrawData } from '../../../../experiments/exponential-log/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '指数与对数', subtitle: '互为反函数的一对孪生曲线' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '指数与对数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['指数刻画成倍增长或衰减', '对数是指数的逆运算', '一逆一正，成对出现'],
    'sum-symmetry': ['两曲线关于 y = x 对称', '互为反函数', '从复利到分贝无处不在'],
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

function ExpLogCanvas({ data }: { data: DrawData }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawExponentialLog(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [data])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={600} height={600} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function ExponentialLogSceneRenderer({ scene }: SceneRendererProps) {
  const defaultData: DrawData = { base: 2, showExp: true, showLog: true, showMirror: true }
  if (!scene) return <ExpLogCanvas data={defaultData} />

  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />

  const params = scene.lineState?.params ?? {}
  const data: DrawData = {
    base: (params.base as number | undefined) ?? 2,
    showExp: (params.showExp as boolean | undefined) ?? true,
    showLog: (params.showLog as boolean | undefined) ?? true,
    showMirror: (params.showMirror as boolean | undefined) ?? false,
  }
  const key = `${data.base}-${data.showExp}-${data.showLog}-${data.showMirror}`
  return <ExpLogCanvas key={key} data={data} />
}
