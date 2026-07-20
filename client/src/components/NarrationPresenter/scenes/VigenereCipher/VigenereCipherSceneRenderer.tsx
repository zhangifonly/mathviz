/**
 * 维吉尼亚密码场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE } from '../../../../experiments/vigenere-cipher/vigenereCipher'
import { drawVigenereCipher } from '../../../../experiments/vigenere-cipher/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '维吉尼亚密码', subtitle: '多表移位加密' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '维吉尼亚密码', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['密钥循环对齐明文', '每位用不同移位表', '模 26 加法得密文'],
    'sum-strong': ['抹平字母频率', '统计分析失灵', '远比凯撒密码坚固'],
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

function VigenereCanvas({ col }: { col: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawVigenereCipher(canvas, SAMPLE.plaintext, SAMPLE.key, col)
  }, [col])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function VigenereCipherSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <VigenereCanvas col={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const col = (scene.lineState?.params?.col as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <VigenereCanvas key={col} col={col} />
}
