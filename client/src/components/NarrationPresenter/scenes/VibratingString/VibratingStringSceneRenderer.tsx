/**
 * 弦振动场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { type Mode } from '../../../../experiments/vibrating-string/vibratingString'
import { drawVibratingString } from '../../../../experiments/vibrating-string/draw'

const W = 640
const H = 540
const AMPS: Record<number, number> = { 1: 1, 2: 0.6, 3: 0.45 }

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '弦振动', subtitle: '驻波与泛音的乐章' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '弦振动', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-modes': ['两端固定弦', '只能以驻波振动', '第 n 阶有 n-1 个节点'],
    'sum-timbre': ['基频决定音高', '泛音配比决定音色', '任意弦形都是模态叠加'],
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

function StringCanvas({ modes }: { modes: number[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const ms: Mode[] = modes.map((n) => ({ n, amp: AMPS[n] ?? 0.4 }))
    const loop = (now: number) => {
      const canvas = ref.current
      if (canvas) {
        const t = (now - start) / 1000
        drawVibratingString(canvas, ms, t, true)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [modes])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function VibratingStringSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <StringCanvas modes={[1]} />
  const id = scene.scene.id
  const type = scene.scene.type
  const modes = (scene.lineState?.params?.modes as number[] | undefined) ?? [1]

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <StringCanvas key={modes.join('-')} modes={modes} />
}
