/**
 * Cavalieri 原理 讲解场景渲染器
 *
 * 并排两个立体 + 一片滑动截面，用本实验专属的 draw.ts。
 * 静态图，不需要逐帧动画。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawCavalieri } from '../../../../experiments/cavalieri/draw'
import {
  sceneOf, SCENE_IDS, type SceneId,
} from '../../../../experiments/cavalieri/cavalieri'

const W = 640
const H = 540
const TITLES = {
  'intro-1': { title: 'Cavalieri 原理', subtitle: '截面积处处相等，体积就相等' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['两立体被平行平面所截', '若截面积总相等', '则体积相等'],
  'sum-2': ['棱锥截面按 (1−h/H)² 收缩', '积分给出 1/3', '这就是公式里那个 3'],
}

function CavCanvas({
  sceneId, h, exploded,
}: { sceneId: SceneId; h: number; exploded: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const sc = useMemo(() => sceneOf(sceneId, 1), [sceneId])
  const hh = Math.min(h, sc.left.height * 0.999)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawCavalieri(canvas, {
      left: sc.left, right: sc.right, h: hh, exploded,
      title: sc.label,
      subtitle: sc.claim,
    })
  }, [sc, hh, exploded])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function CavalieriSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CavCanvas sceneId="sphere" h={0.35} exploded={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="Cavalieri 原理" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const sceneId = (SCENE_IDS as readonly string[]).includes(p.sceneId as string)
    ? (p.sceneId as SceneId)
    : 'sphere'
  return (
    <CavCanvas
      sceneId={sceneId}
      h={typeof p.h === 'number' ? p.h : 0.35}
      exploded={p.exploded === true}
    />
  )
}
