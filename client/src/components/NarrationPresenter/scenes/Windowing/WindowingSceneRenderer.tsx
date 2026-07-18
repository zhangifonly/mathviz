/**
 * 加窗函数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawWindowing } from '../../../../experiments/windowing/draw'
import type { WindowKind } from '../../../../experiments/windowing/windowing'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '加窗函数', subtitle: '减少频谱泄漏' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '加窗函数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['截断造成频谱泄漏', '加窗让边缘平滑', '杂散能量随之减小'],
    'sum-trade': ['窄主瓣分辨率高', '低旁瓣泄漏少', '二者需按需取舍'],
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

function WindowingCanvas({ kind }: { kind: WindowKind }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawWindowing(canvas, kind, 128, 8.5)
  }, [kind])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function WindowingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <WindowingCanvas kind="rect" />
  const id = scene.scene.id
  const type = scene.scene.type
  const kind = (scene.lineState?.params?.kind as WindowKind | undefined) ?? 'rect'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <WindowingCanvas key={kind} kind={kind} />
}
