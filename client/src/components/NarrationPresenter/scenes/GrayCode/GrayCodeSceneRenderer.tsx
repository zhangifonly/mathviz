/**
 * 格雷码场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawGrayCode } from '../../../../experiments/gray-code/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '格雷码', subtitle: '相邻只差一位的编码' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '格雷码', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['相邻码只翻一位', '汉明距离恒为 1', '避免读数跳变'],
    'sum-xor': ['gray = n ⊕ (n>>1)', '前缀异或可还原', '编码器与卡诺图皆用它'],
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

function GrayCodeCanvas({ bits, active }: { bits: number; active: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawGrayCode(canvas, bits, active)
  }, [bits, active])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function GrayCodeSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GrayCodeCanvas bits={3} active={-1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const bits = (scene.lineState?.params?.bits as number | undefined) ?? 3
  const active = (scene.lineState?.params?.active as number | undefined) ?? -1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GrayCodeCanvas key={`${bits}-${active}`} bits={bits} active={active} />
}
