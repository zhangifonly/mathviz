/**
 * 卡特兰数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawCatalanNumbers, type CatalanMode } from '../../../../experiments/catalan-numbers/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '卡特兰数', subtitle: '括号树与三角剖分' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '卡特兰数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recur': ['卷积递推 C(n+1)=ΣC(i)C(n-i)', '闭式 C(2n,n)/(n+1)', '数列 1,1,2,5,14,42'],
    'sum-unite': ['合法括号序列', '二叉树形态', '多边形三角剖分'],
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

function CatalanCanvas({ n, mode }: { n: number; mode: CatalanMode }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawCatalanNumbers(canvas, n, mode)
  }, [n, mode])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function CatalanNumbersSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CatalanCanvas n={4} mode="poly" />
  const type = scene.scene.type
  const id = scene.scene.id
  const n = (scene.lineState?.params?.n as number | undefined) ?? 4
  const mode = (scene.lineState?.params?.mode as CatalanMode | undefined) ?? 'poly'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CatalanCanvas key={`${n}-${mode}`} n={n} mode={mode} />
}
