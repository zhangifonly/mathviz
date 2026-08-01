/**
 * 平均曲率流 讲解场景渲染器
 *
 * 曲面用 Canvas 2D + lib/draw3d 逐帧演化(不用 Plotly, 见 draw3d.ts 顶部说明)。
 * 演化状态放 ref: 它逐帧累积, 不能每帧从头重算。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawFlow } from '../../../../experiments/mean-curvature-flow/draw'
import {
  initialProfile, stepProfile, INITIAL_SHAPES, PROFILE_POINTS, type ShapeKind,
} from '../../../../experiments/mean-curvature-flow/meanCurvatureFlow'

const W = 640
const H = 540
const DZ = 2 / (PROFILE_POINTS - 1)
const DT = 2e-5
const TITLES: Record<string, { title: string; subtitle: string }> = {
  'intro-1': { title: '平均曲率流', subtitle: '几何中的热方程' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES: Record<string, string[]> = {
  'sum-1': ['每点沿法向移动', '速度等于平均曲率', '几何版的热方程'],
  'sum-2': ['球面自相似收缩 t*=R₀²/4', '圆柱坍塌时刻是两倍', '细腰处形成奇点'],
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const { title, subtitle } = TITLES[sceneId] || { title: '平均曲率流', subtitle: '' }
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

function FlowCanvas({ kind, showMeasure }: { kind: ShapeKind; showMeasure: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ profile: initialProfile(kind), time: 0 })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // 切句换形状时重置演化。改的是 ref 不是 state, 在 effect 里是安全的
    stateRef.current = { profile: initialProfile(kind), time: 0 }
    let raf = 0
    const loop = () => {
      const st = stateRef.current
      for (let k = 0; k < 40; k++) {
        st.profile = stepProfile(st.profile, DZ, DT)
        st.time += DT
      }
      drawFlow(canvas, {
        profile: st.profile, kind, time: st.time, showMeasure,
        yaw: 0.6 + st.time * 3,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [kind, showMeasure])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function MeanCurvatureFlowSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <FlowCanvas kind="dumbbell" showMeasure={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  const raw = p.kind
  const kind = (INITIAL_SHAPES as readonly string[]).includes(raw as string)
    ? (raw as ShapeKind)
    : 'sphere'
  return <FlowCanvas kind={kind} showMeasure={p.showMeasure === true} />
}
