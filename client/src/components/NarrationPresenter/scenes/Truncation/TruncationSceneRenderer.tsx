/**
 * 截角变换 讲解场景渲染器
 *
 * 完全复用 lib/drawPolyhedron（经本实验 draw.ts 的薄封装）。
 * 不用 Plotly, 见 draw3d.ts 顶部说明。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawTruncation } from '../../../../experiments/truncation/draw'
import {
  baseSolid, standardTOf, SOLID_IDS, type PlatonicId,
} from '../../../../experiments/truncation/truncation'

const W = 600
const H = 540
const TITLES = {
  'intro-1': { title: '截角变换', subtitle: '削掉顶点，柏拉图立体变成阿基米德立体' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['每个顶点削成一个面', "V′=2E, E′=3E, F′=F+V", '代回欧拉公式仍是 2'],
  'sum-2': ['标准 t = 1/(2+2sin(θ/2))', '三角面才恰好是 1/3', '四边面 0.293，五边面 0.276'],
}

function TruncCanvas({
  solidId, t, showBase,
}: { solidId: PlatonicId; t: number; showBase: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const base = useMemo(() => baseSolid(solidId), [solidId])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawTruncation(canvas, { base, t, showBase, yaw: 0.6 + el * 0.22 })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [base, t, showBase])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function TruncationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return <TruncCanvas solidId="icosahedron" t={1 / 3} showBase={false} />
  }
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="截角变换" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const solidId = (SOLID_IDS as readonly string[]).includes(p.solidId as string)
    ? (p.solidId as PlatonicId)
    : 'icosahedron'
  // 未指定 t 时用该立体的标准值，避免非三角面立体显示成歪的
  const t = typeof p.t === 'number' ? p.t : standardTOf(baseSolid(solidId))
  return (
    <TruncCanvas solidId={solidId} t={t} showBase={p.showBase === true} />
  )
}
