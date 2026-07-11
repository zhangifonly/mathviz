/**
 * 施密特正交化场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { EXAMPLE_OPTIONS } from '../../../../experiments/gram-schmidt/gramSchmidt'
import { drawGramSchmidt } from '../../../../experiments/gram-schmidt/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '施密特正交化', subtitle: '把任意一组基变成标准正交基' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '施密特正交化', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function FormulaScene() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-white">
      <h2 className="text-2xl font-bold">正交投影公式</h2>
      <div className="text-3xl font-mono bg-white/5 px-8 py-6 rounded-xl border border-white/10">
        proj<sub>u</sub>(v) = (v · u) / (u · u) · u
      </div>
      <p className="text-lg text-white/70">u₂ = v₂ − proj<sub>u₁</sub>(v₂)，与 u₁ 垂直</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['减去在前面向量上的投影', '剩余部分必与它们垂直', '第一个向量原样保留'],
    'sum-normal': ['再除以模长完成单位化', '得到标准正交基', '最小二乘 / QR 分解的基石'],
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

function GSCanvas({ example }: { example: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const opt = EXAMPLE_OPTIONS.find((o) => o.id === example) ?? EXAMPLE_OPTIONS[0]
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawGramSchmidt(canvas, opt.vectors, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [example])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function GramSchmidtSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GSCanvas example="classic" />
  const id = scene.scene.id
  const type = scene.scene.type
  const example = (scene.lineState?.params?.example as string | undefined) ?? 'classic'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  if (type === 'formula') return <FormulaScene />
  return <GSCanvas key={example} example={example} />
}
