/**
 * 捕食者猎物模型 场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { PARAMS } from '../../../../experiments/lotka-volterra/lotkaVolterra'
import { drawLotkaVolterra } from '../../../../experiments/lotka-volterra/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '捕食者猎物模型', subtitle: '狐狸与兔子的周期' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '捕食者猎物模型', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['两率相互牵制', '此消彼长的振荡', '捕食者峰值滞后'],
    'sum-loop': ['相平面闭合轨道', '守恒量保持不变', '系统周而复始'],
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

function LotkaVolterraCanvas({ prey, beta }: { prey: number; beta: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawLotkaVolterra(canvas, { ...PARAMS, beta }, prey, 5, 2000, 0.02)
  }, [prey, beta])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function LotkaVolterraSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <LotkaVolterraCanvas prey={10} beta={PARAMS.beta} />
  const id = scene.scene.id
  const type = scene.scene.type
  const prey = (scene.lineState?.params?.prey as number | undefined) ?? 10
  const beta = (scene.lineState?.params?.beta as number | undefined) ?? PARAMS.beta

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <LotkaVolterraCanvas key={`${prey}-${beta}`} prey={prey} beta={beta} />
}
