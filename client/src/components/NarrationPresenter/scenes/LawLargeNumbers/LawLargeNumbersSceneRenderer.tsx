/**
 * 大数定律场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawLawLargeNumbers } from '../../../../experiments/law-large-numbers/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '大数定律', subtitle: '样本均值收敛到期望' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '大数定律', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['样本越多越稳', '均值贴近理论期望', '波动随 n 减小'],
    'sum-law': ['单次充满偶然', '海量数据透出必然', '统计与风控的基石'],
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

function LawLargeNumbersCanvas({ dist, n }: { dist: string; n: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawLawLargeNumbers(canvas, dist, n, 3, 1)
  }, [dist, n])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LawLargeNumbersSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <LawLargeNumbersCanvas dist="dice" n={200} />
  const id = scene.scene.id
  const type = scene.scene.type
  const dist = (scene.lineState?.params?.dist as string | undefined) ?? 'dice'
  const n = (scene.lineState?.params?.n as number | undefined) ?? 200

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <LawLargeNumbersCanvas key={`${dist}-${n}`} dist={dist} n={n} />
}
