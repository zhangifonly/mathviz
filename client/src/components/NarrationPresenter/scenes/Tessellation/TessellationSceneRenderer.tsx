/**
 * 密铺镶嵌场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawTessellation } from '../../../../experiments/tessellation/draw'
import type { TilingType } from '../../../../experiments/tessellation/tessellation'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '密铺镶嵌', subtitle: '用多边形铺满平面' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '密铺镶嵌', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['不留缝铺满平面', '不重叠也不间断', '这就是密铺镶嵌'],
    'sum-cond': ['顶点角度和为360°', '单一正多边形只有三四六', '简单规则生成秩序美'],
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

function TessellationCanvas({ type }: { type: TilingType }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawTessellation(canvas, type, 46)
  }, [type])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function TessellationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TessellationCanvas type="hexagon" />
  const id = scene.scene.id
  const type = scene.scene.type
  const tiling = (scene.lineState?.params?.type as TilingType | undefined) ?? 'hexagon'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TessellationCanvas key={tiling} type={tiling} />
}
