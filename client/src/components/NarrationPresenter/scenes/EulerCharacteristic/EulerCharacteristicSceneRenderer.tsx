/**
 * 欧拉示性数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { POLYHEDRA, TORUS } from '../../../../experiments/euler-characteristic/eulerCharacteristic'
import { drawEulerCharacteristic } from '../../../../experiments/euler-characteristic/draw'

const W = 640
const H = 540
const SHAPES = [...POLYHEDRA, TORUS]

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '欧拉示性数', subtitle: 'V - E + F = 2' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '欧拉示性数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['V - E + F 即欧拉示性数', '凸多面体恒等于 2', '与具体形状无关'],
    'sum-genus': ['2 是球面的不变量', '环面 χ = 0', 'χ = 2 - 2g，g 为洞数'],
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

function EulerCanvas({ idx }: { idx: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawEulerCharacteristic(canvas, SHAPES[idx] ?? SHAPES[1])
  }, [idx])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function EulerCharacteristicSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <EulerCanvas idx={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const idx = (scene.lineState?.params?.idx as number | undefined) ?? 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <EulerCanvas key={idx} idx={idx} />
}
