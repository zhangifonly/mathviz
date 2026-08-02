/**
 * 双曲三角形与角亏 讲解场景渲染器
 *
 * 画在庞加莱圆盘里, 用本实验专属的 draw.ts。双曲图是静态的, 无需逐帧动画。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawHyperbolic } from '../../../../experiments/hyperbolic-triangle/draw'
import {
  triangleOf, angleSum, angularDefect, areaFraction,
} from '../../../../experiments/hyperbolic-triangle/hyperbolicTriangle'

const W = 560
const H = 540
const DEG = 180 / Math.PI
const TITLES = {
  'intro-1': { title: '双曲三角形与角亏', subtitle: '面积竟然有上界' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['内角和小于 180°', '不足的部分叫角亏', '数值上等于面积'],
  'sum-2': ['面积有上界 π', '三角趋于 0 时逼近', '但永不达到'],
}

function DiskCanvas({ scale, showGrid }: { scale: number; showGrid: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const tri = useMemo(() => triangleOf(scale), [scale])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawHyperbolic(canvas, {
      triangle: tri,
      showGrid,
      showAngles: true,
      title: '庞加莱圆盘中的双曲三角形',
      subtitle: `内角和 ${(angleSum(tri) * DEG).toFixed(2)}° · 角亏 ${angularDefect(tri).toFixed(4)}`,
      readout: `面积占上界 π 的 ${(areaFraction(tri) * 100).toFixed(1)}%`,
    })
  }, [tri, showGrid])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function HyperbolicTriangleSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DiskCanvas scale={0.5} showGrid />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="双曲三角形与角亏" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <DiskCanvas
      scale={typeof p.scale === 'number' ? p.scale : 0.5}
      showGrid={p.showGrid !== false}
    />
  )
}
