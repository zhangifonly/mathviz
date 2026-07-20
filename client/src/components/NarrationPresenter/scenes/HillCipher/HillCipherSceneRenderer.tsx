/**
 * 希尔密码场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { KEY_MATRIX } from '../../../../experiments/hill-cipher/hillCipher'
import { drawHillCipher } from '../../../../experiments/hill-cipher/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '希尔密码', subtitle: '用矩阵守护秘密' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '希尔密码', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['字母块合成二维向量', '密钥矩阵乘向量', '结果对 26 取模得密文'],
    'sum-inv': ['解密用模 26 逆矩阵', '行列式须与 26 互质', '线性代数守护秘密'],
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

function HillCanvas({ text, block }: { text: string; block: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawHillCipher(canvas, text, KEY_MATRIX, block)
  }, [text, block])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function HillCipherSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <HillCanvas text="HELLO" block={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const text = (scene.lineState?.params?.text as string | undefined) ?? 'HELLO'
  const block = (scene.lineState?.params?.block as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <HillCanvas key={`${text}-${block}`} text={text} block={block} />
}
