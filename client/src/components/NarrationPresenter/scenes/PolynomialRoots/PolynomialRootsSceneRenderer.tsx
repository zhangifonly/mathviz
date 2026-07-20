/**
 * 多项式求根场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawPolynomialRoots } from '../../../../experiments/polynomial-roots/draw'

const W = 640
const H = 540
const DEFAULT_COEFFS = [0, -3, 0, 1]

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '多项式求根', subtitle: '实根复根与系数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '多项式求根', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['求根=找与x轴交点', 'n次多项式有n个根', '实根看得见'],
    'sum-numeric': ['复根成对隐藏', '二分法夹逼', '牛顿法用切线逼近'],
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

function PolyCanvas({ coeffs }: { coeffs: number[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawPolynomialRoots(canvas, coeffs)
  }, [coeffs])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function PolynomialRootsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PolyCanvas coeffs={DEFAULT_COEFFS} />
  const id = scene.scene.id
  const type = scene.scene.type
  const coeffs = (scene.lineState?.params?.coeffs as number[] | undefined) ?? DEFAULT_COEFFS

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PolyCanvas key={coeffs.join(',')} coeffs={coeffs} />
}
