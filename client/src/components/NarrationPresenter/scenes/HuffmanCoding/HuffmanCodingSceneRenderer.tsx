/**
 * 哈夫曼编码场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { countFrequencies, buildHuffmanTree } from '../../../../experiments/huffman-coding/huffmanCoding'
import { drawHuffmanCoding } from '../../../../experiments/huffman-coding/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '哈夫曼编码', subtitle: '最优前缀码压缩' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '哈夫曼编码', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['高频字符用短码', '任何码不是别人前缀', '解码无歧义'],
    'sum-greedy': ['合并两个最小频率', '贪心得到最优编码', 'ZIP/JPEG 的功臣'],
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

function HuffmanCanvas({ text }: { text: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawHuffmanCoding(canvas, buildHuffmanTree(countFrequencies(text)))
  }, [text])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function HuffmanCodingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <HuffmanCanvas text="abracadabra" />
  const id = scene.scene.id
  const type = scene.scene.type
  const text = (scene.lineState?.params?.text as string | undefined) ?? 'abracadabra'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <HuffmanCanvas key={text} text={text} />
}
