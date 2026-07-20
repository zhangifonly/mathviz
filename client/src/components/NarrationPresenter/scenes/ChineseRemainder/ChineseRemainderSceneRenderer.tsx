/**
 * 中国剩余定理场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLES } from '../../../../experiments/chinese-remainder/chineseRemainder'
import { drawChineseRemainder } from '../../../../experiments/chinese-remainder/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '中国剩余定理', subtitle: '物不知数的千年智慧' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '中国剩余定理', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-merge': ['一组同余条件', '模两两互质', '合并成唯一解'],
    'sum-apply': ['古代韩信点兵', '大衍求一术', '现代 RSA 加速'],
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

function CrtCanvas({ sample }: { sample: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const s = SAMPLES[sample] || SAMPLES[0]
    drawChineseRemainder(canvas, s.remainders, s.moduli, -1)
  }, [sample])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function ChineseRemainderSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CrtCanvas sample={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const sample = (scene.lineState?.params?.sample as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CrtCanvas key={sample} sample={sample} />
}
