/**
 * 圆锥曲线的反射性质 讲解场景渲染器
 *
 * 平面图，用本实验专属的 draw.ts。静态图，不需要逐帧动画。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawConicReflection } from '../../../../experiments/conic-reflection/draw'
import { PRESETS } from '../../../../experiments/conic-reflection/conicReflection'

const W = 640
const H = 540
const TITLES = {
  'th-1': { title: '圆锥曲线的反射性质', subtitle: '入射角等于反射角，三种曲线是同一条理由' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['切线与两条焦半径成等角', '这就是反射定律本身', '三条课本性质合成一条'],
  'sum-2': ['曲线是距离和（或差）的等值线', '梯度 û₁±û₂ 沿角平分线', '等值线垂直于梯度，故等角'],
  'sum-3': ['抛物面天线、车灯、探照灯', '回音壁、体外碎石机', '卡塞格林望远镜的双曲面副镜'],
}

type Mode = 'single' | 'fan' | 'billiard'

function CRCanvas({ presetId, t, mode }: { presetId: string; t: number; mode: Mode }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const conic = (PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]).conic
    // 台球只对闭合曲线有意义
    const eff: Mode = mode === 'billiard' && conic.kind !== 'ellipse' ? 'single' : mode
    drawConicReflection(canvas, {
      conic, t,
      showTangent: true,
      showAngles: eff === 'single',
      bounces: eff === 'billiard' ? 9 : 0,
      rayFan: eff === 'fan' ? 11 : 0,
    })
  }, [presetId, t, mode])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function ConicReflectionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CRCanvas presetId="ellipse" t={1.1} mode="single" />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="圆锥曲线的反射性质" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  const mode: Mode =
    p.mode === 'fan' || p.mode === 'billiard' ? p.mode : 'single'
  return (
    <CRCanvas
      presetId={typeof p.presetId === 'string' ? p.presetId : 'ellipse'}
      t={typeof p.t === 'number' ? p.t : 1.1}
      mode={mode}
    />
  )
}
