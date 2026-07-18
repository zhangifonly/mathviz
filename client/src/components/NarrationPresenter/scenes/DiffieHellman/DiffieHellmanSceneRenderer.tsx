/**
 * 迪菲-赫尔曼密钥交换场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE } from '../../../../experiments/diffie-hellman/diffieHellman'
import { drawDiffieHellman } from '../../../../experiments/diffie-hellman/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '迪菲-赫尔曼密钥交换', subtitle: '在公开信道上协商秘密' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '迪菲-赫尔曼密钥交换', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-open': ['公开 p、g、A、B', '私钥 a、b 永不传输', '公开信道也能协商密钥'],
    'sum-secure': ['共享密钥 = g^(ab) mod p', '快速幂让计算轻松', '离散对数让破解无望'],
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

function DHCanvas({ a, b }: { a: number; b: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawDiffieHellman(canvas, SAMPLE.p, SAMPLE.g, a, b)
  }, [a, b])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function DiffieHellmanSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <DHCanvas a={6} b={9} />
  const id = scene.scene.id
  const type = scene.scene.type
  const a = (scene.lineState?.params?.a as number | undefined) ?? 6
  const b = (scene.lineState?.params?.b as number | undefined) ?? 9

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <DHCanvas key={`${a}-${b}`} a={a} b={b} />
}
