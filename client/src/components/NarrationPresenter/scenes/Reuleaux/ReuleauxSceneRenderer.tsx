/**
 * 等宽曲线 勒洛多边形 场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawReuleaux, drawRolling } from '../../../../experiments/reuleaux/draw'

const W = 640
const H = 540
const WIDTH = 300

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '等宽曲线', subtitle: '勒洛三角形 — 不是圆，却处处等宽' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '等宽曲线', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['任意方向宽度相同', '圆只是其中一员', '勒洛三角形最著名'],
    'sum-barbier': ['三段圆弧拼成', '周长 = π 乘宽度', '钻方孔与异形硬币'],
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

function ReuleauxCanvas({ sides, roll }: { sides: number; roll: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (!roll) {
      drawReuleaux(canvas, sides, WIDTH, true)
      return
    }
    let phase = 0
    const tick = () => {
      phase = (phase + 0.004) % 1
      drawRolling(canvas, sides, WIDTH, phase)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [sides, roll])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function ReuleauxSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <ReuleauxCanvas sides={3} roll={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const params = scene.lineState?.params as { sides?: number; roll?: boolean } | undefined
  const sides = params?.sides ?? 3
  const roll = params?.roll ?? false

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <ReuleauxCanvas key={`${sides}-${roll}`} sides={sides} roll={roll} />
}
