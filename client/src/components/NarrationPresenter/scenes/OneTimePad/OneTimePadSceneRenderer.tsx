/**
 * 一次一密场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { generateKey, toBytes } from '../../../../experiments/one-time-pad/oneTimePad'
import { drawOneTimePad } from '../../../../experiments/one-time-pad/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '一次一密', subtitle: '完美保密的异或' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '一次一密', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['明文逐位异或密钥', '密钥真随机且等长', '达到完美保密'],
    'sum-caveat': ['密钥只能用一次', '重用会抵消泄露', '最简运算最坚固'],
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

function PadCanvas({ text, mode }: { text: string; mode: 'encrypt' | 'reuse' }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const key = generateKey(toBytes(text).length, 20260718)
    drawOneTimePad(canvas, text, key, mode)
  }, [text, mode])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function OneTimePadSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PadCanvas text="HELLO" mode="encrypt" />
  const id = scene.scene.id
  const type = scene.scene.type
  const text = (scene.lineState?.params?.text as string | undefined) ?? 'HELLO'
  const mode = (scene.lineState?.params?.mode as 'encrypt' | 'reuse' | undefined) ?? 'encrypt'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PadCanvas key={`${text}-${mode}`} text={text} mode={mode} />
}
