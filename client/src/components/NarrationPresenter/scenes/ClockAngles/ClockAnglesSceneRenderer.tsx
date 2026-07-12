/**
 * 时钟与角度场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { angleBetween } from '../../../../experiments/clock-angles/clockAngles'
import { drawClockAngles } from '../../../../experiments/clock-angles/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '时钟与角度', subtitle: '钟面上藏着的圆周角' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '时钟与角度', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['钟面是 360 度的圆', '分针每分钟 6 度', '时针每小时 30 度'],
    'sum-formula': ['两针角度相减', '取较小的那个即夹角', '生活里的角度课'],
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

function ClockCanvas({ hour, minute }: { hour: number; minute: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawClockAngles(canvas, { hour, minute }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [hour, minute])
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={560} height={560} className="max-w-full max-h-full rounded-lg" />
      <div className="text-white/70 text-lg">
        {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')} · 夹角 {Number(angleBetween(hour, minute).toFixed(1))} 度
      </div>
    </div>
  )
}

export default function ClockAnglesSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <ClockCanvas hour={3} minute={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const hour = (scene.lineState?.params?.hour as number | undefined) ?? 3
  const minute = (scene.lineState?.params?.minute as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <ClockCanvas key={`${hour}:${minute}`} hour={hour} minute={minute} />
}
