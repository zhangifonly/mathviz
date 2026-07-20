/**
 * 反演几何场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { DEMO_SHAPES } from '../../../../experiments/inversive-geometry/inversiveGeometry'
import { drawInversiveGeometry } from '../../../../experiments/inversive-geometry/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-mirror': { title: '反演几何', subtitle: '圆与直线的互换' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '反演几何', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-formula': ['沿射线 OP 取像 P′', "|OP′|·|OP| = R²", '圆心映到无穷远'],
    'sum-unify': ['过 O 的圆变直线', '不过 O 的圆仍是圆', '圆与直线统一为广义圆'],
  }
  const list = items[sceneId] || []
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">回顾</h2>
      {list.map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
    </div>
  )
}

function InversiveCanvas({ radius, showImage }: { radius: number; showImage: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawInversiveGeometry(canvas, DEMO_SHAPES, radius, showImage)
  }, [radius, showImage])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function InversiveGeometrySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <InversiveCanvas radius={110} showImage />
  const id = scene.scene.id
  const type = scene.scene.type
  const radius = (scene.lineState?.params?.radius as number | undefined) ?? 110
  const showImage = (scene.lineState?.params?.showImage as boolean | undefined) ?? true

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <InversiveCanvas key={`${radius}-${showImage}`} radius={radius} showImage={showImage} />
}
