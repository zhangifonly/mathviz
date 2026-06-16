/**
 * 欧拉恒等式场景渲染器
 * PPT 讲解模式下渲染复平面旋转可视化
 */

import { useEffect, useRef, useState } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '欧拉恒等式', subtitle: '上帝写下的方程' },
    'intro-five': { title: 'e · i · π · 1 · 0', subtitle: '五大常数齐聚一行' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '欧拉恒等式', subtitle: '' }
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
    'intro-formula': { formula: 'e^{iπ} + 1 = 0', desc: '最美的数学公式' },
    'intro-constants': { formula: 'e · i · π · 1 · 0', desc: '五个最重要的常数' },
    'ef-general': { formula: 'e^{iθ} = cosθ + i·sinθ', desc: '欧拉公式' },
    'ef-bridge': { formula: '指数 ⟷ 三角', desc: '两个世界的桥梁' },
    'rot-identity': { formula: 'e^{iπ} = −1', desc: '两边加 1 即得恒等式' },
    'sum-rotation': { formula: 'e^{iθ}: 单位圆旋转', desc: '复指数的几何意义' },
    'sum-identity': { formula: 'e^{iπ} + 1 = 0', desc: '简洁中的深刻' },
  }
  const { formula, desc } = content[sceneId] || { formula: 'e^{iπ}+1=0', desc: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-5xl md:text-7xl font-bold text-indigo-300">{formula}</div>
      <div className="text-2xl text-white/70">{desc}</div>
    </div>
  )
}

export default function EulerIdentitySceneRenderer({ scene }: SceneRendererProps) {
  return <SceneBody scene={scene} />
}

// 复平面旋转可视化
function CirclePlot({ theta, animate, highlightMinusOne }: { theta: number; animate?: boolean; highlightMinusOne?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [angle, setAngle] = useState(theta)

  useEffect(() => { setAngle(theta) }, [theta])

  useEffect(() => {
    if (!animate) return
    let raf = 0
    const tick = () => {
      setAngle((a) => (a + 0.015 > Math.PI * 2 ? 0 : a + 0.015))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2
    const R = Math.min(W, H) * 0.36
    ctx.fillStyle = '#0a0f1e'
    ctx.fillRect(0, 0, W, H)

    // 坐标轴
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke()

    // 单位圆
    ctx.strokeStyle = 'rgba(203,213,225,0.5)'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke()

    // 已扫过的弧
    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 4
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, -angle, true); ctx.stroke()

    // −1 点高亮
    if (highlightMinusOne) {
      ctx.fillStyle = 'rgba(239,68,68,0.9)'
      ctx.beginPath(); ctx.arc(cx - R, cy, 10, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#fca5a5'
      ctx.font = 'bold 20px sans-serif'
      ctx.fillText('−1', cx - R - 12, cy + 35)
    }

    // 当前向量 e^(iθ)
    const px = cx + R * Math.cos(angle)
    const py = cy - R * Math.sin(angle)
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke()

    // 投影线
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = '#10b981'
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke()
    ctx.strokeStyle = '#f59e0b'
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, py); ctx.stroke()
    ctx.setLineDash([])

    // 端点
    ctx.fillStyle = '#ef4444'
    ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill()

    // 标签
    ctx.fillStyle = 'white'
    ctx.font = '18px sans-serif'
    ctx.fillText(`θ = ${(angle / Math.PI).toFixed(2)}π`, 20, 30)
    ctx.fillStyle = '#10b981'
    ctx.fillText(`cosθ = ${Math.cos(angle).toFixed(3)}`, 20, 56)
    ctx.fillStyle = '#f59e0b'
    ctx.fillText(`sinθ = ${Math.sin(angle).toFixed(3)}`, 20, 80)
  }, [angle, highlightMinusOne])

  return (
    <div className="flex items-center justify-center h-full">
      <canvas ref={canvasRef} width={640} height={560} className="max-w-full max-h-full rounded-lg border border-white/10" />
    </div>
  )
}

function SceneBody({ scene }: { scene: SceneRendererProps['scene'] }) {
  if (!scene) return <CirclePlot theta={Math.PI} />
  const id = scene.scene.id
  const type = scene.scene.type
  const theta = (scene.lineState?.params?.theta as number | undefined) ?? Math.PI
  const animate = Boolean(scene.lineState?.params?.animate)
  const highlightMinusOne = Boolean(scene.lineState?.highlight?.includes('minusOne'))

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'formula' || type === 'summary') return <FormulaScene sceneId={id} />
  return <CirclePlot theta={theta} animate={animate} highlightMinusOne={highlightMinusOne} />
}
