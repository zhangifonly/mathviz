/**
 * 科斯塔曲面 讲解场景渲染器
 *
 * 曲面用 Canvas 2D + lib/draw3d 逐帧自转(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawCostaSurface } from '../../../../experiments/costa-surface/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '科斯塔曲面', subtitle: '打破百年信念的第四种' },
    'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '科斯塔曲面', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-1': ['曾被认为只有三种', '平面 · 悬链面 · 螺旋面', '两百多年无新发现'],
    'sum-2': ['1982 年科斯塔给出第四种', '亏格 1 带三个端', '欧拉示性数为 −3'],
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
  neckR: number
  flare: number
}

function SurfaceCanvas({ neckR, flare }: SurfaceProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  // 参数全部进依赖数组: 切句时参数变了要重启动画。
  // 几何量一律在 loop 里按当前帧算, 不缓存任何按参数定尺寸的数组,
  // 避免「实例复用导致尺寸锁死在首次挂载值」那类越界崩溃。
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawCostaSurface(canvas, {
        neckR,
        flare,
        yaw: 0.6 + el * 0.28,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [neckR, flare])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function CostaSurfaceSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SurfaceCanvas neckR={0.55} flare={1.35} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  return (
    <SurfaceCanvas
      neckR={typeof p.neckR === 'number' ? p.neckR : 0.55}
      flare={typeof p.flare === 'number' ? p.flare : 1.35}
    />
  )
}
