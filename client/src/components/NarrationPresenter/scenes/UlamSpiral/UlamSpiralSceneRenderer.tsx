/**
 * 素数螺旋场景渲染器
 * PPT 讲解模式下用 Canvas 渲染乌拉姆螺旋
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { ulamSpiral } from '../../../../experiments/ulam-spiral/ulam'
import { drawSpiral } from '../../../../experiments/ulam-spiral/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '素数螺旋', subtitle: '随手涂鸦中的素数秘密' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '素数螺旋', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['素数聚集在对角线上', '并非随机散布', '乌拉姆 1963 年发现'],
    'sum-poly': ['对角线 = 二次多项式', 'n²+n+41 产生大量素数', '连接黎曼猜想'],
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

function SpiralCanvas({ count }: { count: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const cells = ulamSpiral(count)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawSpiral(canvas, cells, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [count])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={600} height={600} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function UlamSpiralSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SpiralCanvas count={961} />
  const id = scene.scene.id
  const type = scene.scene.type
  const count = (scene.lineState?.params?.count as number | undefined) ?? 961

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SpiralCanvas key={count} count={count} />
}
