/**
 * Descartes 角亏定理 讲解场景渲染器
 *
 * 复用 lib/drawPolyhedron（经本实验的 draw.ts 薄封装）。
 * 不用 Plotly, 见 draw3d.ts 顶部说明。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawDescartes } from '../../../../experiments/descartes-defect/draw'
import {
  solidOf, allDefects, totalDefect, SOLID_IDS, type PlatonicId,
} from '../../../../experiments/descartes-defect/descartesDefect'

const W = 600
const H = 540
const DEG = 180 / Math.PI
const TITLES = {
  'intro-1': {
    title: 'Descartes 角亏定理',
    subtitle: '所有顶点的角亏加起来永远是 4π',
  },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['δ = 2π − 顶点处面角和', '凸多面体上恒为正', '这就是合不拢的那部分'],
  'sum-2': ['Σδ = 4π 恒成立', '与顶点个数、形状都无关', '等价于欧拉公式'],
}

function DefectCanvas({
  solidId, showDefects, faceAlpha,
}: { solidId: PlatonicId; showDefects: boolean; faceAlpha: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const poly = useMemo(() => solidOf(solidId), [solidId])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawDescartes(canvas, {
        poly, showDefects, faceAlpha,
        title: poly.name,
        subtitle: `${poly.vertices.length} 顶点 × ${(allDefects(poly)[0] * DEG).toFixed(1)}° = ${(totalDefect(poly) / Math.PI).toFixed(2)}π`,
        yaw: 0.6 + el * 0.22,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [poly, showDefects, faceAlpha])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function DescartesDefectSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return <DefectCanvas solidId="cube" showDefects faceAlpha={0.5} />
  }
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="Descartes 角亏定理" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const solidId = (SOLID_IDS as readonly string[]).includes(p.solidId as string)
    ? (p.solidId as PlatonicId)
    : 'cube'
  return (
    <DefectCanvas
      solidId={solidId}
      showDefects={p.showDefects !== false}
      faceAlpha={typeof p.faceAlpha === 'number' ? p.faceAlpha : 0.5}
    />
  )
}
