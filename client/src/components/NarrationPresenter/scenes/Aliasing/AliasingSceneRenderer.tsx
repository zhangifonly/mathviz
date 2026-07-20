/**
 * 混叠现象场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawAliasing } from '../../../../experiments/aliasing/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '混叠现象', subtitle: '采样不足的频率伪装' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '混叠现象', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['采样点太稀疏', '高频伪装成低频', '这就是混叠'],
    'sum-nyquist': ['采样率须大于两倍频率', '奈奎斯特定理', '才能忠实还原信号'],
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

function AliasingCanvas({ f, fs }: { f: number; fs: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawAliasing(canvas, f, fs)
  }, [f, fs])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function AliasingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <AliasingCanvas f={9} fs={10} />
  const id = scene.scene.id
  const type = scene.scene.type
  const f = (scene.lineState?.params?.f as number | undefined) ?? 9
  const fs = (scene.lineState?.params?.fs as number | undefined) ?? 10

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <AliasingCanvas key={`${f}-${fs}`} f={f} fs={fs} />
}
