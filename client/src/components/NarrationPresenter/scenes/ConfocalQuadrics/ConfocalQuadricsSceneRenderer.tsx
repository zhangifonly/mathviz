/**
 * 共焦二次曲面 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d/draw3d），不用 WebGL——
 * 讲解层同时可能有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawConfocalQuadrics } from '../../../../experiments/confocal-quadrics/draw'

const W = 660
const H = 560
const TITLES = {
  'fa-1': { title: '共焦二次曲面', subtitle: '空间中每一点，都有三张互相垂直的曲面穿过' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['x²/(a²−λ)+y²/(b²−λ)+z²/(c²−λ)=1', 'λ<c² 椭球，c²<λ<b² 单叶', 'b²<λ<a² 双叶，λ>a² 无实点'],
  'sum-2': ['过任一点恰有三张共焦曲面', '一种一张，不多不少', '而且三张两两正交 —— Jacobi 定理'],
  'sum-3': ['平面上过一点只有两条共焦曲线', '三张曲面两两正交', '只有在空间里才看得见'],
}

type Triple = [number, number, number]
type Flags = [boolean, boolean, boolean]

function CQCanvas({
  point, yaw, pitch, show, showNormals, alpha,
}: { point: Triple; yaw: number; pitch: number; show: Flags; showNormals: boolean; alpha: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawConfocalQuadrics(canvas, { point, yaw, pitch, show, showNormals, alpha })
  }, [point, yaw, pitch, show, showNormals, alpha])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

const isTriple = (v: unknown): v is Triple =>
  Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === 'number')

const isFlags = (v: unknown): v is Flags =>
  Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === 'boolean')

export default function ConfocalQuadricsSceneRenderer({ scene }: SceneRendererProps) {
  const fallback: Triple = [1.2, 0.9, 0.6]
  if (!scene) {
    return <CQCanvas point={fallback} yaw={0.7} pitch={0.45} show={[true, true, true]} showNormals alpha={0.5} />
  }
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="共焦二次曲面" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <CQCanvas
      point={isTriple(p.point) ? p.point : fallback}
      yaw={typeof p.yaw === 'number' ? p.yaw : 0.7}
      pitch={typeof p.pitch === 'number' ? p.pitch : 0.45}
      show={isFlags(p.show) ? p.show : [true, true, true]}
      showNormals={p.showNormals !== false}
      alpha={typeof p.alpha === 'number' ? p.alpha : 0.5}
    />
  )
}
