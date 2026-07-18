/**
 * 有理函数与渐近线场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { RATIONAL_EXAMPLES } from '../../../../experiments/rational-asymptotes/rationalAsymptotes'
import { drawRationalAsymptotes } from '../../../../experiments/rational-asymptotes/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '有理函数与渐近线', subtitle: '曲线的无限逼近' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '有理函数与渐近线', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['竖直渐近线来自分母的根', '末端渐近线看次数比较', '曲线无限逼近却不相交'],
    'sum-rules': ['低次趋于零 (y=0)', '等次取最高次系数比', '高一次用长除求斜线'],
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

function RationalCanvas({ example }: { example: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ex = RATIONAL_EXAMPLES[example] || RATIONAL_EXAMPLES[0]
    drawRationalAsymptotes(canvas, ex.num, ex.den)
  }, [example])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function RationalAsymptotesSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <RationalCanvas example={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const example = (scene.lineState?.params?.example as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <RationalCanvas key={example} example={example} />
}
