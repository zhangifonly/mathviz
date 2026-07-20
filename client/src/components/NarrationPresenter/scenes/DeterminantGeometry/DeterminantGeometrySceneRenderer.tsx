/**
 * 行列式的几何意义场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_MATRICES } from '../../../../experiments/determinant-geometry/determinantGeometry'
import { drawDeterminantGeometry } from '../../../../experiments/determinant-geometry/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '行列式的几何意义', subtitle: '面积与体积的缩放' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '行列式的几何意义', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['两列=两边向量', '平行四边形面积=|det|', 'det是面积缩放因子'],
    'sum-sign': ['符号记录定向翻转', 'det=0 表示降维压扁', '一个数读懂整个变换'],
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

function DeterminantCanvas({ matrixIndex }: { matrixIndex: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const m = SAMPLE_MATRICES[matrixIndex]?.matrix ?? SAMPLE_MATRICES[0].matrix
    drawDeterminantGeometry(canvas, m, true)
  }, [matrixIndex])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DeterminantGeometrySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DeterminantCanvas matrixIndex={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const matrixIndex = (scene.lineState?.params?.matrixIndex as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <DeterminantCanvas key={matrixIndex} matrixIndex={matrixIndex} />
}
