/**
 * 球面镶嵌 讲解场景渲染器
 *
 * 球面用 Canvas 2D + lib/drawSphere 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawSphereScene, type SphericalPatch } from '../../../../lib/drawSphere'
import { rampColor } from '../../../../lib/proj3d'
import {
  sphericalVertices, tilingFaces, totalArea, infoOf, TILING_KINDS,
  type TilingKind,
} from '../../../../experiments/spherical-tiling/sphericalTiling'

const W = 640
const H = 540
const TITLES = {
  'intro-1': { title: '球面镶嵌', subtitle: '一个不等式划分三种几何' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['顶点推到外接球面', '棱换成大圆弧', '五种正规球面镶嵌'],
  'sum-2': ['面积之和精确等于 4π', '这是数据自洽的强判据', '误差在 1e-15 量级'],
}

function TilingCanvas({ kind }: { kind: TilingKind }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const patches = useMemo<SphericalPatch[]>(() => {
    const verts = sphericalVertices(kind)
    const faces = tilingFaces(kind)
    return faces.map((ring, i) => ({
      vertices: ring.map((vi) => verts[vi]),
      fill: rampColor(i / Math.max(1, faces.length - 1), 'viridis', 0.85),
    }))
  }, [kind])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      const info = infoOf(kind)
      drawSphereScene(canvas, {
        title: `${info.schlafli} ${info.label}`,
        subtitle: info.note,
        patches,
        showGrid: false,
        showVertices: true,
        readout: `总面积 ${totalArea(kind).toFixed(4)} = 4π`,
        yaw: 0.6 + el * 0.2,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [patches, kind])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SphericalTilingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TilingCanvas kind="dodecahedron" />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="球面镶嵌" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const raw = p.kind
  const kind = (TILING_KINDS as readonly string[]).includes(raw as string)
    ? (raw as TilingKind)
    : 'dodecahedron'
  return <TilingCanvas kind={kind} />
}
