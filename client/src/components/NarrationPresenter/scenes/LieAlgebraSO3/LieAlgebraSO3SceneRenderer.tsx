/**
 * 矩阵指数与李代数 so(3) 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawLieAlgebraSO3, type Mode } from '../../../../experiments/lie-algebra-so3/draw'
import type { Vec3 } from '../../../../experiments/lie-algebra-so3/lieAlgebraSO3'

const W = 680
const H = 540
const TITLES = {
  'wh-1': { title: '矩阵指数与李代数 so(3)', subtitle: '无穷小旋转指数出有限旋转' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['so(3) = SO(3) 在单位元的切空间', '即全体反对称矩阵', 'hat 映射：[ω]× v = ω × v'],
  'sum-2': ['K³ = −K，级数每三项折回', '奇次幂→sin，偶次幂→1−cos', 'exp = I + sinθ·K + (1−cosθ)·K²'],
  'sum-3': ['[A,B] = AB − BA 在 so(3) 上就是叉积', '括号非零 ⇔ 旋转不可交换', 'BCH 一阶修正正是 ½[A,B]'],
}

function LACanvas({
  omega, t, mode, terms,
}: { omega: Vec3; t: number; mode: Mode; terms: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawLieAlgebraSO3(canvas, { omega, t, mode, terms })
  }, [omega, t, mode, terms])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

const isVec3 = (v: unknown): v is Vec3 =>
  Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === 'number')

export default function LieAlgebraSO3SceneRenderer({ scene }: SceneRendererProps) {
  const fallback: Vec3 = [0, 0, 1]
  if (!scene) return <LACanvas omega={fallback} t={1.2} mode="exp" terms={4} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="矩阵指数与李代数 so(3)" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const mode: Mode = p.mode === 'series' || p.mode === 'bracket' ? p.mode : 'exp'
  return (
    <LACanvas
      omega={isVec3(p.omega) ? p.omega : fallback}
      t={typeof p.t === 'number' ? p.t : 1.2}
      mode={mode}
      terms={typeof p.terms === 'number' ? p.terms : 4}
    />
  )
}
