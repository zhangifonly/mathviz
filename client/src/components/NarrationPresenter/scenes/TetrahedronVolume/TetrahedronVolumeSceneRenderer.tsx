/**
 * 四面体体积与三重积 讲解场景渲染器
 *
 * 用 Canvas 2D + 本实验专属的 draw.ts(要同时画六面体与其中的四面体,
 * 通用 drawPolyhedron 做不到)。不用 Plotly, 见 draw3d.ts 顶部说明。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawTetra } from '../../../../experiments/tetrahedron-volume/draw'
import {
  presetOf, tripleProduct, tetrahedronVolume, PRESETS, type PresetId,
} from '../../../../experiments/tetrahedron-volume/tetrahedronVolume'

const W = 600
const H = 540
const TITLES = {
  'intro-1': { title: '四面体体积与三重积', subtitle: '行列式的立体版本' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['平行六面体体积 = |det|', '四面体是它的 1/6', '三重积就是三阶行列式'],
  'sum-2': ['那个 6 就是 3!', 'n 维单纯形除 n!', '二维除 2, 四维除 24'],
}

function TetraCanvas({
  presetId, showBox, showSix,
}: { presetId: PresetId; showBox: boolean; showSix: boolean }) {
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
      drawTetra(canvas, {
        a, b, c,
        showParallelepiped: showBox,
        showSixParts: showSix,
        title: `${label} · det = ${tripleProduct(a, b, c).toFixed(4)}`,
        subtitle: `四面体体积 ${tetrahedronVolume(a, b, c).toFixed(4)} = |det| / 6`,
        yaw: 0.6 + el * 0.22,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [a, b, c, showBox, showSix, label])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function TetrahedronVolumeSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TetraCanvas presetId="unit" showBox showSix={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="四面体体积与三重积" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const raw = p.presetId
  const presetId = (PRESETS.map((x) => x.id) as readonly string[]).includes(raw as string)
    ? (raw as PresetId)
    : 'unit'
  return (
    <TetraCanvas
      presetId={presetId}
      showBox={p.showBox !== false}
      showSix={p.showSix === true}
    />
  )
}
