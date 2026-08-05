/**
 * Dandelin 双球 讲解场景渲染器
 *
 * 圆锥 + 双球 + 椭圆 + 证明线段，用本实验专属的 draw.ts。
 * 自转动画，所以要 requestAnimationFrame。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawDandelin } from '../../../../experiments/dandelin/draw'
import {
  presetOf, eccentricity, isEllipse, PRESETS, type PresetId,
} from '../../../../experiments/dandelin/dandelin'

const W = 640
const H = 540
const DEG = 180 / Math.PI
const IDS: readonly string[] = PRESETS.map((p) => p.id)
const TITLES = {
  'q-1': { title: 'Dandelin 双球', subtitle: '为什么斜切圆锥得到的是椭圆' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['圆锥内塞两个球', '同时与锥面、切平面相切', '与平面的切点就是焦点'],
  'sum-2': ['切线段等长是唯一引理', 'PF₁+PF₂ = T₁T₂', '而这段与母线选择无关'],
}

function DandelinCanvas({
  presetId, phi, showProof, showSpheres,
}: {
  presetId: PresetId; phi: number; showProof: boolean; showSpheres: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const cut = useMemo(() => presetOf(presetId), [presetId])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawDandelin(canvas, {
        cut, phi, showProof, showSpheres,
        yaw: 0.7 + el * 0.16,
        subtitle: isEllipse(cut)
          ? `α=${(cut.alpha * DEG).toFixed(0)}° θ=${(cut.theta * DEG).toFixed(0)}° · 离心率 ${eccentricity(cut).toFixed(4)}`
          : '',
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [cut, phi, showProof, showSpheres])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function DandelinSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return <DandelinCanvas presetId="strong" phi={0.6} showProof showSpheres />
  }
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="Dandelin 双球" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const presetId = IDS.includes(p.presetId as string)
    ? (p.presetId as PresetId)
    : 'strong'
  return (
    <DandelinCanvas
      presetId={presetId}
      phi={typeof p.phi === 'number' ? p.phi : 0.6}
      showProof={p.showProof !== false}
      showSpheres={p.showSpheres !== false}
    />
  )
}
