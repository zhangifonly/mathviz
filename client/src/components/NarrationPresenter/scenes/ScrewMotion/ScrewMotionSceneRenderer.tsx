/**
 * 螺旋运动与 Chasles 定理 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawScrewMotion } from '../../../../experiments/screw-motion/draw'
import { PRESETS, type Vec3 } from '../../../../experiments/screw-motion/screwMotion'

const W = 680
const H = 560
const TITLES = {
  'cl-1': { title: '螺旋运动与 Chasles 定理', subtitle: '任何刚体运动都是绕一条轴的“拧螺丝”' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['任何刚体运动 = 一个螺旋运动', '绕某条轴转 θ，同时沿这条轴移 d', '这就是 Chasles 定理'],
  'sum-2': ['把平移对轴分解成两部分', '沿轴的消不掉 → 螺距 d', '垂直的靠把轴平移到合适位置消掉'],
  'sum-3': ['轴上的点只沿轴平移，轨迹是直线段', '其余的点走螺旋线', '螺距处处相同，与看哪个点无关'],
}

function SMCanvas({
  presetId, u, showTrails, showDecomp,
}: { presetId: string; u: number; showTrails: boolean; showDecomp: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const p = PRESETS.find((x) => x.id === presetId) ?? PRESETS[0]
    drawScrewMotion(canvas, {
      axis: p.axis as Vec3, theta: p.theta, t: p.t as Vec3,
      u, showTrails, showDecomp,
    })
  }, [presetId, u, showTrails, showDecomp])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function ScrewMotionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SMCanvas presetId="general" u={0.45} showTrails showDecomp />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="螺旋运动与 Chasles 定理" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <SMCanvas
      presetId={typeof p.presetId === 'string' ? p.presetId : 'general'}
      u={typeof p.u === 'number' ? p.u : 0.45}
      showTrails={p.showTrails !== false}
      showDecomp={p.showDecomp === true}
    />
  )
}
