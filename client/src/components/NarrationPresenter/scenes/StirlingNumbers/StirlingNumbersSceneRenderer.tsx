/**
 * 斯特林数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { MAX_N } from '../../../../experiments/stirling-numbers/stirlingNumbers'
import { drawStirlingNumbers } from '../../../../experiments/stirling-numbers/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '斯特林数', subtitle: '划分与循环的计数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '斯特林数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['第二类数集合划分', '第一类数循环排列', '都由简洁递推生成'],
    'sum-connect': ['行和给出贝尔数与 n!', '连接集合与排列', '组合计数的核心工具'],
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

function StirlingCanvas({ kind, hn, hk }: { kind: 'first' | 'second'; hn: number; hk: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawStirlingNumbers(canvas, MAX_N, kind, [hn, Math.min(hk, hn)])
  }, [kind, hn, hk])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function StirlingNumbersSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <StirlingCanvas kind="second" hn={5} hk={2} />
  const id = scene.scene.id
  const type = scene.scene.type
  const kind = ((scene.lineState?.params?.kind as string | undefined) ?? 'second') as 'first' | 'second'
  const hn = (scene.lineState?.params?.hn as number | undefined) ?? 5
  const hk = (scene.lineState?.params?.hk as number | undefined) ?? 2

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <StirlingCanvas key={`${kind}-${hn}-${hk}`} kind={kind} hn={hn} hk={hk} />
}
