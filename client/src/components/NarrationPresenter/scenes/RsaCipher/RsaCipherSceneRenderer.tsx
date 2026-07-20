/**
 * RSA 加密场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_PRIMES } from '../../../../experiments/rsa-cipher/rsaCipher'
import { drawRsaCipher } from '../../../../experiments/rsa-cipher/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'RSA加密', subtitle: '公钥密码与大数分解' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'RSA加密', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['一对素数造出公私钥', '公钥公开加密', '私钥私密解密'],
    'sum-secure': ['安全来自大数分解难题', '守护 HTTPS 与数字签名', '简单数论撑起数字世界'],
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

function RsaCanvas({ stage, pairIndex }: { stage: number; pairIndex: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const [p, q] = SAMPLE_PRIMES[pairIndex % SAMPLE_PRIMES.length]
    drawRsaCipher(canvas, p, q, 42, stage)
  }, [stage, pairIndex])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function RsaCipherSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <RsaCanvas stage={2} pairIndex={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const stage = (scene.lineState?.params?.stage as number | undefined) ?? 2
  const pairIndex = (scene.lineState?.params?.pairIndex as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <RsaCanvas key={`${stage}-${pairIndex}`} stage={stage} pairIndex={pairIndex} />
}
