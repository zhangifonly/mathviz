/**
 * 空间填充多面体 讲解场景渲染器
 *
 * 用 Canvas 2D + 本实验专属的 draw.ts(要画多个副本堆叠, 通用
 * drawPolyhedron 做不到)。不用 Plotly, 见 draw3d.ts 顶部说明。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawSpaceFilling } from '../../../../experiments/space-filling-solids/draw'
import {
  FILL_KINDS, type FillKind,
} from '../../../../experiments/space-filling-solids/spaceFillingSolids'

const W = 640
const H = 540
const TITLES = {
  'intro-1': { title: '空间填充多面体', subtitle: '亚里士多德错了一千八百年' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['判据: 360°/二面角为整数', '五种柏拉图立体只有立方体满足', '平面有三种, 空间只有一种'],
  'sum-2': ['正四面体堆 5 个剩 7.36° 缝', '亚里士多德断言它能填充', '这个错误流传了 1800 年'],
}

function FillCanvas({
  kind, copies, showGap,
}: { kind: FillKind; copies: number; showGap: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawSpaceFilling(canvas, {
        kind,
        copies,
        showTetraGap: showGap,
        faceAlpha: copies > 1 ? 0.88 : 1,
        yaw: 0.6 + el * 0.22,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [kind, copies, showGap])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function SpaceFillingSolidsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <FillCanvas kind="cube" copies={4} showGap={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="空间填充多面体" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const raw = p.kind
  const kind = (FILL_KINDS as readonly string[]).includes(raw as string)
    ? (raw as FillKind)
    : 'cube'
  return (
    <FillCanvas
      kind={kind}
      copies={typeof p.copies === 'number' ? p.copies : 4}
      showGap={p.showGap === true}
    />
  )
}
