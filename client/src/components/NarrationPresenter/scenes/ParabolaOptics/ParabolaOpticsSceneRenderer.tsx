/**
 * 抛物线与光学场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawParabolaOptics } from '../../../../experiments/parabola-optics/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-light': { title: '抛物线与光学', subtitle: '平行光为什么会聚到一点' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '抛物线与光学', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-def': ['焦点与准线定义抛物线', '曲线上每点到两者等距', '标准式 x²=4py'],
    'sum-refl': ['平行光反射后聚于焦点', '焦点光源射出平行光', '探照灯与卫星天线的原理'],
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

function ParabolaCanvas({ p, rays }: { p: number; rays: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawParabolaOptics(canvas, { p, rays }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [p, rays])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function ParabolaOpticsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <ParabolaCanvas p={1} rays={9} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = (scene.lineState?.params?.p as number | undefined) ?? 1
  const rays = (scene.lineState?.params?.rays as number | undefined) ?? 9

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <ParabolaCanvas key={`${p}-${rays}`} p={p} rays={rays} />
}
