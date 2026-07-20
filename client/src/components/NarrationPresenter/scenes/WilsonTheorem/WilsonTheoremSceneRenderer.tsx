/**
 * 威尔逊定理场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawWilsonTheorem } from '../../../../experiments/wilson-theorem/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '威尔逊定理', subtitle: '阶乘里的素性判据' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '威尔逊定理', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['(n-1)! ≡ -1 (mod n)', '当且仅当 n 为素数', '充要条件精准圈出素数'],
    'sum-mod': ['边乘边取模不溢出', '余数始终在 [0, n)', '庞大运算收进小余数'],
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

function WilsonCanvas({ upTo }: { upTo: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawWilsonTheorem(canvas, upTo)
  }, [upTo])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function WilsonTheoremSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <WilsonCanvas upTo={25} />
  const id = scene.scene.id
  const type = scene.scene.type
  const upTo = (scene.lineState?.params?.upTo as number | undefined) ?? 25

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <WilsonCanvas key={upTo} upTo={upTo} />
}
