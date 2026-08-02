/**
 * 球面二角形 讲解场景渲染器
 *
 * 球面用 Canvas 2D + lib/drawSphere 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 * 场景构造与实验页共用 experiments/.../scene.ts。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawSphereScene } from '../../../../lib/drawSphere'
import { buildScene, type LuneMode } from '../../../../experiments/spherical-lune/scene'

const W = 640
const H = 540
const TITLES = {
  'intro-1': { title: '球面二角形', subtitle: '平面上不存在的图形' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['两个大圆交于对径两点', '夹出只有两条边的二角形', '平面上没有这种图形'],
  'sum-2': ['面积 = 2α', '一步比例即可推出', '面积/4π = α/2π'],
}

function LuneCanvas({
  mode, alpha, n, latDeg,
}: { mode: LuneMode; alpha: number; n: number; latDeg: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const scene = useMemo(
    () => buildScene(mode, alpha, n, latDeg),
    [mode, alpha, n, latDeg],
  )

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawSphereScene(canvas, {
        title: scene.title,
        subtitle: scene.subtitle,
        readout: scene.readout,
        patches: scene.patches,
        paths: scene.paths,
        markers: scene.markers,
        greatCircles: scene.greatCircles,
        yaw: 0.6 + el * 0.2,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [scene])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SphericalLuneSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return <LuneCanvas mode="lune" alpha={Math.PI / 2} n={5} latDeg={35} />
  }
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="球面二角形" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <LuneCanvas
      mode={p.mode === 'polygon' ? 'polygon' : 'lune'}
      alpha={typeof p.alpha === 'number' ? p.alpha : Math.PI / 2}
      n={typeof p.n === 'number' ? p.n : 5}
      latDeg={typeof p.latDeg === 'number' ? p.latDeg : 35}
    />
  )
}
