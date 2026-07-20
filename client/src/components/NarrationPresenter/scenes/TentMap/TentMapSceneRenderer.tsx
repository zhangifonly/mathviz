/**
 * 帐篷映射场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawTentMap } from '../../../../experiments/tent-map/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '帐篷映射', subtitle: '分段线性的混沌' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '帐篷映射', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['两段直线的折线', '拉伸再折叠', '简单规则生成混沌'],
    'sum-chaos': ['mu=2 达到满混沌', '对初值极其敏感', '轨迹几乎填满区间'],
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

function TentMapCanvas({ mu, start }: { mu: number; start: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawTentMap(canvas, mu, start, 40)
  }, [mu, start])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function TentMapSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <TentMapCanvas mu={2} start={0.2} />
  const id = scene.scene.id
  const type = scene.scene.type
  const mu = (scene.lineState?.params?.mu as number | undefined) ?? 2
  const start = (scene.lineState?.params?.start as number | undefined) ?? 0.2

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <TentMapCanvas key={`${mu}-${start}`} mu={mu} start={start} />
}
