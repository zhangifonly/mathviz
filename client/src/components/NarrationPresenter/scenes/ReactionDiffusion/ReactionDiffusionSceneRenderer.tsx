/**
 * 反应扩散场景渲染器
 * PPT 讲解模式下渲染图案生长动画
 */

import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { createField, step, renderToImageData, RD_PRESETS, type Field } from '../../../../experiments/reaction-diffusion/grayScott'

const W = 200
const H = 150

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '反应扩散与图灵斑图', subtitle: '动物花纹从何而来' },
    'intro-turing': { title: '1952', subtitle: '图灵的形态发生猜想' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '反应扩散', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 公式场景
function FormulaScene({ sceneId }: { sceneId: string }) {
  const content: Record<string, { formula: string; desc: string }> = {
    'model-diffuse': { formula: 'Dᵤ∇²u,  D_v∇²v', desc: '两种化学物扩散' },
    'model-react': { formula: 'U + 2V → 3V', desc: 'V 催化自身增殖' },
    'model-feedkill': { formula: '+f(1−u),  −(f+k)v', desc: 'feed 补给 · kill 移除' },
    'model-eqs': { formula: '∂u/∂t, ∂v/∂t', desc: '两个偏微分方程决定图案' },
    'sum-order': { formula: '扩散 + 反应 → 秩序', desc: '简单规则生出花纹' },
    'sum-turing': { formula: '数学 · 化学 · 生物', desc: '图灵洞见的跨界影响' },
  }
  const { formula, desc } = content[sceneId] || { formula: 'Gray-Scott', desc: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-4xl md:text-6xl font-bold text-indigo-300">{formula}</div>
      <div className="text-2xl text-white/70">{desc}</div>
    </div>
  )
}

export default function ReactionDiffusionSceneRenderer({ scene }: SceneRendererProps) {
  return <SceneBody scene={scene} />
}

// 图案生长模拟（key 切换时重新挂载并重置）
function PatternSim({ presetName }: { presetName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const preset = RD_PRESETS.find((p) => p.name === presetName) ?? RD_PRESETS[0]
    const p = { Du: 0.16, Dv: 0.08, feed: preset.feed, kill: preset.kill }
    let field: Field = createField(W, H)
    const img = ctx.createImageData(W, H)
    let raf = 0
    const loop = () => {
      for (let s = 0; s < 10; s++) field = step(field, p)
      renderToImageData(field, img.data)
      ctx.putImageData(img, 0, 0)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [presetName])

  return (
    <div className="flex items-center justify-center h-full">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="max-w-full max-h-full rounded-lg border border-white/10"
        style={{ imageRendering: 'pixelated', width: '70vmin' }}
      />
    </div>
  )
}

function SceneBody({ scene }: { scene: SceneRendererProps['scene'] }) {
  if (!scene) return <PatternSim presetName="coral" />
  const id = scene.scene.id
  const type = scene.scene.type
  const presetName = (scene.lineState?.params?.preset as string | undefined) ?? 'coral'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'formula' || type === 'summary') return <FormulaScene sceneId={id} />
  return <PatternSim key={presetName} presetName={presetName} />
}
