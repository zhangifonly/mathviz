/**
 * 信息熵与信源编码定理 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawEntropyCoding } from '../../../../experiments/entropy-coding/draw'
import type { Dist } from '../../../../experiments/entropy-coding/entropyCoding'

const W = 680
const H = 560
const TITLES = {
  'ga-1': { title: '信息熵与信源编码定理', subtitle: '熵就是压缩的极限，哈夫曼差它不到一比特' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['连续性 + 单调性 + 可加性', '三条要求唯一确定了 −Σp log p', '只差一个常数因子，即对数的底'],
  'sum-2': ['H(p) ≤ L* < H(p) + 1', '熵是压缩的硬极限', '哈夫曼是能逼近它的构造'],
  'sum-3': ['p 是 2 的幂 ⇒ 一比特不浪费', '否则有缺口，分组能摊薄到 1/k', '穹顶与阶梯之间就是取整的代价'],
}

type Flags = [boolean, boolean, boolean]

function ECCanvas({
  p, show, camYaw,
}: { p: Dist; show: Flags; camYaw: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawEntropyCoding(canvas, { p, show, camYaw })
  }, [p, show, camYaw])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

const isDist = (v: unknown): v is Dist =>
  Array.isArray(v) && v.length >= 2 && v.every((x) => typeof x === 'number')
const isFlags = (v: unknown): v is Flags =>
  Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === 'boolean')

export default function EntropyCodingSceneRenderer({ scene }: SceneRendererProps) {
  const fallback: Dist = [0.7, 0.2, 0.1]
  if (!scene) return <ECCanvas p={fallback} show={[true, true, false]} camYaw={0.68} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="信息熵与信源编码定理" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <ECCanvas
      p={isDist(p.p) ? p.p : fallback}
      show={isFlags(p.show) ? p.show : [true, true, false]}
      camYaw={typeof p.camYaw === 'number' ? p.camYaw : 0.68}
    />
  )
}
