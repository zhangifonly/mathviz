/**
 * 重积分场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { FUNCTIONS, DOMAINS } from '../../../../experiments/multiple-integral/multipleIntegral'
import { drawMultipleIntegral } from '../../../../experiments/multiple-integral/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '重积分', subtitle: '二重积分求体积' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '重积分', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['曲面下方切成小柱子', '底面积乘以高度', '累加得到二重积分'],
    'sum-iter': ['拆成两次一维积分', '先对 x 后对 y', '网格越密逼近越准'],
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

function IntegralCanvas({ n, fn, dom }: { n: number; fn: number; dom: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const f = FUNCTIONS[fn] ?? FUNCTIONS[0]
    const d = DOMAINS[dom] ?? DOMAINS[0]
    drawMultipleIntegral(canvas, f.f, d.xa, d.xb, d.ya, d.yb, n)
  }, [n, fn, dom])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function MultipleIntegralSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <IntegralCanvas n={8} fn={0} dom={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params
  const n = (p?.n as number | undefined) ?? 8
  const fn = (p?.fn as number | undefined) ?? 0
  const dom = (p?.dom as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <IntegralCanvas key={`${n}-${fn}-${dom}`} n={n} fn={fn} dom={dom} />
}
