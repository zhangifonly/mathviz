/**
 * 托马斯吸引子 讲解场景渲染器
 *
 * 轨道用 Canvas 2D + lib/drawAttractor 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 * ⚠️ 轨道按参数 useMemo 缓存: RK4 跑上万步, 每帧重算会卡。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawOrbit } from '../../../../lib/drawAttractor'
import { orbit } from '../../../../lib/attractor3d'
import { thomasField, START } from '../../../../experiments/thomas-attractor/thomasAttractor'

const W = 640
const H = 540
const TITLES: Record<string, { title: string; subtitle: string }> = {
  'intro-1': { title: '托马斯吸引子', subtitle: '一个参数走完全部路径' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES: Record<string, string[]> = {
  'sum-1': ['正弦循环耦合', '阻尼 b 控制全局行为', '驱动与阻尼的拉锯'],
  'sum-2': ['b 大: 不动点', 'b 中: 极限环', 'b 小: 混沌'],
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const { title, subtitle } = TITLES[sceneId] || { title: '托马斯吸引子', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">回顾</h2>
      {(SUMMARIES[sceneId] || []).map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
    </div>
  )
}

function OrbitCanvas({ b, showDiag }: { b: number; showDiag: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const field = useMemo(() => thomasField(b), [b])
  const pts = useMemo(
    () => orbit(field, { start: START, dt: 0.01, steps: 20000, skip: 5000 }),
    [field],
  )

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawOrbit(canvas, pts, {
        title: '托马斯吸引子',
        paramLabel: '阻尼 b = ' + b.toFixed(3),
        ramp: 'ocean',
        yaw: 0.6 + el * 0.2,
        progress: Math.min(1, el / 3),
        field: showDiag ? field : undefined,
        start: showDiag ? START : undefined,
        showDiagnostics: showDiag,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [pts, field, b, showDiag])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function ThomasAttractorSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <OrbitCanvas b={0.208186} showDiag={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  return (
    <OrbitCanvas
      b={typeof p.b === 'number' ? p.b : 0.208186}
      showDiag={p.showDiag === true}
    />
  )
}
