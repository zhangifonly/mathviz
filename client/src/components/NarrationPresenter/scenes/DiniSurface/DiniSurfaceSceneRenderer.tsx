/**
 * 迪尼曲面 讲解场景渲染器
 *
 * 曲面用 Canvas 2D + lib/draw3d 逐帧自转(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawDiniSurface } from '../../../../experiments/dini-surface/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '迪尼曲面', subtitle: '螺旋的常负曲率曲面' },
    'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '迪尼曲面', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-1': ['伪球面母线边转边升', '扫出螺旋曲面', '像无限延伸的海螺'],
    'sum-2': ['K = -1/(a²+b²)', '与位置无关', 'b=0 退化为伪球面'],
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
  a: number
  b: number
}

function SurfaceCanvas({ a, b }: SurfaceProps) {
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
      drawDiniSurface(canvas, {
        a,
        b,
        yaw: 0.6 + el * 0.28,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [a, b])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function DiniSurfaceSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SurfaceCanvas a={1} b={0.2} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  return (
    <SurfaceCanvas
      a={typeof p.a === 'number' ? p.a : 1}
      b={typeof p.b === 'number' ? p.b : 0.2}
    />
  )
}
