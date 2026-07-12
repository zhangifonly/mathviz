/**
 * 二元一次方程组场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { solveLinearSystem, SYSTEM_OPTIONS } from '../../../../experiments/linear-system/linearSystem'
import { drawLinearSystem } from '../../../../experiments/linear-system/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '二元一次方程组', subtitle: '两条直线的相遇' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '二元一次方程组', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['每个方程是一条直线', '交点就是方程组的解', '代数变几何一目了然'],
    'sum-cases': ['相交 → 唯一解', '平行 → 无解', '重合 → 无穷多解'],
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

function SystemCanvas({ systemId }: { systemId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const opt = SYSTEM_OPTIONS.find((o) => o.id === systemId) ?? SYSTEM_OPTIONS[0]
    const data = { eq1: opt.eq1, eq2: opt.eq2, solution: solveLinearSystem(opt.eq1, opt.eq2) }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawLinearSystem(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [systemId])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={600} height={560} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function LinearSystemSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SystemCanvas systemId="unique" />
  const id = scene.scene.id
  const type = scene.scene.type
  const systemId = (scene.lineState?.params?.systemId as string | undefined) ?? 'unique'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SystemCanvas key={systemId} systemId={systemId} />
}
