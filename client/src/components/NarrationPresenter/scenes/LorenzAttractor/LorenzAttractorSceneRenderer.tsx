/**
 * 洛伦兹吸引子讲解场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { integrateLorenz, LORENZ_PRESETS } from '../../../../experiments/lorenz-attractor/lorenzAttractor'
import { drawLorenzAttractor } from '../../../../experiments/lorenz-attractor/draw'
import type { Vec3 } from '../../../../experiments/lorenz-attractor/lorenzAttractor'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '洛伦兹吸引子', subtitle: '一只扇动翅膀的数学蝴蝶' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '洛伦兹吸引子', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function FormulaScene({ sceneId }: { sceneId: string }) {
  const eqs: Record<string, string[]> = {
    'eq-vars': ['状态 = (x, y, z)', '随时间 t 连续演化'],
    'eq-xy': ['dx/dt = σ · (y − x)', 'dy/dt = x · (ρ − z) − y'],
    'eq-nonlinear': ['dz/dt = x · y − β · z', 'x·y、x·z 为非线性项'],
  }
  const list = eqs[sceneId] || []
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">洛伦兹方程</h2>
      {list.map((t) => (
        <div key={t} className="text-2xl font-mono text-cyan-300">{t}</div>
      ))}
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-determinism': ['确定的规则', '不可预测的行为', '这就是确定性混沌'],
    'sum-defn': ['有界不发散', '非周期不重复', '对初值敏感依赖'],
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

function LorenzCanvas({ presetId, steps, twin }: { presetId: string; steps: number; twin: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const preset = LORENZ_PRESETS.find((p) => p.id === presetId) ?? LORENZ_PRESETS[0]
    const main = integrateLorenz({ x: 1, y: 1, z: 1 }, preset.params, steps, 0.008)
    const twinTraj: Vec3[] | null = twin
      ? integrateLorenz({ x: 1 + 1e-5, y: 1, z: 1 }, preset.params, steps, 0.008)
      : null
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.008)
      drawLorenzAttractor(canvas, main, progress)
      if (twinTraj) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.globalCompositeOperation = 'lighter'
          drawTwinOverlay(canvas, twinTraj, progress)
          ctx.globalCompositeOperation = 'source-over'
        }
      }
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [presetId, steps, twin])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

/** 叠画第二条轨迹（不清屏，仅描线），用于蝴蝶效应对比 */
function drawTwinOverlay(canvas: HTMLCanvasElement, pts: Vec3[], progress: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx || pts.length < 2) return
  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity
  for (const p of pts) {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.z < minZ) minZ = p.z
    if (p.z > maxZ) maxZ = p.z
  }
  const W = canvas.width
  const H = canvas.height
  const pad = 40
  const spanX = maxX - minX || 1
  const spanZ = maxZ - minZ || 1
  const scale = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanZ)
  const px = (p: Vec3) => pad + (p.x - minX) * scale + (W - 2 * pad - spanX * scale) / 2
  const py = (p: Vec3) => H - pad - (p.z - minZ) * scale - (H - 2 * pad - spanZ * scale) / 2
  const upto = Math.max(2, Math.floor(pts.length * Math.min(1, Math.max(0, progress))))
  ctx.strokeStyle = 'rgba(248, 113, 113, 0.7)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(px(pts[0]), py(pts[0]))
  for (let i = 1; i < upto; i++) ctx.lineTo(px(pts[i]), py(pts[i]))
  ctx.stroke()
}

export default function LorenzAttractorSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <LorenzCanvas presetId="classic" steps={12000} twin={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const presetId = (scene.lineState?.params?.preset as string | undefined) ?? 'classic'
  const steps = (scene.lineState?.params?.steps as number | undefined) ?? 8000
  const twin = Boolean(scene.lineState?.params?.twin)

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'formula') return <FormulaScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <LorenzCanvas key={`${presetId}-${steps}-${twin}`} presetId={presetId} steps={steps} twin={twin} />
}
