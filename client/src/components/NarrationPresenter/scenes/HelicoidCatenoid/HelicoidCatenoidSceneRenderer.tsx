/**
 * 螺旋面与悬链面 讲解场景渲染器
 *
 * 曲面用 Canvas 2D + lib/draw3d 逐帧自转(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawHelicoidCatenoid } from '../../../../experiments/helicoid-catenoid/draw'
import { firstFundamental } from '../../../../experiments/helicoid-catenoid/helicoidCatenoid'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-title': { title: '螺旋面与悬链面', subtitle: '两张极小曲面之间的等距变形' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '极小曲面', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['极小曲面: 平均曲率处处为零', '对应肥皂膜的形状', '面积局部最小'],
    'sum-pair': ['螺旋面: 唯一的极小直纹面', '悬链面: 唯一的极小旋转面', '变形等距, 内蕴度量不变'],
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

interface SurfaceProps {
  theta: number
  morph: boolean
  rulings: boolean
  showForm: boolean
}

function SurfaceCanvas({ theta, morph, rulings, showForm }: SurfaceProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  // theta/morph 都进依赖数组: 切句时参数变了要重启动画。
  // 一切几何量都在 loop 里按当前帧算, 不缓存任何按参数定尺寸的数组,
  // 避免「实例复用导致尺寸锁死在首次挂载值」那类越界崩溃。
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      // morph 时 theta 在 0~PI/2 之间来回摆, 否则固定
      const t = morph
        ? (1 - Math.cos((el / 3) * Math.PI)) / 2 * (Math.PI / 2)
        : theta
      drawHelicoidCatenoid(canvas, {
        theta: t,
        yaw: 0.6 + el * 0.28,
        showRulings: rulings,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [theta, morph, rulings])

  const form = firstFundamental(0.4, 0.3, theta)
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
      {showForm && (
        <div className="text-white/70 text-sm flex gap-5">
          <span>E = {form.E.toFixed(3)}</span>
          <span>F = {form.F.toFixed(3)}</span>
          <span>G = {form.G.toFixed(3)}</span>
        </div>
      )}
    </div>
  )
}

export default function HelicoidCatenoidSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SurfaceCanvas theta={0} morph rulings={false} showForm={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  return (
    <SurfaceCanvas
      theta={typeof p.theta === 'number' ? p.theta : 0}
      morph={p.morph === true}
      rulings={p.rulings === true}
      showForm={p.showForm === true}
    />
  )
}
