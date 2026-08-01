/**
 * 斯普罗特极简吸引子 讲解场景渲染器
 *
 * 轨道用 Canvas 2D + lib/drawAttractor 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 * ⚠️ 轨道按 case 缓存: RK4 跑上万步, 每帧重算会卡。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawOrbit } from '../../../../lib/drawAttractor'
import { orbit } from '../../../../lib/attractor3d'
import {
  sprottField, startOf, infoOf, CASES, type SprottCase,
} from '../../../../experiments/sprott-attractor/sprottAttractor'

const W = 640
const H = 540
const TITLES: Record<string, { title: string; subtitle: string }> = {
  'intro-1': { title: '斯普罗特极简吸引子', subtitle: '混沌最少需要几项' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES: Record<string, string[]> = {
  'sum-1': ['计算机穷举所有三维二次系统', '五项方程足以产生混沌', '比洛伦兹少两项'],
  'sum-2': ['Case A 散度时间平均为零', '是保守系统却依然混沌', '耗散与混沌相互独立'],
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const { title, subtitle } = TITLES[sceneId] || { title: '斯普罗特吸引子', subtitle: '' }
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

function OrbitCanvas({ kind, showDiag }: { kind: SprottCase; showDiag: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const field = useMemo(() => sprottField(kind), [kind])
  const pts = useMemo(
    () => orbit(field, { start: startOf(kind), dt: 0.005, steps: 14000, skip: 3000 }),
    [field, kind],
  )

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawOrbit(canvas, pts, {
        title: `Sprott ${kind}`,
        paramLabel: infoOf(kind).equations,
        ramp: 'viridis',
        yaw: 0.6 + el * 0.2,
        progress: Math.min(1, el / 3),
        field: showDiag ? field : undefined,
        start: showDiag ? startOf(kind) : undefined,
        showDiagnostics: showDiag,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [pts, field, kind, showDiag])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SprottAttractorSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <OrbitCanvas kind="A" showDiag={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  const raw = p.kind
  const kind = (CASES as readonly string[]).includes(raw as string)
    ? (raw as SprottCase)
    : 'A'
  return <OrbitCanvas kind={kind} showDiag={p.showDiag === true} />
}
