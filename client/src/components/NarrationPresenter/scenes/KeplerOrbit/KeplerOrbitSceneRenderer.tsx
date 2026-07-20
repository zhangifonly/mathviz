/**
 * 开普勒轨道场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawKeplerOrbit } from '../../../../experiments/kepler-orbit/draw'

const W = 640
const H = 540
const A = 1

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '开普勒轨道', subtitle: '行星椭圆与面积定律' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '开普勒轨道', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['行星沿椭圆绕日', '太阳位于一个焦点', '离心率决定椭圆胖瘦'],
    'sum-area': ['相等时间扫相等面积', '近日点快、远日点慢', '开普勒方程牛顿迭代'],
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

function OrbitCanvas({ ecc }: { ecc: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      t = (t + dt / 8) % 1
      drawKeplerOrbit(canvas, A, ecc, t, 12)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ecc])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function KeplerOrbitSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <OrbitCanvas ecc={0.6} />
  const id = scene.scene.id
  const type = scene.scene.type
  const ecc = (scene.lineState?.params?.ecc as number | undefined) ?? 0.6

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <OrbitCanvas key={ecc} ecc={ecc} />
}
