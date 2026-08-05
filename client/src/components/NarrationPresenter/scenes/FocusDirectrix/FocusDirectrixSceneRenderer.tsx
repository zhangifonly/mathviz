/**
 * 焦点准线统一定义 讲解场景渲染器
 *
 * 平面图，用本实验专属的 draw.ts。静态图，不需要逐帧动画。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawFocusDirectrix } from '../../../../experiments/focus-directrix/draw'

const W = 640
const H = 540
const TITLES = {
  'pr-1': { title: '焦点准线统一定义', subtitle: '一条比值定出椭圆、抛物线、双曲线' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['到焦点距离 ÷ 到准线距离', '恒等于离心率 e', '与点在曲线上的位置无关'],
  'sum-2': ['e<1 椭圆，e=1 抛物线', 'e>1 双曲线，e=0 退化成圆', '三种曲线是同一规则的三段取值'],
}

function FDCanvas({
  e, theta, showRatio,
}: { e: number; theta: number; showRatio: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawFocusDirectrix(canvas, { e, l: 2, theta, showRatio })
  }, [e, theta, showRatio])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function FocusDirectrixSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <FDCanvas e={0.5} theta={1.1} showRatio />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="焦点准线统一定义" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <FDCanvas
      e={typeof p.e === 'number' ? p.e : 0.5}
      theta={typeof p.theta === 'number' ? p.theta : 1.1}
      showRatio={p.showRatio !== false}
    />
  )
}
