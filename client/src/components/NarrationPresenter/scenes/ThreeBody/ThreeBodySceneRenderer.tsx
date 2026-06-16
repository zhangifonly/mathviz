/**
 * 三体引力轨道场景渲染器
 * PPT 讲解模式下渲染引力模拟动画
 */

import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { stepVerlet, type Body } from '../../../../experiments/three-body/physics'
import { PRESETS, clonePreset, BODY_COLORS } from '../../../../experiments/three-body/presets'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '三体引力轨道', subtitle: '混沌之舞' },
    'intro-chaos': { title: '三体问题', subtitle: '困扰数学家三百年' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '三体引力轨道', subtitle: '' }
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
    'grav-law': { formula: 'F = G·m₁m₂/r²', desc: '万有引力定律' },
    'grav-explain': { formula: 'F ∝ m₁m₂,  F ∝ 1/r²', desc: '正比质量，反比距离平方' },
    'sum-gravity': { formula: 'F = G·m₁m₂/r²', desc: '一切运动的根源' },
    'sum-chaos': { formula: '混沌 + 8字周期解', desc: '简单定律，无穷复杂' },
  }
  const { formula, desc } = content[sceneId] || { formula: 'F = G·m₁m₂/r²', desc: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-4xl md:text-6xl font-bold text-indigo-300">{formula}</div>
      <div className="text-2xl text-white/70">{desc}</div>
    </div>
  )
}

export default function ThreeBodySceneRenderer({ scene }: SceneRendererProps) {
  return <SceneBody scene={scene} />
}

// 引力模拟动画
function OrbitSim({ presetName }: { presetName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const presetNameRef = useRef(presetName)

  // 在 effect 中同步最新 presetName（避免 render 期间写 ref）
  useEffect(() => {
    presetNameRef.current = presetName
  }, [presetName])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height
    const SCALE = 68

    let preset = PRESETS.find((p) => p.name === presetNameRef.current) ?? PRESETS[0]
    let bodies: Body[] = clonePreset(preset)
    let trails: { x: number; y: number }[][] = preset.bodies.map(() => [])
    let lastName = presetNameRef.current
    const cfg = { G: preset.G, softening: 0.05 }
    let raf = 0

    const draw = () => {
      // 切换构型时重置
      if (presetNameRef.current !== lastName) {
        preset = PRESETS.find((p) => p.name === presetNameRef.current) ?? PRESETS[0]
        bodies = clonePreset(preset)
        trails = preset.bodies.map(() => [])
        cfg.G = preset.G
        lastName = presetNameRef.current
      }
      for (let s = 0; s < 4; s++) bodies = stepVerlet(bodies, 0.005, cfg)
      bodies.forEach((b, i) => {
        trails[i].push({ x: b.x, y: b.y })
        if (trails[i].length > 500) trails[i].shift()
      })

      ctx.fillStyle = '#0a0f1e'
      ctx.fillRect(0, 0, W, H)
      const cx = W / 2
      const cy = H / 2
      // 轨迹
      trails.forEach((trail, i) => {
        ctx.strokeStyle = BODY_COLORS[i] + '99'
        ctx.lineWidth = 2
        ctx.beginPath()
        trail.forEach((p, k) => {
          const px = cx + p.x * SCALE
          const py = cy - p.y * SCALE
          if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
        })
        ctx.stroke()
      })
      // 天体
      bodies.forEach((b, i) => {
        const px = cx + b.x * SCALE
        const py = cy - b.y * SCALE
        const r = 5 + Math.sqrt(b.mass) * 3
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 2.2)
        grad.addColorStop(0, BODY_COLORS[i])
        grad.addColorStop(1, BODY_COLORS[i] + '00')
        ctx.fillStyle = grad
        ctx.beginPath(); ctx.arc(px, py, r * 2.2, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = BODY_COLORS[i]
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="flex items-center justify-center h-full">
      <canvas ref={canvasRef} width={720} height={560} className="max-w-full max-h-full rounded-lg border border-white/10" />
    </div>
  )
}

function SceneBody({ scene }: { scene: SceneRendererProps['scene'] }) {
  if (!scene) return <OrbitSim presetName="figure8" />
  const id = scene.scene.id
  const type = scene.scene.type
  const presetName = (scene.lineState?.params?.preset as string | undefined) ?? 'chaos'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'formula' || type === 'summary') return <FormulaScene sceneId={id} />
  return <OrbitSim key={presetName} presetName={presetName} />
}
