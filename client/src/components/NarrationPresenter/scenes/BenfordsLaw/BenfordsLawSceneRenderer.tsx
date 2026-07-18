/**
 * 本福特定律场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_COUNT, type DatasetType } from '../../../../experiments/benfords-law/benfordsLaw'
import { drawBenfordsLaw } from '../../../../experiments/benfords-law/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '本福特定律', subtitle: '首位数字的分布' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '本福特定律', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['首位为 d 的概率', '等于 log(1 + 1/d)', '1 约占三成，9 仅 4.6%'],
    'sum-when': ['跨量级数据才服从', '均匀随机数不服从', '可用于反欺诈审计'],
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

function BenfordCanvas({ dataset }: { dataset: DatasetType }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawBenfordsLaw(canvas, dataset, SAMPLE_COUNT)
  }, [dataset])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function BenfordsLawSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <BenfordCanvas dataset="powers2" />
  const id = scene.scene.id
  const type = scene.scene.type
  const dataset = (scene.lineState?.params?.dataset as DatasetType | undefined) ?? 'powers2'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <BenfordCanvas key={dataset} dataset={dataset} />
}
