/**
 * Frobenius 硬币问题场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { COIN_SETS, frobeniusNumber } from '../../../../experiments/frobenius-coin/frobeniusCoin'
import { drawFrobeniusCoin } from '../../../../experiments/frobenius-coin/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'Frobenius硬币问题', subtitle: '无法凑出的最大金额' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'Frobenius硬币问题', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['互质面额才有解', '最大凑不出的金额', '即 Frobenius 数'],
    'sum-method': ['两枚硬币 ab−a−b', '多枚用完全背包 DP', '麦乐鸡数 43'],
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

function CoinCanvas({ setIdx }: { setIdx: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const coins = COIN_SETS[setIdx] ?? COIN_SETS[0]
    const frob = frobeniusNumber(coins)
    drawFrobeniusCoin(canvas, coins, Math.max(48, frob + 8))
  }, [setIdx])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function FrobeniusCoinSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CoinCanvas setIdx={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const setIdx = (scene.lineState?.params?.setIdx as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CoinCanvas key={setIdx} setIdx={setIdx} />
}
