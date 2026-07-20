/**
 * 斯坦纳链场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawSteinerChain } from '../../../../experiments/steiner-chain/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '斯坦纳链', subtitle: '首尾相切的圆环链' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '斯坦纳链', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['夹在两圆之间', '首尾相切成链', '内切外·外切内'],
    'sum-porism': ['闭合条件由半径定', '闭合一次即可旋转', '反演生成一般链'],
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

function ChainCanvas({ count, mode }: { count: number; mode: 'general' | 'concentric' }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let raf = 0
    let rot = 0
    const loop = () => {
      const canvas = ref.current
      if (canvas) {
        rot += 0.006
        drawSteinerChain(canvas, count, rot, mode)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [count, mode])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function SteinerChainSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <ChainCanvas count={6} mode="general" />
  const id = scene.scene.id
  const type = scene.scene.type
  const count = (scene.lineState?.params?.count as number | undefined) ?? 6
  const mode = (scene.lineState?.params?.mode as 'general' | 'concentric' | undefined) ?? 'general'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <ChainCanvas key={`${count}-${mode}`} count={count} mode={mode} />
}
