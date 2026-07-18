/**
 * 数字根场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { castingOutNines, type CastOp } from '../../../../experiments/digital-root/digitalRoot'
import { drawDigitalRoot, drawCasting } from '../../../../experiments/digital-root/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '数字根与弃九验算', subtitle: '模九的巧妙应用' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '数字根', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['反复各位数字相加', '直到只剩一位数', '这就是数字根'],
    'sum-mod': ['数字根等于原数模9', '余0时记作9', '弃九验算查算术'],
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

function RootCanvas({ n }: { n: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawDigitalRoot(canvas, n)
  }, [n])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

function CastCanvas({ a, b, op }: { a: number; b: number; op: CastOp }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawCasting(canvas, castingOutNines(a, b, op))
  }, [a, b, op])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DigitalRootSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <RootCanvas n={12345} />
  const id = scene.scene.id
  const type = scene.scene.type
  const params = scene.lineState?.params || {}

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  if (params.a !== undefined && params.b !== undefined) {
    const a = params.a as number
    const b = params.b as number
    const op = (params.op as CastOp) || 'add'
    return <CastCanvas key={`${a}-${b}-${op}`} a={a} b={b} op={op} />
  }
  const n = (params.n as number | undefined) ?? 12345
  return <RootCanvas key={n} n={n} />
}
