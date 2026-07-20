/**
 * 最大流最小割场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_NETWORK } from '../../../../experiments/network-flow/networkFlow'
import { drawNetworkFlow } from '../../../../experiments/network-flow/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '最大流最小割', subtitle: '增广路径求最大流' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '最大流最小割', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['容量限制下的最大输送', '流量不超过容量', '中间节点流入等于流出'],
    'sum-thm': ['BFS 反复找增广路径', '推送瓶颈流量', '最大流恒等于最小割'],
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

function NetworkCanvas({ showFlow, highlightCut }: { showFlow: boolean; highlightCut: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawNetworkFlow(canvas, SAMPLE_NETWORK, { showFlow, highlightCut })
  }, [showFlow, highlightCut])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function NetworkFlowSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <NetworkCanvas showFlow={false} highlightCut={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  const showFlow = (scene.lineState?.params?.showFlow as boolean | undefined) ?? false
  const highlightCut = (scene.lineState?.params?.highlightCut as boolean | undefined) ?? false

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <NetworkCanvas key={`${id}`} showFlow={showFlow} highlightCut={highlightCut} />
}
