/**
 * 格林公式场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { getField } from '../../../../experiments/green-theorem/greenTheorem'
import { drawGreenTheorem } from '../../../../experiments/green-theorem/draw'

const RADIUS = 1.4

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-title': { title: '格林公式', subtitle: '边界线积分与区域二重积分的桥梁' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '格林公式', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['边界线积分 = 区域二重积分', '内部微小旋转相互抵消', '只剩最外圈的环量'],
    'sum-link': ['微积分基本定理的平面推广', '斯托克斯定理的雏形', '边界与内部紧紧相连'],
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

function GreenCanvas({ fieldId, showCurl }: { fieldId: string; showCurl: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const field = getField(fieldId)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawGreenTheorem(canvas, { field, radius: RADIUS, showCurl }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [fieldId, showCurl])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={600} height={600} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function GreenTheoremSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GreenCanvas fieldId="rotation" showCurl />
  const id = scene.scene.id
  const type = scene.scene.type
  const fieldId = (scene.lineState?.params?.field as string | undefined) ?? 'rotation'
  const showCurl = (scene.lineState?.params?.showCurl as boolean | undefined) ?? true

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GreenCanvas key={`${fieldId}-${showCurl}`} fieldId={fieldId} showCurl={showCurl} />
}
