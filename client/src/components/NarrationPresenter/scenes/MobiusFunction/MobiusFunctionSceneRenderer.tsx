/**
 * 莫比乌斯函数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawMobiusFunction } from '../../../../experiments/mobius-function/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '莫比乌斯函数', subtitle: '数论中的正负零' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '莫比乌斯函数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['只取 -1 / 0 / +1', '编码整数的素因子结构', '数论的经典函数'],
    'sum-rule': ['含平方因子则归零', '素因子偶数取正一', '奇数取负一'],
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

function MobiusCanvas({ range }: { range: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawMobiusFunction(canvas, range)
  }, [range])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function MobiusFunctionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <MobiusCanvas range={60} />
  const id = scene.scene.id
  const type = scene.scene.type
  const range = (scene.lineState?.params?.range as number | undefined) ?? 60

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <MobiusCanvas key={range} range={range} />
}
