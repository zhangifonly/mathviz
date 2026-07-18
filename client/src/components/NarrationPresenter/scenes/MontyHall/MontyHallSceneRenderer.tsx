/**
 * 蒙提霍尔问题场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawMontyHall } from '../../../../experiments/monty-hall/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '蒙提霍尔问题', subtitle: '三门之谜，换还是不换' },
    'sum-end': { title: '感谢观看', subtitle: '相信数学，别只信直觉' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '蒙提霍尔问题', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-info': ['主持人只开有羊的门', '初选中奖仅 1/3', '开门泄露了信息'],
    'sum-rate': ['换门胜率 2/3', '不换胜率 1/3', '蒙特卡洛模拟验证'],
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

function MontyHallCanvas({ trials }: { trials: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawMontyHall(canvas, trials, 1)
  }, [trials])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function MontyHallSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <MontyHallCanvas trials={200} />
  const id = scene.scene.id
  const type = scene.scene.type
  const trials = (scene.lineState?.params?.trials as number | undefined) ?? 200

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <MontyHallCanvas key={trials} trials={trials} />
}
