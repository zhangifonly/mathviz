/**
 * 三维旋转矩阵场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawRotation3d } from '../../../../experiments/rotation3d/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '三维旋转矩阵', subtitle: '欧拉角与空间旋转' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '三维旋转矩阵', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-blocks': ['绕 X/Y/Z 三个基本旋转', '由正弦余弦构成', '旋转矩阵保持正交'],
    'sum-compose': ['按欧拉角依次相乘', '组合出任意空间朝向', '注意顺序与万向锁'],
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

function CubeCanvas({ ax, ay, az }: { ax: number; ay: number; az: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawRotation3d(canvas, ax, ay, az)
  }, [ax, ay, az])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function Rotation3dSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CubeCanvas ax={25} ay={35} az={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = scene.lineState?.params
  const ax = (p?.ax as number | undefined) ?? 25
  const ay = (p?.ay as number | undefined) ?? 35
  const az = (p?.az as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CubeCanvas key={`${ax}-${ay}-${az}`} ax={ax} ay={ay} az={az} />
}
