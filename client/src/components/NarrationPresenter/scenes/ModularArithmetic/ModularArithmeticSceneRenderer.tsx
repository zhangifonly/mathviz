/**
 * 模运算与同余场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { buildCircleData } from '../../../../experiments/modular-arithmetic/modularArithmetic'
import { drawModularArithmetic } from '../../../../experiments/modular-arithmetic/draw'

const N = 240

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '模运算与同余', subtitle: '时钟上的数学，圆环里的心形线' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '模运算与同余', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['模运算把整数绕成圆环', '同余把整数归为有限类', '余数相同即同余'],
    'sum-crypto': ['支撑现代密码学', '哈希算法的数学基石', '简单规则，深邃秩序'],
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

function CircleCanvas({ k }: { k: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const data = buildCircleData(N, k)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawModularArithmetic(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [k])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={600} height={600} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function ModularArithmeticSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CircleCanvas k={2} />
  const id = scene.scene.id
  const type = scene.scene.type
  const k = (scene.lineState?.params?.k as number | undefined) ?? 2

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CircleCanvas key={k} k={k} />
}
