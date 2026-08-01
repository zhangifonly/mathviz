/**
 * 球面三角形 讲解场景渲染器
 *
 * 球面用 Canvas 2D + lib/drawSphere 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawSphereScene } from '../../../../lib/drawSphere'
import { sphericalExcess, triangleAngles } from '../../../../lib/sphere3d'
import {
  scaledTriangle, infoOf, TRIANGLE_KINDS, type TriangleKind,
} from '../../../../experiments/spherical-triangle/sphericalTriangle'

const W = 640
const H = 540
const DEG = 180 / Math.PI
const TITLES = {
  'intro-1': { title: '球面三角形', subtitle: '内角和大于一百八十度' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['直线换成大圆', '平行公理不成立', '任两大圆必相交'],
  'sum-2': ['吉拉尔定理: 面积 = 球面盈余', '角度决定形状也决定大小', '故不存在相似三角形'],
}

function SphereCanvas({ kind, scale }: { kind: TriangleKind; scale: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const tri = useMemo(() => scaledTriangle(kind, scale), [kind, scale])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      const sum = triangleAngles(tri).reduce((a, b) => a + b, 0)
      drawSphereScene(canvas, {
        title: infoOf(kind).label,
        subtitle: `内角和 ${(sum * DEG).toFixed(2)}° · 盈余 ${sphericalExcess(tri).toFixed(4)}`,
        triangle: tri,
        labels: ['A', 'B', 'C'],
        readout: `面积占球面 ${((sphericalExcess(tri) / (4 * Math.PI)) * 100).toFixed(2)}%`,
        yaw: 0.6 + el * 0.2,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [tri, kind])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SphericalTriangleSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SphereCanvas kind="octant" scale={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="球面三角形" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const raw = p.kind
  const kind = (TRIANGLE_KINDS as readonly string[]).includes(raw as string)
    ? (raw as TriangleKind)
    : 'octant'
  const scale = typeof p.scale === 'number' ? Math.max(0.05, Math.min(1, p.scale)) : 1
  return <SphereCanvas kind={kind} scale={scale} />
}
