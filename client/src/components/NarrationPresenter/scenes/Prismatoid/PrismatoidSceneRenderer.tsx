/**
 * Prismatoid 公式 讲解场景渲染器
 *
 * 左边立体 + 右边 A(t) 曲线，用本实验专属的 draw.ts。
 * 静态图，不需要逐帧动画。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawPrismatoid } from '../../../../experiments/prismatoid/draw'
import {
  solidOf, SOLID_IDS, type SolidId,
} from '../../../../experiments/prismatoid/prismatoid'

const W = 660
const H = 540
const TITLES = {
  'intro-1': { title: '拟柱体公式', subtitle: '只量三个截面就能算出体积' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['下底、正中、上顶三个截面', '系数 1、4、1 再除以 6', '这就是全部所需'],
  'sum-2': ['柱、楔、锥、台、球', '五个体积公式', '全是同一条公式的特例'],
}

function PrismCanvas({
  solidId, focus,
}: { solidId: SolidId; focus: 0 | 1 | 2 | null }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const solid = useMemo(() => solidOf(solidId, 2), [solidId])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawPrismatoid(canvas, { solid, focus })
  }, [solid, focus])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function PrismatoidSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PrismCanvas solidId="sphere" focus={null} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="拟柱体公式" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const solidId = (SOLID_IDS as readonly string[]).includes(p.solidId as string)
    ? (p.solidId as SolidId)
    : 'sphere'
  const f = p.focus
  const focus = f === 0 || f === 1 || f === 2 ? f : null
  return <PrismCanvas solidId={solidId} focus={focus} />
}
