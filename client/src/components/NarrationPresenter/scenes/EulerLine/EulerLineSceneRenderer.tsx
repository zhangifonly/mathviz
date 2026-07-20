/**
 * 欧拉线场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { PRESET_TRIANGLES } from '../../../../experiments/euler-line/eulerLine'
import { drawEulerLine } from '../../../../experiments/euler-line/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '欧拉线', subtitle: '三心共线的奇迹' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '欧拉线', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['重心=中线交点', '外心=垂直平分线交点', '垂心=高线交点，三者共线'],
    'sum-ratio': ['欧拉线贯穿三心', '重心分外心到垂心', 'OG : GH = 1 : 2'],
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

function EulerCanvas({ preset }: { preset: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const t = PRESET_TRIANGLES[preset % PRESET_TRIANGLES.length]
    // 场景画布 640x540，坐标基于 600x480，居中偏移
    drawEulerLine(canvas, shift(t.A), shift(t.B), shift(t.C), true)
  }, [preset])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

function shift(p: { x: number; y: number }) {
  return { x: p.x + 40, y: p.y + 40 }
}

export default function EulerLineSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <EulerCanvas preset={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const preset = (scene.lineState?.params?.preset as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <EulerCanvas key={preset} preset={preset} />
}
