/**
 * 谢尔宾斯基三角场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawSierpinskiTriangle } from '../../../../experiments/sierpinski-triangle/draw'
import type { Mode } from '../../../../experiments/sierpinski-triangle/sierpinskiTriangle'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '谢尔宾斯基三角', subtitle: '挖不完洞的分形' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '谢尔宾斯基三角', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['不停挖掉中心', '第 n 层留 3ⁿ 个三角', '局部与整体自相似'],
    'sum-unify': ['递归的秩序', '混沌游戏的随机', '殊途同归到同一分形'],
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

function SierpinskiCanvas({ mode, level }: { mode: Mode; level: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawSierpinskiTriangle(canvas, mode, level, 1)
  }, [mode, level])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function SierpinskiTriangleSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <SierpinskiCanvas mode="recursive" level={4} />
  const id = scene.scene.id
  const type = scene.scene.type
  const mode = ((scene.lineState?.params?.mode as Mode | undefined) ?? 'recursive')
  const level = (scene.lineState?.params?.level as number | undefined) ?? 4

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <SierpinskiCanvas key={`${mode}-${level}`} mode={mode} level={level} />
}
