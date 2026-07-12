/**
 * L-系统植物场景渲染器
 */
import { useEffect, useRef, useMemo } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { expand, turtle, PRESETS, type PresetKey } from '../../../../experiments/l-system/lsystem'
import { drawLSystem } from '../../../../experiments/l-system/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'L-系统植物', subtitle: '几条规则长出整株分形植物' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'L-系统', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['公理 + 重写规则', '海龟作图变成图形', 'F 前进，+- 转向'],
    'sum-recur': ['括号 [] 实现分叉', '递归带来自相似', '简单规则孕育复杂之美'],
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

function LSystemCanvas({ preset }: { preset: PresetKey }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const segs = useMemo(() => {
    const { sys } = PRESETS[preset]
    return turtle(expand(sys.axiom, sys.rules, sys.iterations), sys.angle, 5)
  }, [preset])
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const greenish = preset === 'plant'
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.015)
      drawLSystem(canvas, segs, progress, greenish)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [segs, preset])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={640} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function LSystemSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <LSystemCanvas preset="plant" />
  const id = scene.scene.id
  const type = scene.scene.type
  const preset = (scene.lineState?.params?.preset as PresetKey | undefined) ?? 'plant'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <LSystemCanvas key={preset} preset={preset} />
}
