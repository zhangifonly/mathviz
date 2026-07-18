/**
 * 贝塞尔函数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawBesselFunctions } from '../../../../experiments/bessel-functions/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '贝塞尔函数', subtitle: '圆膜振动的解' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '贝塞尔函数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['贝塞尔方程来自圆膜振动', '径向部分的解即 J_n', '阶数 n 决定模态'],
    'sum-zeros': ['幂级数给出衰减振荡', '每个零点对应一圈节圆', '零点决定鼓的音高'],
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

function BesselCanvas({ orders }: { orders: number[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawBesselFunctions(canvas, orders, 20, true)
  }, [orders])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function BesselFunctionsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <BesselCanvas orders={[0, 1, 2]} />
  const id = scene.scene.id
  const type = scene.scene.type
  const orders = (scene.lineState?.params?.orders as number[] | undefined) ?? [0, 1, 2]

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <BesselCanvas key={orders.join('-')} orders={orders} />
}
