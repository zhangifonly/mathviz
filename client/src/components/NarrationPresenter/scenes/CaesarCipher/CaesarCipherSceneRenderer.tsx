/**
 * 凯撒密码场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { encrypt, SAMPLE_TEXT } from '../../../../experiments/caesar-cipher/caesarCipher'
import { drawCaesarCipher } from '../../../../experiments/caesar-cipher/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '凯撒密码', subtitle: '移位替换与频率分析' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '凯撒密码', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['固定移位加密', '模 26 让字母循环', '密钥就是 shift'],
    'sum-crack': ['移位不改变频率', '卡方比对英文频率', '25 种密钥一击破解'],
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

function CipherCanvas({ shift }: { shift: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawCaesarCipher(canvas, shift, encrypt(SAMPLE_TEXT, shift))
  }, [shift])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function CaesarCipherSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <CipherCanvas shift={3} />
  const id = scene.scene.id
  const type = scene.scene.type
  const shift = (scene.lineState?.params?.shift as number | undefined) ?? 3

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <CipherCanvas key={shift} shift={shift} />
}
