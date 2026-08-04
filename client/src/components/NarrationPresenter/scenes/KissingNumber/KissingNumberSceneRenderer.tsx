/**
 * 接吻数问题 讲解场景渲染器
 *
 * 用 Canvas 2D + 本实验专属的 draw.ts(球体按深度排序 + 球冠 + 空位探针)。
 * 不用 Plotly, 见 draw3d.ts 顶部说明。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawKissing } from '../../../../experiments/kissing-number/draw'
import {
  arrangementOf, minPairAngle, ARRANGEMENTS, type ArrangementId,
} from '../../../../experiments/kissing-number/kissingNumber'

const W = 600
const H = 540
const DEG = 180 / Math.PI
const TITLES = {
  'intro-1': { title: '接吻数问题', subtitle: '牛顿说 12，格雷戈里说 13' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['球面上放点，两两 ≥ 60°', '三维答案是 12', '1953 年才严格证明'],
  'sum-2': ['12 球只覆盖球面 80%', '剩两成空隙看着够用', '但零碎凑不成一整块'],
}

function KissingCanvas({
  arrId, showCaps, showGap,
}: { arrId: ArrangementId; showCaps: boolean; showGap: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const arr = useMemo(() => arrangementOf(arrId), [arrId])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawKissing(canvas, {
        dirs: arr.dirs, showCaps, showGap,
        title: `${arr.label} · ${arr.dirs.length} 个邻球`,
        subtitle: `最小角距 ${(minPairAngle(arr.dirs) * DEG).toFixed(2)}°`,
        yaw: 0.6 + el * 0.2,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [arr, showCaps, showGap])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function KissingNumberSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return <KissingCanvas arrId="icosahedral" showCaps showGap={false} />
  }
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="接吻数问题" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const arrId = (ARRANGEMENTS as readonly string[]).includes(p.arrId as string)
    ? (p.arrId as ArrangementId)
    : 'icosahedral'
  return (
    <KissingCanvas
      arrId={arrId}
      showCaps={p.showCaps !== false}
      showGap={p.showGap === true}
    />
  )
}
