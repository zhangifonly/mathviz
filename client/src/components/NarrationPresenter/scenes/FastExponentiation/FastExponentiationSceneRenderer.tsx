/**
 * 快速幂场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawFastExponentiation } from '../../../../experiments/fast-exponentiation/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '快速幂', subtitle: '对数次乘法算幂' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '快速幂', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['指数写成二进制', '底数每步平方', '遇 1 就乘入结果'],
    'sum-log': ['乘法次数由线性降到对数', '大指数瞬间算出', '取模全程用大整数'],
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

function PowCanvas({ base, exp, mod, highlight }: { base: number; exp: number; mod: number; highlight: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawFastExponentiation(canvas, base, exp, mod, highlight)
  }, [base, exp, mod, highlight])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function FastExponentiationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PowCanvas base={2} exp={100} mod={1000000007} highlight={-1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params ?? {}
  const base = (p.base as number | undefined) ?? 2
  const exp = (p.exp as number | undefined) ?? 100
  const mod = (p.mod as number | undefined) ?? 0
  const highlight = (p.highlight as number | undefined) ?? -1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PowCanvas key={`${base}-${exp}-${mod}-${highlight}`} base={base} exp={exp} mod={mod} highlight={highlight} />
}
