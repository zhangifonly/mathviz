/**
 * 立体角与球面度 讲解场景渲染器
 *
 * 用 Canvas 2D + 本实验专属的 draw.ts(要画射线+球面片+对照圆锥)。
 * 不用 Plotly, 见 draw3d.ts 顶部说明。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawSolidAngle } from '../../../../experiments/solid-angle/draw'
import {
  presetOf, triangleSolidAngle, solidFraction, PRESETS, type PresetId,
} from '../../../../experiments/solid-angle/solidAngle'

const W = 600
const H = 540
const TITLES = {
  'intro-1': { title: '立体角与球面度', subtitle: '三维的角度怎么量' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['平面角 = 弧长/r，整圈 2π', '立体角 = 球面面积/r²', '全空间 4π 球面度'],
  'sum-2': ['公式的分子是三重积', '球面盈余法给出同一个数', '两种算法交叉验证'],
}

function SolidCanvas({
  presetId, showCone,
}: { presetId: PresetId; showCone: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { a, b, c } = useMemo(() => presetOf(presetId), [presetId])
  const label = PRESETS.find((p) => p.id === presetId)?.label ?? ''

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      const omega = triangleSolidAngle(a, b, c)
      drawSolidAngle(canvas, {
        a, b, c,
        showCone,
        title: `${label} · Ω = ${omega.toFixed(4)} sr`,
        subtitle: `占全空间 4π 的 ${(solidFraction(omega) * 100).toFixed(2)}%`,
        yaw: 0.6 + el * 0.22,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [a, b, c, showCone, label])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SolidAngleSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SolidCanvas presetId="octant" showCone={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="立体角与球面度" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const raw = p.presetId
  const presetId = (PRESETS.map((x) => x.id) as readonly string[]).includes(raw as string)
    ? (raw as PresetId)
    : 'octant'
  return <SolidCanvas presetId={presetId} showCone={p.showCone === true} />
}
